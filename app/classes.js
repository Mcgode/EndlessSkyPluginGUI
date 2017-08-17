/**
 * Created by max on 14/08/2017.
 */

const ee = require('./event_emitter');


class Ship {
    constructor() {
        this.sprite = 'thumbnail/unknown';
        this.hull_point = 0;
        this.shield_point = 0;
        ee.emit('register-element', this, 'Ship');
    }
}

exports.Ship = Ship;
