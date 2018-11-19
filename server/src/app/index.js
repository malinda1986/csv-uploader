const express = require('express');
const middleware = require('./middleware');

const init = function() {
    try {
        const parentApp = express();
        middleware(parentApp);
        return parentApp;
    } catch (e) {
        console.log(e);
    }
};

module.exports = init;
