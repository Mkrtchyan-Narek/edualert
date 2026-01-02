const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (isDev) {
    // React dev server
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    // Packaged React build
    win.loadFile(path.join(process.resourcesPath, 'app', 'build', 'index.html'));
  }
}

app.whenReady().then(createWindow);
