/**
 * Created by max on 15/08/2017.
 */

const os = require('os');
const fs = require('fs');

// Returns (and eventually creates) the app data directory
function getAppDataDir() {
    let appDataDir;
    let dot_named = false;
    switch (os.platform()) {
        case "darwin":
            appDataDir = os.homedir() + '/Library/Application Support';
            break;
        case "win32":
            if (os.arch() === 'x64') {
                appDataDir = "C:\\Program Files (x86)";
            } else {
                appDataDir = "C:\\Program Files";
            }
            break;
        default:
            appDataDir = os.homedir();
            dot_named = true;
            break;
    }
    const app_data_dir = `${appDataDir}/${dot_named ? '.endlessSkyPluginGUI' : 'EndlessSkyPluginGUI'}`;
    if (!fs.existsSync(app_data_dir)) {
        fs.mkdirSync(app_data_dir);
    }
    return app_data_dir
}

const dir = getAppDataDir();


// Returns the project list, stored as a list of directories
exports.getProjects = () => {
    if (!fs.existsSync(`${dir}/projects`)) {
        fs.mkdirSync(`${dir}/projects`);
    }
    let potential_projects = fs.readdirSync(`${dir}/projects`);
    console.log(potential_projects);
    let projects = {};
    for (let potential_project of potential_projects) {
        let path = `${dir}/projects/${potential_project}`;
        if (fs.lstatSync(path).isDirectory()) {
            console.log(`${potential_project} is directory`);
            if (fs.existsSync(`${path}/project.json`)) {
                console.log(`${potential_project} contains a project.json file`);
                projects[potential_project] = JSON.parse(fs.readFileSync(`${path}/project.json`));
            }
        }
    }
    return projects
};


exports.recoverLastSessionInfo = () => {
    let filename = `${dir}/LastSession.json`;
    if (!fs.existsSync(filename)) {
        let info = {
            "selected_project": undefined
        };
        fs.writeFileSync(filename, JSON.stringify(info));
        return info
    } else {
        return JSON.parse(fs.readFileSync(filename))
    }
};


exports.saveSession = (session) => {
    let filename = `${dir}/LastSession.json`;
    fs.writeFileSync(filename, JSON.stringify(session));
};


exports.makeProject = (project_name) => {
    let path = `${dir}/projects/${project_name}`;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
    fs.mkdirSync(path);
    let info = {
        project_name: project_name,
        draw_data_from: [ "base" ]
    };
    fs.writeFileSync(`${path}/project.json`, JSON.stringify(info));
};

function delete_recursive(path) {
    if (fs.lstatSync(path).isDirectory() && !fs.lstatSync(path).isSymbolicLink()) {
        for (let e of fs.readdirSync(path)) {
            delete_recursive(`${path}/${e}`)
        }
        fs.rmdirSync(path);
    } else {
        fs.unlinkSync(path)
    }
}

exports.deleteProject = (project_name) => {
    if (fs.existsSync(`${dir}/projects/${project_name}`)) {
        delete_recursive(`${dir}/projects/${project_name}`);
    }
};
