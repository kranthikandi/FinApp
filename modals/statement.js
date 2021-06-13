const mongoose = require('mongoose');

const StatementSchema = mongoose.Schema({
    date: {
        type: Date,
        require: true
    }, status: {
        type: String,
        require: true
    }, statementId: {
        type: String,
        require: true
    },
    updated_by: {
        type: String,
        require: true
    },
    updated_date: {
        type: String,
        require: true
    }, DriverID: {
        type: String,
        require: true
    }, DriverName: {
        type: String,
        require: true
    }, statementDate: {
        type: Date,
        require: true
    }, details: {
        type: Object,
        require: true
    }, Total: {
        type: Number,
        require: true
    }, payWeekFrom: {
        type: Date,
        require: true
    }, payWeekTo: {
        type: Date,
        require: true
    }, check: {
        type: String,
        require: true
    }, qty: {
        type: Object,
        require: true
    }

});

module.exports = mongoose.model('Statements', StatementSchema);