/**
 * Created by max on 14/08/2017.
 */

const electron = require('electron');
const { app, ipcMain, Menu, MenuItem, BrowserWindow, dialog } = electron;
const io = require('./io_module');

let main_window, project_window;
let projects;


function makeMainWindow() {
    main_window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false
    });

    main_window.once('ready-to-show', () => {
        main_window.show()
    });

    main_window.loadURL(`file://${__dirname}/pages/main.html`)
}

function makeProjectWindow() {
    project_window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false
    });
}

// App events handling

app.once('ready', () => {

    projects = io.getProjects();

    makeMainWindow();
    makeProjectWindow();
});
