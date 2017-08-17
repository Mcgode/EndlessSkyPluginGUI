/**
 * Created by max on 17/08/2017.
 */


const engine = ['Engines'];
const weapon = ['Guns', 'Turrets', 'Ammo'];
const outfit = ['Systems', 'Power'];


exports.addMethods = (data) => {

    data.select = (category) => {
        let elements = [];
        switch (category) {
            case 'ship':
                for (let e of data) {
                    if (e.header === category && e.parameters.length < 2) {
                        elements.push(e)
                    }
                }
                break;
            case 'engine':
                for (let e of data) {
                    if (e.header === 'outfit' && isIn(e.content.category.parameters[0], engine)) {
                        elements.push(e)
                    }
                }
                break;
            case 'weapon':
                for (let e of data) {
                    if (e.header === 'outfit' && isIn(e.content.category.parameters[0], weapon)) {
                        elements.push(e)
                    }
                }
                break;
            case 'outfit':
                for (let e of data) {
                    if (e.header === 'outfit' && isIn(e.content.category.parameters[0], outfit)) {
                        elements.push(e)
                    }
                }
                break;
            default:
                for (let e of data) {
                    if (e.header === category) {
                        elements.push(e)
                    }
                }
                break;
        }
        return elements
    };

    data.get = (category, element) => {
        let list = data.select(category);
        for (let e of list) {
            if (e.parameters[0] === element) return e
        }
        return null
    };

    data.print = (category, element) => {
        function print(obj, indent, prefix) {
            let string = '';
            prefix = prefix || '';
            if (obj == null) {
                string = repeat(indent) + prefix + null;
            } else if (obj instanceof Array) {
                string = repeat(indent) + prefix + '[\n';
                for (let i = 0; i < obj.length; i++) {
                    if (i === obj.length - 1) {
                        string += print(obj[i], indent + 1) + '\n';
                    } else {
                        string += print(obj[i], indent + 1) + ',\n';
                    }
                }
                string += repeat(indent) + ']';
            } else if (obj instanceof String) {
                string = repeat(indent) + prefix + `${obj}`;
            } else if (typeof obj === 'object') {
                string = repeat(indent) + prefix + '{\n';
                Object.keys(obj).forEach((key, i) => {
                    if (i === Object.keys(obj).length - 1) {
                        string += print(obj[key], indent + 1, `${key}: `) + '\n';
                    } else {
                        string += print(obj[key], indent + 1, `${key}: `) + ',\n';
                    }
                });
                string += repeat(indent) + '}';
            } else {
                string = repeat(indent) + prefix + `${obj}`;
            }
            //console.log(`------\n${indent} (${typeof obj}):\n${string}`);
            return string;
        }
        return print(data.get(category, element), 0);
    }

};

function repeat(i) { 
    let str = '';
    for (let j=0; j < i; j++) {
        str += '\t'
    }
    return str
}

function isIn(obj, array) {
    return array.indexOf(obj) > -1;
}