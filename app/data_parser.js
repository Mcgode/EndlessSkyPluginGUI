/**
 * Created by max on 17/08/2017.
 */

function hasIndentation(text) {
    return text[0] === '\t'
}


function getIndentedSection(lines, first_index) {
    let lines_to_return = [];
    let i = first_index + 1;
    while (i < lines.length && hasIndentation(lines[i])) {
        lines_to_return.push(lines[i].slice(1));
        i++
    }
    return lines_to_return
}


function getString(string) {
    switch(string[0]) {
        case "\"":
            return string.replace(/"/g, '');
        case "`":
            return string.replace(/`/g, '');
        default:
            return string;
    }
}


function getSplits(string) {
    let splits = [];
    let current_word = '';
    let parenthesis = null;
    for (let character of string) {
        if (parenthesis) {
            if (character === parenthesis) {
                splits.push(current_word);
                current_word = '';
                parenthesis = '';
            } else {
                current_word += character;
            }
        } else {
            if (character === ' ') {
                splits.push(current_word);
                current_word = '';
            } else if (character === '\"' || character === '`') {
                parenthesis = character;
                current_word = '';
            } else {
                    current_word += character;
            }
        }
    }
    if (current_word) splits.push(current_word);
    return splits;
}


function clearSplits(splits) {
    let i = 0;
    while (i < splits.length) {
        if (splits[i] === '') {
            splits.splice(i, 1);
        } else {
            i++;
        }
    }
}


function initData(inside_data) {
    if (inside_data) return {};
    return [];
}


function inputData(data, header, parameters, content) {
    if (data instanceof Array) {
        let data_piece = { header: header, parameters: parameters };
        if (content) data_piece.content = content;
        data.push(data_piece)
    } else {
        data[header] = { parameters: parameters };
        if (content) data[header].content = content;
    }
}


function parse(lines, inside_data) {
    let index = 0, data = initData(inside_data);
    while (index < lines.length) {
        let line = lines[index];
        if (line.length && line[0] !== ' ' && line[0] !== '\t') {
            let splits = getSplits(line);
            clearSplits(splits);
            let header = splits[0], parameters = splits.slice(1);
            switch (header) {
                default:
                    if (index + 1 < lines.length && hasIndentation(lines[index + 1])) {
                        let content = getIndentedSection(lines, index);
                        inputData(data, header, parameters, parse(content, true));
                        index += content.length + 1;
                    } else {
                        inputData(data, header, parameters);
                        index++;
                    }
                    break;
            }
        } else {
            index++;
        }
    }
    return data
}

exports.parse = parse;