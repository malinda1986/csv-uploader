const mongoose = require('mongoose');
const config = require('../config');
const connect = () => {
    const {host} = config.get('mongo');
    const url = `${host}`;
    return new Promise((resolve, reject) => {
        try {
            const options = {
                server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
                replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
            };
            const conn = mongoose.connect(url, options);
            // // CONNECTION EVENTS
            // When successfully connected
            mongoose.set('debug', true);
            mongoose.connection.on('connected', function() {
                console.log('Mongoose default connection open to ' + url);
            });

            // If the connection throws an error
            mongoose.connection.on('error', function(err) {
                console.log('Mongoose default connection error: ' + err);
            });

            // When the connection is disconnected
            mongoose.connection.on('disconnected', function() {
                console.log('Mongoose default connection disconnected');
            });

            // If the Node process ends, close the Mongoose connection
            process.on('SIGINT', function() {
                mongoose.connection.close(function() {
                    console.log('Mongoose default connection disconnected through app termination');
                    /*eslint-disable */
                    process.exit(0);
                });
            });
            resolve(conn);
        }catch (e){
            console.log(e);
            reject(e);
        }
    });
};

module.exports = connect;