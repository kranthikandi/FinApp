const mongoose = require('mongoose');

const EmployeeSchema = mongoose.Schema({
    empId: {
        type: String,
        require: true
    }, empName: {
        type: String,
        require: true
    }, Role: {
        type: String,
        require: true
    }, empEmail: {
        type: String,
        require: true
    }, empPassword: {
        type: String,
        require: true
    }, empPhone: {
        type: String,
        require: true
    }, empAccess: {
        type: Array,
        require: true
    }, status: {
        type: String,
        require: true
    }, lastDate: {
        type: Date,
        require: true
    }, address: {
        type: String,
        require: true
    }, Pay: {
        type: Object,
        require: true
    }, Rate: {
        type: String,
        require: true
    }, Credits: {
        type: Array,
        require: true
    }, Social: {
        type: String,
        require: true
    }, payHr: {
        type: Number,
        require: true
    }, payPer: {
        type: Number,
        require: true
    },
    Dl_Exp: {
        type: Date,
        require: true
    },
    Dl_Id: {
        type: String,
        require: true
    },
    taxId: {
        type: String,
        require: true
    },
    ssn: {
        type: String,
        require: true
    }, zip: {
        type: String,
        require: true
    }, state: {
        type: String,
        require: true
    }, street_name: {
        type: String,
        require: true
    }, city: {
        type: String,
        require: true
    }, updated_by: {
        type: String,
        require: true
    },
    updated_date: {
        type: String,
        require: true
    }, profilePic: {
        type: String,
        require: true
    }, DLpic: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('employee', EmployeeSchema);

