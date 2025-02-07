const { app, BrowserWindow, ipcMain, Menu } = require('electron/main');
const path = require('node:path');
const fetch = require('node-fetch-commonjs');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = app.isPackaged ? 'production' : 'development';
}

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
const iconPath = path.join(__dirname, "assets", process.platform === "win32" ? "algIcon.ico" : process.platform === "darwin" ? "algIcon.icns" : "algIcon.png");

//Global main window
let mainWindow;
//app.enableSandbox();
//Create the main window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: "QR Invoice",
        width: isDev ? 1000 : 600,
        height: 400,
        icon: path.join(__dirname, "assets", "favicon.ico"),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false,
            sandbox: false,
            preload: path.join(__dirname, 'preload_program.js'),
            icon: iconPath
        }
    });

    //Open devtool if in dev env
    if (isDev)
        mainWindow.webContents.openDevTools();

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

//App is ready
app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    createMainWindow();

    //Implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    //Remove main window from memory on close
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0)
            createMainWindow();
    });
});

//Menu template
const menu = [
    {
        role: 'fileMenu'
    }
];

//Handle http request
ipcMain.handle('sendRequestAndGetDetails', async (event, url, options) => {
    try {
        
        const response = await fetch(url.trim(), options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        mainWindow.webContents.send('getData', json);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error(`Error fetching data:: ${error.message}`);
    }
});

//Close window
app.on('window-all-closed', () => {
    if(!isMac)
        app.quit();
});