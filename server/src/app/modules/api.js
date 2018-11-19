const express = require('express');
const multer = require('multer');
const userHandler = require('./user');
const api = require('../api');
const config = require('../config');

const {app_path} = config.get('api');

const apiRoutes = function(middleware) {
    try {
        const storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, 'uploads/');
            },
            filename: function(req, file, cb) {
                cb(null, file.originalname);
            }
        });
        const upload = multer({storage: storage});

        const router = express.Router();
        const {api: {cors}} = middleware;
        // enable CORS
        router.use(cors());
        router.use(`${app_path}/users`, upload.single('file'), userHandler.routes(api.http));

        return router;
    } catch (e) {
        console.log(e);
    }
};

module.exports = apiRoutes;
