/**
 * Created by max on 15/08/2017.
 */

const electron = require('electron');
const { ipcRenderer } = electron;
const d3 = require('d3');
const html_utils = require('../html_utils');

let section = d3.select('#input-section');
let current_info;
let ok_button = d3.select("#ok");


ipcRenderer.on('set-mode', (_, return_channel, mode, info, force) => {
    current_info = info;
    switch (mode) {
        case 'warning':
            clear(info.cancel, info.ok);
            makeWarning();
            break;
        case 'text':
            clear((!force) ? 'Cancel' : null);
            makeTextInput();
            break;
        default:
            break;
    }
    ipcRenderer.send(`done-set-mode-${return_channel}`)
});


function clear(cancel_text, ok_text) {
    section.node().innerHTML = '';
    let cancel_button = d3.select('#cancel');
    if (cancel_text == null) {
        cancel_button.node().disabled = true;
    } else {
        cancel_button.node().disabled = false;
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
    let input = section.append('input')
        .attr('type', 'text')
        .attr('id', 'value');

    let warning_label = section.append('p')
        .attr('class', 'warning-label');
    let blacklist = [];
    if (current_info.forbidden_entries) blacklist = current_info.forbidden_entries;
    blacklist.push('');
    html_utils.checkTextInputValueInBlacklist(
        'value',
        blacklist,
        (value) => {
            setOk(false);
            if (value) {
                warning_label.text(`The name "${value}" is already in use`)
            } else {
                warning_label.text('')
            }
        },
        () => { setOk(true); warning_label.text('') }
    );
    setOk(false);
}

function setOk(status) {
    ok_button.node().disabled = !status;
}

function makeWarning() {
    section.append('p')
        .text(current_info.label)
}

function done(validate) {
    let value = null;
    if (d3.select('#value').node()) {
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
