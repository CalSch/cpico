// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs');


const color = {
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	reset: "\x1b[0m"
};
const style = {
	bold: "\x1b[1m",
	reset: "\x1b[22m"
};
const helpText=`
${style.bold+color.green} ---- C-PICO HELP ---- ${style.reset+color.reset}\r
\r
help: Display this menu\r
cat: print "meow!" to the screen\r
quit: exit C-PICO\r
\r
`;



let win;

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // fullscreen: true,
    
    webPreferences: {
			nodeIntegration: true,
      contextIsolation: false,
    }
  })
	win=mainWindow;

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
	

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('test', () => {
	console.log("\n\ntest\n\n");
})



ipcMain.handle("cmd", async (e,cmd) => {
	process_cmd(cmd)
	// const result = await win.webContents.send("result", process_cmd(cmd).replace("\n","\r\n"));
	// return result;
});

async function send(text,callback) {
	await win.webContents.send("stdout", text.replace("\n","\r\n"));
}


async function process_cmd(text) {
	console.log(text);
	switch (text) {
		case "cat":
			await send("meow!\n");
			win.webContents.send("shell_ready");
		break;
		case "quit":
			process.exit();
		break;
		case "help":
			await send(helpText);
			win.webContents.send("shell_ready");
		break;

		default:
			await send("Unknown command: \""+text+"\"\n");
			win.webContents.send("shell_ready");
		break;
	}
}