const mongoose = require('mongoose');

const PayBillDriver = mongoose.Schema({
    tagDate: {
        type: Date,
        require: true
    }, driver_id: {
        type: String,
        require: true
    }, Fright_Bill: {
        type: String,
        require: true
    }, Driver: {
        type: String,
        require: true
    }, status: {
        type: String,
        require: true
    }, notes: {
        type: String,
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
    }, Time: {
        type: String,
        require: true
    }, Truck_Type: {
        type: String,
        require: true
    }, Rate: {
        type: String,
        require: true
    }, Truck_id: {
        type: String,
        require: true
    }, Fright_Bill: {
        type: String,
        require: true
    }, LocA: {
        type: String,
        require: true
    }, LocB: {
        type: String,
        require: true
    }, updatedBy: {
        type: String,
        require: true
    }, updatedDate: {
        type: Date,
        require: true
    }, BHRate: {
        type: Number,
        require: true
    }, BLRate: {
        type: Number,
        require: true
    }, BTRate: {
        type: Number,
        require: true
    }, PHQty: {
        type: Number,
        require: true
    }, PHRate: {
        type: Number,
        require: true
    }, PHTotal: {
        type: Number,
        require: true
    }, PLQty: {
        type: Number,
        require: true
    }, PLRate: {
        type: String,
        require: true
    }, PLTotal: {
        type: Number,
        require: true
    }, PTQty: {
        type: Number,
        require: true
    }, PTRate: {
        type: String,
        require: true
    }, PTTotal: {
        type: Number,
        require: true
    }, PTollQty: {
        type: Number,
        require: true
    }, PTollRate: {
        type: Number,
        require: true
    }, PTollTotal: {
        type: Number,
        require: true
    }, PDFQty: {
        type: Number,
        require: true
    }, PDFRate: {
        type: Number,
        require: true
    }, PDFTotal: {
        type: Number,
        require: true
    }, PSTQty: {
        type: Number,
        require: true
    }, PSTRate: {
        type: Number,
        require: true
    }, PSTTotal: {
        type: Number,
        require: true
    }, PBRFeeRate: {
        type: Number,
        require: true
    }, PBRFee: {
        type: Number,
        require: true
    }, ptotal: {
        type: Number,
        require: true
    }, pNetTotal: {
        type: Number,
        require: true
    }, statementId: {
        type: String,
        require: true
    }

});

module.exports = mongoose.model('APayable', PayBillDriver);