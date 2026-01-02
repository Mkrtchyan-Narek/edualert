const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,     // ✅ safer
      contextIsolation: true     // ✅ safer
    }
  });

  if (isDev) {
    // React dev server
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    // Packaged React build
    win.loadFile(path.join(__dirname, "build", "index.html"));
  }
}

app.whenReady().then(createWindow);
