const mongoose = require('mongoose');

const contact = mongoose.Schema({
    Time: {
        type: Date,
        require: true
    }, Name: {
        type: String,
        require: true
    }, Email: {
        type: String,
        require: true
    }, Message: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('contact', contact);