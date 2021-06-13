const mongoose = require('mongoose');

const emailsSchema = mongoose.Schema({
    to: {
        type: String,
        require: true
    },
    subject: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    timestamp: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    updated_by: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('email', emailsSchema);
