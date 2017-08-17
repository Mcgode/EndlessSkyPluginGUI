/**
 * Created by max on 17/08/2017.
 */

const electron = require('electron');
const { ipcRenderer } = electron;
const d3 = require('d3');
const html_utils = require('../html_utils');
const data_interaction = require('../data_interactions');

const categories = [ 'ship', 'outfit', 'weapon', 'engine', 'shipyard', 'outfitter', 'planet' ];
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
    element_data_div.text(game_data.print(category, element));
}


ipcRenderer.on('collect-data', (_, data) => {
    game_data = data;
    data_interaction.addMethods(game_data);
    drawCategories();
    ipcRenderer.send('main-window-good-to-go');
});

category_select.on('change', (e) => {
    current_category = category_select.node().value;
    drawElements(current_category)
});

element_select.on('change', () => {
    current_element = element_select.node().value;
    drawElementData(current_category, current_element)
});