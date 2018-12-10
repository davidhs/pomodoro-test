const { app, BrowserWindow } = require('electron');


const DEBUG = false;

let win;

function createWindow() {
    win = new BrowserWindow({ width: 300, height: 200 });
    win.loadFile('index.html');

    if (DEBUG) {
        win.webContents.openDevTools();
    }

    win.on('closed', function () {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
