const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
    clientName: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    typeOfAccount: {
        type: String,
        require: true
    },
    entityType: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    notes: {
        type: String,
        require: true
    },

});

module.exports = mongoose.model('client', ClientSchema);

