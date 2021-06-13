const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    user_id: {
        type: String,
        require: true
    },
    user_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }, drId: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    }, phone: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    }, empAccess: {
        type: Array,
        require: true
    }, userToken: {
        type: String,
        require: true
    }, isBroker: {
        type: Boolean,
        require: true
    }, isTruck: {
        type: Boolean,
        require: true
    }, truckId: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('user', UserSchema);

