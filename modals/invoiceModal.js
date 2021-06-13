const mongoose = require('mongoose');

const InvoiceSchema = mongoose.Schema({
    date: {
        type: Date,
        require: true
    }, status: {
        type: String,
        require: true
    }, invId: {
        type: String,
        require: true
    }, updatedBy: {
        type: String,
        require: true
    }, updateDate: {
        type: Date,
        require: true
    }, InvDate: {
        type: Date,
        require: true
    }, details: {
        type: Object,
        require: true
    }, Total: {
        type: Number,
        require: true
    }, customer_id: {
        type: String,
        require: true
    }, customer_name: {
        type: String,
        require: true
    }, job_id: {
        type: String,
        require: true
    }, job_name: {
        type: String,
        require: true
    }, job_location: {
        type: String,
        require: true
    }, job_type: {
        type: String,
        require: true
    }, totalTag: {
        type: Number,
        require: true
    }, notes: {
        type: String,
        require: true
    }, adjustment: {
        type: Number,
        require: true
    }, balance: {
        type: Number,
        require: true
    }, paid: {
        type: Number,
        require: true
    }, qtytble: {
        type: Object,
        require: true
    }, checkNo: {
        type: Number,
        require: true
    }

});

module.exports = mongoose.model('Invoices', InvoiceSchema);