const path = require("path");
const axios = require("axios");
const glob = require("glob");
const fetch = require("node-fetch");
const throttle = require("promise-ratelimit")(1200);
var ffmpeg = require("fluent-ffmpeg");
var command = ffmpeg();
const url = require("url");
const {
  app,
  BrowserWindow,

  ipcMain,
  dialog,
  shell,
} = require("electron");

const isDev = require("electron-is-dev");
const {
  setupTitlebar,
  attachTitlebarToWindow,
} = require("custom-electron-titlebar/main");

const { getAudioDurationInSeconds } = require("get-audio-duration");
const split = require("audio-split");
const { splitAudio } = require("audio-splitter");

const fs = require("fs");
const { IncomingMessage } = require("http");
let win;
let clipLength = 10;
let apiToken = "";

let speechLanguage = "ar";

let outputDirectory = path.join(__dirname, "..", "..", "..", "output/");
global.isFileProcessStopped = false;

//setupTitlebar();

function secondsToHHMMSS(seconds) {
  return new Date(seconds * 1000).toISOString().substring(11, 19);
}
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 480,
    height: 800,
    titleBarStyle: "hidden",
    frame: false,
    resizable: false,

    transparent: true,

    webPreferences: {
      enableRemoteModule: true,
      devTools: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.setMenuBarVisibility(false);
  //attachTitlebarToWindow(win);

  win.loadURL(
    isDev
      ? "http://localhost:3000/Login"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // win.loadURL(
  //   isDev
  //     ? "http://localhost:3000/Login"
  //     : url.format({
  //         pathname: path.join(__dirname, "index.html"),
  //         protocol: "file:",
  //         slashes: true,
  //       })
  // );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }

  if (!fs.existsSync("./output")) {
    fs.mkdirSync("./output");
  }
  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp");
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
const getClipsDurations = async (clips) => {
  let durations = [];
  for (let clip of clips) {
    const time = await getAudioDurationInSeconds(clip);
    durations.push(time);
  }
  return durations;
};
const filterText = (txt) => {
  return txt.replace(".", "\n");
};
const proccessFile = async (file, index) => {
  // create a tmp folder for the file in tmp folder
  const filePattern = outputDirectory;
  //console.log("filePattern", filePattern + file.name);
  const filesToDelete = glob.sync(`${file.name}.*`, {
    cwd: filePattern + "\\",
    absolute: true,
  });
  //console.log(filesToDelete);
  filesToDelete.map((file) => {
    fs.unlinkSync(file);
  });

  win.webContents.send("currentFile", file);

  const audioClips = glob.sync("tmp/*.*").sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true });
  });

  const durations = await getClipsDurations(audioClips);
  const getclipStart = (clipIdx) => {
    let clipStart = 0;
    for (let index = 0; index < clipIdx; index++) {
      clipStart = clipStart + durations[index];
    }
    return clipStart;
  };

  win.webContents.send("numberOfClips", audioClips.length);

  if (audioClips.length) {
    let idx = 0;
    for (const clip of audioClips) {
      if (global.isFileProcessStopped) return;

      win.webContents.send("currentClip", idx + 1);
      const startTime = new Date().getTime();
      let txt = await transcribeFile(clip, apiToken);
      const filteredText = filterText(txt.text);
      clipStartInMils = (txt.start % 1000).toString();
      clipEndInMils = (txt.end % 1000).toString();

      if (txt.text) {
        try {
          fs.writeFileSync(
            `${outputDirectory}/${file.name}.txt`,
            filteredText,
            {
              flag: "a",
            }
          );
          fs.writeFileSync(
            `${outputDirectory}/${file.name}.srt`,
            `\n${idx + 1}\n${secondsToHHMMSS(
              getclipStart(idx) + Math.abs(txt.start - 2) / 1000
            )},${clipStartInMils} --> ${secondsToHHMMSS(
              getclipStart(idx) + (txt.end - 2) / 1000
            )},${clipEndInMils}\n${filteredText}\n`,
            { flag: "a" }
          );

          win.webContents.send("currentSubtitle", filteredText);
        } catch (error) {
          throw { msg: "write to file error" };
        }
      }
      const endTime = new Date().getTime();
      const elapsedTime = endTime - startTime;
      win.webContents.send("timePerClip", elapsedTime);
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
  let json;

  try {
    const file = fs.readFileSync(clip);
    await throttle();
    let res = await fetch("https://api.wit.ai/speech", {
      method: "post",
      body: file,
      headers: {
        "Content-Type": "audio/mpeg",
        Accept: "application/vnd.wit.20200513+json",
        Authorization: `Bearer ${token}`,
      },
    });

    json = await res.json();
    //console.log(json);
    win.webContents.send("APIHit");
    if (json.text) {
      const start = json.speech.tokens[0].start;
      const end = json.speech.tokens[json.speech.tokens.length - 1].end;
      return { text: json.text, start: start, end: end };
    } else {
      return { text: "", start: 0, end: 0 };
    }
  } catch (error) {
    throw { msg: "Network Error" };
  }
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
ipcMain.on("minimize", () => {
  win.minimize();
});
ipcMain.on("openLink", (e, link) => {
  e.preventDefault();
  shell.openExternal(link);
});

ipcMain.on("openOutputDir", (e, dir) => {
  if (dir === "null" || dir === "") {
    shell.openPath(outputDirectory);
  } else {
    shell.openPath(dir);
  }
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
ipcMain.on("start", async (e, files, token, speechLanguage, outputDir) => {
  cleanTmpFolder();
  //console.log(speechLanguage, outputDir);
  apiToken = token;
  speechLanguage = speechLanguage;
  if (outputDir) {
    outputDirectory = outputDir;
  }
  global.isFileProcessStopped = false;

  let idx = 0;
  try {
    for (const file of files) {
      win.webContents.send("step", 0);
      const watcher = fs.watch("tmp/", (event) => {
        if (event == "change") {
          if (!global.isFileProcessStopped) {
            win.webContents.send("clipCreated");
          }
        }
      });
      if (global.isFileProcessStopped) {
        // watcher.close();
        win.webContents.send("processComplete");

        return;
      }

      try {
        //await splitAwaited(file.path);
        await splitAudio({
          mergedTrack: file.path,
          outputDir: "tmp/",
          minSilenceLength: 1,
          minSongLength: 8,
          maxNoiseLevel: -15,
        });
        watcher.close();
      } catch (error) {
        if (error.msg) {
          if (error.msg == "Stopped") {
            global.isFileProcessStopped = false;
            watcher.close();
            win.webContents.send("processComplete");
            return;
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
      win.webContents.send("step", 1);
      await proccessFile(file, idx);

      idx = idx + 1;
    }
  } catch (error) {
    console.log(error);
    if (error.msg) {
      win.webContents.send("error", error.msg);
    } else {
      win.webContents.send("error", "Error");
    }
    win.webContents.send("processComplete");
  }

  win.webContents.send("processComplete");
});

ipcMain.on("stop", (e) => {
  global.isFileProcessStopped = true;
  win.webContents.send("step", -1);
  // cleanTmpFolder();
});
const cleanTmpFolder = () => {
  const audioClips = glob.sync("tmp/*.*");

  if (audioClips.length) {
    audioClips.map((clip, index) => {
      fs.unlinkSync(clip);
    });
  }
};

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
