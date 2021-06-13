const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
    to: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    timestamp: {
        type: Date,
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
    by: {
        type: String,
        require: true
    }, from: {
        type: String,
        require: true
    }, fromRole: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('message', messagesSchema);
