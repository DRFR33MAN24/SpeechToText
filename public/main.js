const path = require("path");
const axios = require("axios");
const glob = require("glob");
const {
  app,
  BrowserWindow,

  ipcMain,
  dialog,
} = require("electron");

const isDev = require("electron-is-dev");
const {
  setupTitlebar,
  attachTitlebarToWindow,
} = require("custom-electron-titlebar/main");

const { getAudioDurationInSeconds } = require("get-audio-duration");
const split = require("audio-split");
const fs = require("fs");
const { IncomingMessage } = require("http");
let win;
let clipLength = 10;
let apiToken = "";

let speechLanguage = "ar";

let outputDirectory = "output/";
let pause = false;
//setupTitlebar();

function secondsToHHMMSS(seconds) {
  return new Date(seconds * 1000).toISOString().substring(11, 16);
}
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 480,
    height: 800,
    titleBarStyle: "hidden",
    frame: false,
    resizable: true,

    transparent: true,

    webPreferences: {
      enableRemoteModule: true,
      devTools: true,
      nodeIntegration: true,
      contextIsolation: false,
      //preload: path.join(__dirname, "preload.js")
    },
  });
  win.setMenuBarVisibility(false);
  //attachTitlebarToWindow(win);

  win.loadURL(
    isDev
      ? "http://localhost:3000/Login"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

if (process.platform === "linux") {
  // app.commandLine.appendSwitch('enable-transparent-visuals');
  // app.disableHardwareAcceleration();
  //app.on('ready', () => setTimeout(createWindow, 600));
}

const getFilesDurations = async (files) => {
  for (let file of files) {
    const time = await getAudioDurationInSeconds(file.path);
    file.duration = time;
  }
  return files;
};

const proccessFile = async (file, index) => {
  // create a tmp folder for the file in tmp folder

  win.webContents.send("currentFile", file);
  win.webContents.send("step", 0);

  const audioClips = glob.sync("tmp/*.*");

  win.webContents.send("numberOfClips", audioClips.length);
  win.webContents.send("step", 1);
  if (audioClips.length) {
    let idx = 0;
    for (const clip of audioClips) {
      // (async () => {
      //notify current clip
      win.webContents.send("currentClip", idx + 1);

      let txt = await transcribeFile(clip, apiToken);
      console.log(txt);
      // })();
      if (txt) {
        fs.writeFileSync(`${outputDirectory}${file.name}.txt`, txt, {
          flag: "a",
        });
        fs.writeFileSync(
          `${outputDirectory}${file.name}.srt`,
          `${idx}\n${secondsToHHMMSS(clipLength * idx)} ---> ${secondsToHHMMSS(
            clipLength * idx + clipLength
          )}\n${txt}`,
          { flag: "a" }
        );

        win.webContents.send("currentSubtitle", txt);
      }

      idx += 1;
    }
  }

  if (audioClips.length) {
    audioClips.map((clip, index) => {
      fs.unlinkSync(clip);
    });
  }
  //notify file procced
  win.webContents.send("fileComplete", index);
};

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
const transcribeFile = async (clip, token) => {
  let res;
  try {
    const file = fs.readFileSync(clip);
    res = await axios.post("https://api.wit.ai/speech?v=20220622", file, {
      headers: {
        "Content-Type": "audio/mpeg",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(JSON.parse(res.data));
  } catch (error) {
    console.log(error);
  }

  await sleep(2000);
  win.webContents.send("APIHit");

  return res.data.text;
};
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("quit", () => {
  app.quit();
});

ipcMain.on("getDurations", async (e, files) => {
  const durations = await getFilesDurations(files);
  e.reply("getDurations-reply", durations);
});

const splitAwaited = (path) => {
  return new Promise((resolve, reject) => {
    split(
      {
        filepath: path,
        minClipLength: clipLength,
        maxClipLength: clipLength,
        outputPath: "tmp/",
      },

      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
};
ipcMain.on(
  "start",
  async (e, files, token, speechLanguage, outputDirectory) => {
    console.log(token, speechLanguage, outputDirectory);
    apiToken = token;
    speechLanguage = speechLanguage;
    outputDirectory = outputDirectory;
    let idx = 0;
    for (const file of files) {
      await splitAwaited(file.path);
      await proccessFile(file, idx, token, speechLanguage, outputDirectory);
      idx = idx + 1;
    }

    win.webContents.send("processComplete");
  }
);

ipcMain.on("stop", (e) => {
  pause = true;
  const audioClips = glob.sync("tmp/*.*");

  // if (audioClips.length) {
  //   audioClips.map((clip, index) => {
  //     fs.unlinkSync(clip);
  //   });
  // }
});

ipcMain.on("chooseDir", (event) => {
  // If the platform is 'win32' or 'Linux'
  if (process.platform !== "darwin") {
    // Resolves to a Promise<Object>
    dialog
      .showOpenDialog({
        title: "Select the File to be uploaded",
        defaultPath: path.join(__dirname, "../assets/"),
        buttonLabel: "Select",
        // Restricting the user to only Text Files.
        // filters: [
        //   {
        //     name: "Text Files",
        //     extensions: ["txt", "docx"],
        //   },
        // ],
        // Specifying the File Selector Property
        properties: ["openFile", "openDirectory"],
      })
      .then((file) => {
        // Stating whether dialog operation was
        // cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
          const filepath = file.filePaths[0].toString();
          console.log(filepath);
          event.reply("file", filepath);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
ipcMain.on("changeWindowSize", (e, width, height, isMaximizable) => {
  let win = BrowserWindow.fromWebContents(e.sender);
  win.setSize(width, height);
  win.isMaximizable(isMaximizable);
  win.isResizable(isMaximizable);
  win.isFullScreenable(isMaximizable);
  //win.setFullScreen(isMaximizable);
  // e.reply("onWindowTitleChanged", "title");
});
