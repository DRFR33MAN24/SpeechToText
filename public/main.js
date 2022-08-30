const path = require("path");
const axios = require('axios');
const glob = require('glob');
const {
  app,
  BrowserWindow,
  webContents,
  ipcMain,
  dialog,
} = require("electron");

const isDev = require("electron-is-dev");
const {
  setupTitlebar,
  attachTitlebarToWindow,
} = require("custom-electron-titlebar/main");

const { getAudioDurationInSeconds } = require('get-audio-duration')
const split = require("audio-split");
const fs = require("fs");


const clipLength = 10;




//setupTitlebar();
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
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

const getFilesDuration = (files)=>{
  const durations =[];
  files.map(async (file,index)=>{
   const time =await getAudioDurationInSeconds(file.path);
   durations.push({id:index,duration:time});
  })
  return durations;
}

const proccessFile = (file,token)=>{

  // create a tmp folder for the file in tmp folder
  split({
  filepath: file.path,
  minClipLength: clipLength,
  maxClipLength: clipLength,
  outputPath: 'tmp/'
});
  const txtStream = fs.createWriteStream(`output/${file.name}.txt`);
  const srtStream = fs.createWriteStream(`output/${file.name}.srt`);
  const audioClips = glob.sync('tmp/*.*');

  if (audioClips.length) {
    audioClips.map((clip,index)=>{
      //notify current clip
      const txt = transcribeFile(clip,token);
      txtStream.write(txt);
      srtStream.write(`00:33:33 => 33:44:44${txt}`);

    })
  }

  txtStream.end();
  srtStream.end();

    if (audioClips.length) {
    audioClips.map((clip,index)=>{
      fs.unlink(clip);

    })
  }
//notify file procced

}

const transcribeFile = (clip,token)=>{

  let res = await axios.post('http://httpbin.org/post', clip,{headers: {   'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` }});
  // noftify network request
  return res.txt;

}
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

ipcMain.on("chooseDir", (event) => {
  // If the platform is 'win32' or 'Linux'
  if (process.platform !== "darwin") {
    // Resolves to a Promise<Object>
    dialog
      .showOpenDialog({
        title: "Select the File to be uploaded",
        defaultPath: path.join(__dirname, "../assets/"),
        buttonLabel: "Upload",
        // Restricting the user to only Text Files.
        filters: [
          {
            name: "Text Files",
            extensions: ["txt", "docx"],
          },
        ],
        // Specifying the File Selector Property
        properties: ["openFile"],
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
