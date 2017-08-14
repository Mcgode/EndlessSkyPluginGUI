/**
 * Created by max on 14/08/2017.
 */

const electron = require('electron');
const { app, ipcMain, Menu, MenuItem, BrowserWindow, dialog } = electron;

let main_window;


app.once('ready', () => {

    main_window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false
    });

    main_window.once('ready-to-show', () => {
        main_window.show()
    });

    main_window.loadURL(`file://${__dirname}/pages/main.html`)
});
