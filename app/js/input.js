/**
 * Created by max on 15/08/2017.
 */

const electron = require('electron');
const { ipcRenderer, remote } = electron;
const { BrowserWindow } = remote;
const d3 = require('d3');

let section = d3.select('#input-section');
let current_info;


ipcRenderer.on('set-mode', (_, return_channel, mode, info, force) => {
    current_info = info;
    clear((force) ? 'Cancel' : null);
    switch (mode) {
        case 'warning':
            makeWarning();
            break;
        case 'text':
            makeTextInput();
            break;
        default:
            break;
    }
    ipcRenderer.send(`done-set-mode-${return_channel}`)
});


function clear(cancel_text, ok_text) {
    section.node().innerHTML = '';
    let cancel_button = d3.select('#cancel'), ok_button = d3.select('#ok');
    if (cancel_text == null) {
        cancel_button.node().disable = true;
    } else {
        cancel_button.node().disable = false;
        cancel_button.text(cancel_text)
    }
    if (ok_text) {
        ok_button.text(ok_text)
    } else {
        ok_button.text('OK')
    }
}

function makeTextInput() {
    let label = `Enter ${current_info.label || "text"} here:`;
    section.append('p')
        .text(label)
        .attr('class', 'label');
    section.append('input')
        .attr('type', 'text')
        .attr('id', 'value')
}

function makeWarning() {
    section.append('p')
        .text(current_info.label)
}

function done(validate) {
    let value = null;
    if (d3.select('#value')) {
        value = d3.select('#value').node().value;
    }
    console.log(`Is done with ${validate}`);
    ipcRenderer.send(
        'return-value',
        current_info.window_group,
        current_info.channel,
        validate,
        value
    )
}
