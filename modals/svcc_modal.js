const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
    full_name :{
        type:String,
        require:true
    },
    email :{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    
    request:{
        type:Object,
        require:true
    },
    
});

 module.exports = mongoose.model('svcc', ContactSchema);

