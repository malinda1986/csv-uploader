const express = require('express');
const userController = require('../controller');
const router = express.Router();

function userRoutes(handler) {
    router.route('/')
        .get(handler(userController.Get));
    router.route('/import')
        .post(handler(userController.Upload));
    router.route('/search')
        .post(handler(userController.Search));
    return router;
}
module.exports = userRoutes;
