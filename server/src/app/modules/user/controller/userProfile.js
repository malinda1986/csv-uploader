const _ = require('lodash');
const User = require('../../models/User');
const csv = require('fast-csv');
const {sendSocketMessage} = require('../../../servies/socket');
const defaultLimits = {limit: 20, skip: 0};
const defaultSort = {_id: -1};

const skip = (page = 1) => {
    return (page - 1) * 10;
};

const sort = (sortField, sortOrder) => {
    if (_.isEmpty(sortField)) {
        return defaultSort;
    }
    const sortBy = {};
    sortBy[sortField] = sortOrder;
    return sortBy;
};

const find = (fields) => {
    const search = {};
    if (fields && fields.name) {
        const name = fields.name;
        return {name: {'$regex': name}}
    }
    return search;
};

const startProcess = (req) => {
    User.remove({});
    let i = 0;
    let completed = false;
    const socket = req.app.get('socket');
    socket.emit('new_msg', {type: 'upload', count: 100});
    const csvstream = csv.fromPath('uploads/testdata.csv', {headers: false})
    .on('data', (row) => {
        csvstream.pause();
        if (row && row[0] && row[1] && row[2] && row[3] && row[4]) {
            const user = new User({
                id: row[0],
                name: row[1],
                age: row[2],
                address: row[3],
                team: row[4],
            });
            user.save((err, results) => {
                if (err) {
                    console.log(err);
                    //notify frontend
                } else {
                    i++;
                    socket.emit('new_msg', {type: 'record', count: i, completed});
                    csvstream.resume();
                }
            });
        } else {
            socket.emit('new_msg', {type: 'record', completed: true});
        }
    })
    .on('end', function() {
        completed = true;
        socket.emit('new_msg', {type: 'record', completed: true});
        csvstream.pause();
    })
    .on('error', function(error) {
        socket.emit('new_msg', {type: 'record', completed: false});
        csvstream.pause();
    });
};

const Upload = ({body, options}) => {
    return new Promise((resolve, reject) => {
        try {
            return resolve((req, res) => {
                startProcess(req);
                return Promise.resolve({message: 'uploaded'});
            });
        } catch (e) {
            return reject({message: 'File not found', e: e});
        }
    });
};

const Get = ({body, options}) => {
    return new Promise((resolve, reject) => {
        return resolve((req, res) => {
            const query = Object.assign({}, body.query, options.query);
            //console.log(query, options, Object.assign({}, body.query, options.query))
            User.find(find(query))
                .limit(10)
                .skip(skip(query.page))
                .sort(sort(query.sortField, query.sortOrder))
                .exec(function(err, users) {
                    if (err) {
                        return res.status(400).send({message: 'Error occurred while querying the database'});
                    }

                    const ResultsCount = new Promise((resolve, reject) => {
                        User.find(find(query))
                            .exec((error, result) => {
                                if (error) {
                                    reject(error);
                                }
                                resolve(result.length);
                            });
                    });

                    ResultsCount.then((count) => {
                        return res.status(200).send({success: true, data: users, total: count});
                    });
                });
        });
    });
};

const Search = ({body, options}) => {
    return new Promise((resolve, reject) => {
        try {
            return resolve((req, res) => {
                const {query} = body;
                User.find(find(query))
                    .limit(Number(query.limit) || defaultLimits.limit)
                    .sort(sort(query.sortField, query.sortOrder))
                    .exec(function(err, users) {
                        if (err) {
                            return res.status(400).send({message: 'Error occurred while querying the database'});
                        }
                        return res.status(200).send({success: true, data: users});
                    });
            });
        } catch (e) {
            reject({message: 'File not found', e: e});
        }
    });
};

module.exports = {
    Get,
    Upload,
    Search
};
