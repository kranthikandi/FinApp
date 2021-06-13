const mongoose = require('mongoose');

const AReceivable = mongoose.Schema({
    status: {
        type: String,
        require: true
    }, customer_id: {
        type: String,
        require: true
    }, customer_name: {
        type: String,
        require: true
    }, updatedBy: {
        type: String,
        require: true
    }, updatedDate: {
        type: Date,
        require: true
    }, checkNum: {
        type: String,
        require: true
    }, checkDate: {
        type: Date,
        require: true
    }, checkAmt: {
        type: Number,
        require: true
    }, totalInv: {
        type: Number,
        require: true
    }, recentCheck: {
        type: Date,
        require: true
    }, invDetails: {
        type: Object,
        require: true
    }, paymentDetails: {
        type: Object,
        require: true
    }, TotalRev: {
        type: Number,
        require: true
    }, Due: {
        type: Number,
        require: true
    }

});

module.exports = mongoose.model('AReceivable', AReceivable);