global.window = { document: { createElementNS: () => { return {} } } };
global.navigator = {};
global.btoa = () => { };
const express = require('express');


module.exports = {

    email: function (toemail, body, subject) {
        var result = 'test'

    }
}

delete global.window;
delete global.navigator;
delete global.btoa;
