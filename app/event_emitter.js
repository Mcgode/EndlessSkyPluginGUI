/**
 * Created by max on 17/08/2017.
 */

const events = require('events');

const eventEmitter = new events.EventEmitter();


exports.on = function (event, func) {
    eventEmitter.on(event, func);
};

exports.once = function (event, func) {
    eventEmitter.once(event, func);
};

exports.emit = function () {
    let event = arguments[0];
    switch (arguments.length) {
        case 2:
            eventEmitter.emit(event, arguments[1]);
            break;
        case 3:
            eventEmitter.emit(event, arguments[1], arguments[2]);
            break;
        case 4:
            eventEmitter.emit(event, arguments[1], arguments[2], arguments[3]);
            break;
        case 5:
            eventEmitter.emit(event, arguments[1], arguments[2], arguments[3], arguments[4]);
            break;
        case 6:
            eventEmitter.emit(event, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            break;
        default:
            eventEmitter.emit(event);
    }
};