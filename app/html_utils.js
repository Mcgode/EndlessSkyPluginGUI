/*
 * Created by max on 17/08/2017.
 */

const d3 = require('d3');
const fs = require('fs');
const $ = require('jQuery');


exports.setTextToSpecificIDsInObject = (obj, text_dic) => {

    Object.keys(text_dic).forEach(key => {
        let text = text_dic[key];
        obj.select(`#${key}`).text(text);
    })

};


exports.getTemplate = (template) => {
    return fs.readFileSync(`${__dirname}/templates/${template}.html`).toString()
};


exports.align = (ids) => {
    let info = {};
    let max_left = 0;

    for (id of ids) {
        let obj = $(`#${id}`);
        console.log(obj);
        if (obj.prop('tagName') !== 'SELECT') {
            info[id] = {
                margin: parseInt(obj.css('marginLeft').replace(/[^-\d.]/g, '')),
                pos: Math.round(obj.position().left)
            };
        } else {
            info[id] = {
                margin: parseInt(obj.css('marginLeft').replace(/[^-\d.]/g, '')),
                pos: Math.round(obj.get(0).getBoundingClientRect().left)
            };
        }

        if (info[id].pos > max_left) max_left = info[id].pos
    }

    console.log('Align info', info);

    for (id of ids) {
        let obj = $(`#${id}`);
        console.log(Math.round(info[id].margin + max_left - info[id].pos));
        obj.css('marginLeft', `${Math.round(info[id].margin + max_left - info[id].pos)}px`)
    }

};


exports.checkTextInputValueInBlacklist = (input_id, blacklist, not_in_completion, in_completion) => {
    $(`#${input_id}`).on('keyup change', (e) => {
        if (blacklist.indexOf(e.target.value) > -1) {
            not_in_completion(e.target.value)
        } else {
            in_completion(e.target.value)
        }
    })
};


class SelectableList {

    constructor(cells_data, update, still_class_name, clicked_class_name) {
        this.off_class_name = still_class_name || 'unselected-cell';
        this.on_class_name = clicked_class_name || 'selected-cell';
        this.selected_cells = [];
        this.last_selected_cell = '';
        this.update = update != null ? update : (() =>{});
        this.table = d3.select(document.createElement('table'));
        this.buildFromTable(cells_data);
    }

    buildFromTable(data) {
        this.table.node().innerHTML = '';
        for (let e of data) {
            let row = this.table.append('tr').attr('class', this.off_class_name);
            row.node().addEventListener('click', (event) => {
                console.log('clicked');
                this.handleClick(event)
            });
            if (e instanceof Array) {
                for (let e_piece of e) {
                    row.append('td').text(e_piece)
                }
            } else {
                row.append('td').text(e)
            }
        }
    }

    handleClick(event) {

        let target = event.target.parentNode;

        if (event.shiftKey) {
            if (this.last_selected_cell == null) {

                for (let child of this.table.node().childNodes) {
                    child.className = '';
                }

                this.selected_cells = [target];
                this.last_selected_cell = target;

                target.className = this.on_class_name

            } else {

                let last = 0,
                    next = 0;

                this.table.node().childNodes.forEach((e, i) => {
                    if (e === this.last_selected_cell) last = i;
                    if (e === target) next = i;
                });

                let increment = 1;
                if (last > next) increment = -1;
                let i = last + increment;

                while (next * increment >= i * increment) {
                    let t = this.table.node().childNodes[i];
                    t.className = this.on_class_name;
                    this.selected_cells.push(t);
                    i += increment
                }
                this.selected_cells = [...new Set(this.selected_cells)];

                this.last_selected_cell = target;
            }
        } else {

            if (event.metaKey || event.ctrlKey) {

                let index = this.selected_cells.indexOf(target);
                if (index === -1) {
                    this.selected_cells.push(target);
                    this.last_selected_cell = target;
                    target.className = this.on_class_name;
                } else {
                    this.selected_cells.splice(index, 1);
                    this.last_selected_cell = target;
                    target.className = this.off_class_name
                }

            } else {

                for (let child of this.table.node().childNodes) {
                    child.className = '';
                }

                if (this.last_selected_cell) {
                    this.last_selected_cell.className = this.off_class_name;
                } else {
                    for (let e of this.table.node().childNodes) {
                        if (e !== target) {
                            e.className = this.off_class_name
                        }
                    }
                }

                this.selected_cells = [target];
                this.last_selected_cell = target;

                target.className = this.on_class_name;

            }

        }

        this.update(this.selected_cells)

    }

}

exports.SelectableList = SelectableList;


exports.resetStyle = (ids, style) => {
    for (let id of ids) {
        let obj = d3.select(`#${id}`).node();
        if (style) {
            obj.style['style'] = '';
        } else {
            obj.removeAttribute('style')
        }
    }
    console.log('Styles reset')
};

