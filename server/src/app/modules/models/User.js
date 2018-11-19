const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {type: Number, required: true, index: true},
    name: {
        type: String, required: true, index: true
    },
    age: {type: Number, required: true, index: true},
    address: {type: String, required: true, index: true},
    team: {type: String, required: true, index: true},
    created: {type: Date, 'default': Date.now()},
    modified: {type: Date, 'default': Date.now()},
});

const UserModal = mongoose.model('user', userSchema);
module.exports = UserModal;
