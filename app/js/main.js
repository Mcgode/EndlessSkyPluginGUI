/**
 * Created by max on 17/08/2017.
 */

const electron = require('electron');
const { ipcRenderer } = electron;
const d3 = require('d3');
const html_utils = require('../html_utils');
const data_interaction = require('../data_interactions');

const categories = [
    'ship', 'variant',
    'outfit', 'weapon', 'engine', 'projectile',
    'shipyard', 'outfitter',
    'planet', 'system',
    'event',
    'fleet',
    'government',
    'mission',
    'effect'
];
const category_select = d3.select('#category-select');
const element_select = d3.select('#element-select');
const element_data_div = d3.select('#element-data-div');

let game_data;
let current_category, current_element;


function drawCategories() {
    html_utils.empty(category_select);
    for (let category of categories) {
        category_select.append('option')
            .text(category)
            .attr('value', category)
    }
    current_category = categories[0];
    category_select.attr('value', current_category);
    drawElements(current_category);
}


function drawElements(category) {
    let list = game_data.select(category);
    console.log(list);
    html_utils.empty(element_select);
    for (let e of list) {
        element_select.append('option')
            .attr('value', e.parameters[0])
            .text(e.parameters[0]);
    }
    current_element = list[0].parameters[0];
    element_select.attr('value', current_element);
    drawElementData(current_category, current_element);
}

function drawElementData(category, element) {
    html_utils.empty(element_data_div);
    let obj = game_data.get(category, element);
    let table = element_data_div.append('table');
    drawContent(table, obj.content, 0, ['content']);
}

function drawContent(table, content, indent, keys) {
    let elements = Object.keys(content);
    console.log(content);
    for (let key of elements) {
        if (content[key] instanceof Array) {
            content[key].forEach((e, i) => {
                let row = table.append('tr').attr('class', `row-${indent}`);
                row.append('p').text(magnify(key)).attr('class', `row-label-${indent}`);
                e.parameters.forEach((param, j) => {
                    row.append('input')
                        .attr('type', 'text').attr('value', param)
                        .attr('id', `select${stringifyArray([].concat.apply([], [keys, key, i, 'parameters', j]))}`);
                });
                if (e.content) {
                    drawContent(table, e.content, indent + 1, [].concat.apply([], [keys, key, i, 'content']))
                }
            });
        } else {
            let row = table.append('tr').attr('class', `row-${indent}`);
            row.append('p').text(magnify(key)).attr('class', `row-label-${indent}`);
            console.log(key);
            content[key].parameters.forEach((param, i) => {
                row.append('input')
                    .attr('type', 'text').attr('value', param)
                    .attr('id', `select${stringifyArray([].concat.apply([], [keys, key, 'parameters', i]))}`);
            });
            if (content[key].content != null) {
                drawContent(table, content[key].content, indent + 1, [].concat.apply([], [keys, key, 'content']))
            }
        }
    }
}

function magnify(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function stringifyArray(array) {
    let string = '';
    array.forEach((e, i) => {
        string += `-${e}`
    });
    return string
}


ipcRenderer.on('collect-data', (_, data) => {
    game_data = data;
    console.log(data);
    data_interaction.addMethods(game_data);
    drawCategories();
    ipcRenderer.send('main-good-to-go');
});

category_select.on('change', () => {
    current_category = category_select.node().value;
    drawElements(current_category)
});

element_select.on('change', () => {
    current_element = element_select.node().value;
    drawElementData(current_category, current_element)
});