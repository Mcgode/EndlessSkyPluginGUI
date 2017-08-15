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
    const app_name = `${appDataDir}/${dot_named ? '.bookIncomeManager' : 'Book Income Manager'}`;
    if (!fs.existsSync(app_name)) {
        fs.mkdirSync(app_name);
    }
    return app_name
}
