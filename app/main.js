/**
 * Created by max on 14/08/2017.
 */

const electron = require('electron');
const { app, BrowserWindow } = electron;
const io = require('./io_module');

let main_window, project_window;
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
            if (Object.keys(projects).length) {
                main_window.show()
            }
            main_window_ready_to_show = true;
        });

        main_window.loadURL(`file://${__dirname}/pages/main.html`);

        main_window.once('close', () => { main_window = null; })
    }
    else if (session.selected_project != null)
    {
        main_window.show()
    }
}

function makeProjectWindow()
{
    if (project_window == null)
    {
        project_window = new BrowserWindow({
            width: 400,
            height: 80,
            show: false,
            resizable: true,
            fullscreenable: false,
            maximizable: false
        });

        project_window.once('ready-to-show', () => {
            projects_window_ready_to_show = true;
            if (!Object.keys(projects).length) {
                project_window.show()
            }
        });

        project_window.loadURL(`file://${__dirname}/pages/projects.html`);

        project_window.once('close', () => {
            project_window = null;
            app.quit()
        })
    }
    else if (session.selected_project == null)
    {
        project_window.show()
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
