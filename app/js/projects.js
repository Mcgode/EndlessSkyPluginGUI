/**
 * Created by max on 15/08/2017.
 */

const io = require('../io_module');
const d3 = require("d3");
const electron = require('electron');
const { ipcRenderer } = electron;

let project_selection = d3.select('#project-selection');
let select_project = d3.select('#select-this-project');
let delete_project = d3.select('#delete-this-project');

function updateSelection()
{
    let projects = io.getProjects();

    project_selection.node().innerHTML = '';

    if (Object.keys(projects).length) {
        Object.keys(projects).forEach((project) => {
            project_selection.append('option')
                .text(project)
                .attr('value', project)
        });
        select_project.node().disabled = false;
        delete_project.node().disabled = false;
    } else {
        project_selection.append('option')
            .text('No projects');
        select_project.node().disabled = true;
        delete_project.node().disabled = true;
    }
}

function createProject() {
    ipcRenderer.send('create-project');
    ipcRenderer.once('create-project', (_, did_validate, value) => {
        if (did_validate) {
            io.makeProject(value);
            ipcRenderer.send('update-projects');
            ipcRenderer.send('set-current-project', value)
        }
    })
}

updateSelection();


ipcRenderer.on('update-projects', () => {
    updateSelection();
});
