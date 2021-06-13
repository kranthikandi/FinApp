const mongoose = require('mongoose');

const DispatchSchema = mongoose.Schema({
    DispDate: {
        type: Date,
        require: true
    },
    driver_id: {
        type: String,
        require: true
    }, Driver: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    notes: {
        type: String,
        require: true
    },
    customer_id: {
        type: String,
        require: true
    },
    customer_name: {
        type: String,
        require: true
    },
    job_id: {
        type: String,
        require: true
    },
    job_name: {
        type: String,
        require: true
    },
    job_location: {
        type: String,
        require: true
    },
    job_type: {
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
    }, Fright_bill: {
        type: String,
        require: true
    }, locA: {
        type: String,
        require: true
    }, locB: {
        type: String,
        require: true
    }, material: {
        type: String,
        require: true
    }, billRate: {
        type: Number,
        require: true
    }, updated_by: {
        type: String,
        require: true
    },
    updated_date: {
        type: String,
        require: true
    },
});

module.exports = mongoose.model('dispatch', DispatchSchema);

