const mongoose = require('mongoose');

const TruckSchema = mongoose.Schema({
    truck_id: {
        type: String,
        require: true
    }, truck_type: {
        type: String,
        require: true
    }, license: {
        type: String,
        require: true
    }, Reg_exp: {
        type: Date,
        require: true
    }, status: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('trucks', TruckSchema);

