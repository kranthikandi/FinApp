const mongoose = require('mongoose');

const TrailerSchema = mongoose.Schema({
    trailer_number :{
        type:String,
        require:true
    },
    last_used:{
        type:String,
        require:true
    },
    days_on_field:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true
    }
});

 module.exports = mongoose.model('trailers', TrailerSchema);

