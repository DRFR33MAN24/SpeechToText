const path = require("path");
const axios = require("axios");
const glob = require("glob");
const fetch = require("node-fetch");
const throttle = require("promise-ratelimit")(1200);
const { extractAudio } = require("audio-splitter");
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

const fs = require("fs");
const { IncomingMessage } = require("http");
let win;
let clipLength = 10;
let apiToken = "";

let speechLanguage = "ar";

const maxDelay = 100;
const offset = 17900;
const cutLength = 18000;

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
const writeSubtitle = (file, id, start, end, content) => {
  const startMils = start % 1000;
  const endMils = end % 1000;
  filteredContent = filterText(content);
  fs.writeFileSync(
    `${outputDirectory}/${file.name}.srt`,
    `\n${id + 1}\n${secondsToHHMMSS(
      Math.round(start / 1000)
    )},${startMils} --> ${secondsToHHMMSS(
      Math.round(end / 1000)
    )},${endMils}\n${filteredContent}\n`,
    { flag: "a" }
  );
  fs.writeFileSync(`${outputDirectory}/${file.name}.txt`, filteredContent, {
    flag: "a",
  });
};
function addNewlines(str) {
  var result = "";
  while (str.length > 0) {
    result += str.substring(0, 50) + "\n";
    str = str.substring(50);
  }
  return result;
}
const fixTiming = (responses, idx) => {
  let tokens = [];

  for (let resId = 0; resId < responses.length; resId++) {
    let currTokens = responses[resId].speech.tokens;

    if (resId === responses.length - 1) {
      const res = currTokens.map((tk, index) => {
        return {
          ...tk,
          start: tk.start + offset * (resId + (idx - 2)),
          end: tk.end + offset * (resId + (idx - 2)),
        };
      });
      tokens = tokens.concat(res);
    } else {
      let nextTokens = responses[resId + 1].speech.tokens;

      const currLastToken = currTokens[currTokens.length - 1];
      const nextFirstToken = nextTokens[0];
      if (currLastToken.end > nextFirstToken.start + offset) {
        const currLastTokenDuration =
          currTokens[currTokens.length - 1].end -
          currTokens[currTokens.length - 1].start;
        const nextFirstTokenDuration = nextTokens[0].end - nextTokens[0].start;
        if (nextFirstTokenDuration >= currLastTokenDuration) {
          currTokens.splice(currTokens.length - 1, 1);
        } else {
          nextTokens.splice(0, 1);
        }
      }
      const res = currTokens.map((tk, index) => {
        return {
          ...tk,
          start: tk.start + offset * (resId + (idx - 2)),
          end: tk.end + offset * (resId + (idx - 2)),
        };
      });
      tokens = tokens.concat(res);
    }
  }
  return tokens;
};

let subtitleCount = 0;
const generateSubtitles = (responses, idx, file) => {
  const tokens = fixTiming(responses, idx);

  let subtitle = [];
  let preTokedId = 0;
  for (let tkId = 0; tkId < tokens.length; tkId++) {
    if (subtitle.length === 0) {
      subtitle.push(tokens[tkId]);
      preTokedId = tkId;
    } else {
      const delay = tokens[tkId].start - tokens[preTokedId].end;
      if (delay > maxDelay) {
        writeSubtitle(
          file,
          subtitleCount,
          subtitle[0].start,
          subtitle[subtitle.length - 1].end,
          subtitle.reduce((pre, curr) => pre + " " + curr.token, "")
        );
        subtitleCount = subtitleCount + 1;
        subtitle = [];
        subtitle.push(tokens[tkId]);
        preTokedId = tkId;
      } else {
        subtitle.push(tokens[tkId]);
        preTokedId = tkId;
      }
    }
  }

  if (subtitle.length !== 0) {
    writeSubtitle(
      file,
      subtitleCount,
      subtitle[0].start,
      subtitle[subtitle.length - 1].end,
      subtitle.reduce((pre, curr) => pre + " " + curr.token, "\n")
    );
    subtitleCount = subtitleCount + 1;
  }
};
const filterText = (txt) => {
  const newTxt = addNewlines(txt);
  return newTxt.replace("\n", "").replace(".", "\n");
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
    let responses = [];
    for (const clip of audioClips) {
      if (global.isFileProcessStopped) return;

      win.webContents.send("currentClip", idx + 1);
      const startTime = new Date().getTime();
      let txt = await transcribeFile(clip, apiToken);
      const filteredText = filterText(txt.text);
      // clipStartInMils = (txt.start % 1000).toString();
      // clipEndInMils = (txt.end % 1000).toString();

      if (txt.text) {
        if (responses.length === 2) {
          generateSubtitles(responses, idx, file);
          responses = [];
        }
        responses.push(txt);
        win.webContents.send("currentSubtitle", filteredText);
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
      // return { text: json.text, start: start, end: end };
      return json;
    } else {
      return {};
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
const splitAudioFile = async (filename, offset) => {
  const fileDuration = await getAudioDurationInSeconds(filename);
  const splitCount = fileDuration / (cutLength / 1000);
  const reminder = fileDuration % (cutLength / 1000);
  console.log(splitCount, reminder, fileDuration);
  for (let step = 0; step < splitCount; step++) {
    // extract audio params
    await extractAudio({
      ffmpegPath: "ffmpeg", // path to ffmpeg.exe
      inputTrack: filename, // source track
      start: step * ((cutLength - 1000) / 1000), // start seconds in the source
      length: cutLength / 1000, // duration to extract

      outputTrack: `./tmp/track-${step}.mp3`, // output track
    });
    // extract reminder
  }
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
      subtitleCount = 0;

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
        console.log("new Branch");

        // await splitAudio({
        //   mergedTrack: file.path,
        //   outputDir: "tmp/",
        //   minSilenceLength: 1,
        //   minSongLength: 8,
        //   maxNoiseLevel: -15,
        // });

        await splitAudioFile(file.path, offset);
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
