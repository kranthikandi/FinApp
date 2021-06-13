const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    },
    timestamp: {
        type: Date,
        require: true
    },
    activity: {
        type: String,
        require: true
    },
    msg: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('notification', ContactSchema);

