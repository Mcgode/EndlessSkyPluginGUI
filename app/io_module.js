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
            appDataDir = process.env.APPDATA;
            break;
        default:
            appDataDir = os.homedir();
            dot_named = true;
            break;
    }
    const app_data_dir = `${appDataDir}/${dot_named ? '.endlessSkyPluginGUI' : 'Endless Sky Plugin GUI'}`;
    if (!fs.existsSync(app_data_dir)) {
        fs.mkdirSync(app_data_dir);
    }
    return app_data_dir
}

const dir = getAppDataDir();


exports.getProjects = () => {

    if (!fs.existsSync(`${dir}/projects`)) {
        fs.mkdirSync(`${dir}/projects`);
    }

    return fs.readdirSync(`${dir}/projects`);

};
