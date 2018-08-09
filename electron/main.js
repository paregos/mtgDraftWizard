// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const chokidar = require('chokidar')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.webContents.once('did-finish-load', () => {
  const watcher = chokidar.watch(
    logPath,
    {
      ignored: /(^|[\/\\])\../,
      awaitWriteFinish : true,
      usePolling: true,
      interval: 100
    });
  
    watcher.on('change', (path, stats) => {
      updateDraftStatus();
    })

    watcher.on('ready', (path, stats) => {
      updateDraftStatus();
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const logPath = 'C:\\users\\hanzhi\\desktop\\output_log - Copy.txt';
//const logPath = 'C:\\Users\\Hanzhi\\AppData\\LocalLow\\Wizards Of The Coast\\MTGA\\output_log.txt';

function updateDraftStatus() {
  fs.readFile(logPath, (err, data) => {
    if(err) {
      return console.error(err);
    }

    data = data.toString();
    var matches = data.match(/<== Draft\.[(MakePick)|(DraftStatus)][\s|\S]+?\{[\s|\S]+?\}/g);
    
    if(matches == null) {
      return console.log('nomatch');
    }

    var lastMatch = matches[matches.length - 1];
    var draftState = JSON.parse(lastMatch.slice(lastMatch.indexOf('{')));
    mainWindow.webContents.send('draftStateUpdate', draftState);
    console.log(draftState);
  })
}