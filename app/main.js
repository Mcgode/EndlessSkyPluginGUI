/**
 * Created by max on 14/08/2017.
 */

const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const io = require('./io_module');

let main_window, project_window;
let project_input_window;
let projects;
let session;
let main_window_ready_to_show = false;
let projects_window_ready_to_show = false;


function makeMainWindow()
{
    if (main_window == null)
    {
        main_window = new BrowserWindow({
            width: 800,
            height: 600,
            show: false
        });

        main_window.once('ready-to-show', () => {
            if (Object.keys(projects).length && session.selected_project) {
                main_window.show()
            }
            main_window_ready_to_show = true;
        });

        main_window.loadURL(`file://${__dirname}/pages/main.html`);

        main_window.once('close', () => { main_window = null; })
    }
    else if (Object.keys(projects).length && session.selected_project)
    {
        main_window.show()
    }
}

function makeProjectWindow()
{
    if (project_window == null)
    {
        project_window = new BrowserWindow({
            width: 800,
            height: 80,
            show: false,
            resizable: true,
            fullscreenable: false,
            maximizable: false
        });

        makeProjectInputWindow();

        project_window.once('ready-to-show', () => {
            projects_window_ready_to_show = true;
            if (!Object.keys(projects).length || !session.selected_project) {
                project_window.show()
            }
        });

        project_window.loadURL(`file://${__dirname}/pages/projects.html`);

        project_window.once('close', () => {
            project_input_window.close();
            project_window = null;
            app.quit()
        })
    }
    else if (!Object.keys(projects).length || !session.selected_project)
    {
        project_window.show()
    }
}

// The function serves both as a way to create and to call the input window, effectively creating it failsafe
function makeProjectInputWindow(mode, info, force) {
    if (project_input_window == null && project_window != null) {
        project_input_window = new BrowserWindow({
            width: 780,
            height: 700,
            parent: project_window,
            modal: true,
            show: false,
        });

        project_input_window.once('ready-to-show', () => {
            if (mode) {
                project_input_window.webContents.send('set-mode', 'projects', mode, info, force);
                ipcMain.once('done-set-mode-projects', () => { project_input_window.show() });
            }
        });

        project_input_window.loadURL(`file://${__dirname}/pages/input.html`);

        project_input_window.once('close', () => {
            project_input_window = null;
        });
    } else if (project_window && mode) {
        project_input_window.webContents.send('set-mode', 'projects', mode, info, force);
        project_input_window.show();
        ipcMain.once('done-set-mode-projects', () => { project_input_window.show() });
    }
}


// App events handling

app.once('ready', () => {

    projects = io.getProjects();
    session = io.recoverLastSessionInfo();

    makeMainWindow();
    makeProjectWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('before-quit', () => {
    BrowserWindow.getAllWindows().forEach(window => {
        window.setClosable(true);
        window.removeAllListeners('close');
    });
});

app.on('activate', () => {
    makeProjectWindow();
    makeMainWindow();
});


ipcMain.on('create-project', () => {
    makeProjectInputWindow('text', { label: 'project name', channel: 'create-project', window_group: "projects" });
});

ipcMain.on('delete-project', () => {
    makeProjectInputWindow(
        'warning',
        {
            label: 'Are you sure you want to delete that project?',
            channel: 'delete-project',
            window_group: "projects",
            cancel: "No",
            ok: "Yes"
        }
    );
});

ipcMain.on('return-value', (_, window_group, channel_name, did_validate, value) => {
    console.log(window_group);
    switch(window_group) {
        case "projects":
            if (project_input_window) project_input_window.hide();
            project_window.webContents.send(channel_name, did_validate, value);
            break;
    }
});

ipcMain.on('update-projects', () => {
    projects = io.getProjects();
    for (let window of BrowserWindow.getAllWindows()) {
        window.webContents.send('update-projects')
    }
});