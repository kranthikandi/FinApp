const mongoose = require('mongoose');

const ICDriversSchema = mongoose.Schema({
    ICdriver_id: {
        type: String,
        require: true
    }, ICdriver_name: {
        type: String,
        require: true
    }, status: {
        type: String,
        require: true
    }, NoOfTrucks: {
        type: String,
        require: true
    }, street_name: {
        type: String,
        require: true
    }, address: {
        type: String,
        require: true
    }, city: {
        type: String,
        require: true
    }, state: {
        type: String,
        require: true
    }, zip: {
        type: Number,
        require: true
    }, trucks: {
        type: Array,
        require: true
    }, ssn: {
        type: String,
        require: true
    }, taxId: {
        type: String,
        require: true
    }, Ins_provider: {
        type: String,
        require: true
    }, Ins_Id: {
        type: String,
        require: true
    }, Ins_Exp: {
        type: Date,
        require: true
    }, Dl_Id: {
        type: String,
        require: true
    }, Dl_Exp: {
        type: Date,
        require: true
    }, DLpic: {
        type: String,
        require: true
    }, dispStatus: {
        type: String,
        require: true
    }, BrokerFee: {
        type: Number,
        require: true
    }, TrailerFee: {
        type: Number,
        require: true
    }, TrIn: {
        type: Boolean,
        require: true
    },
    WoCo: {
        type: Boolean,
        require: true
    },
    MoCaPe: {
        type: Boolean,
        require: true
    },
    SuAg: {
        type: Boolean,
        require: true
    },
    DrPr: {
        type: Boolean,
        require: true
    },
    GeLi: {
        type: Boolean,
        require: true
    }, TrInPic: {
        type: String,
        require: true
    },
    WoCoPic: {
        type: String,
        require: true
    },
    MoCaPePic: {
        type: String,
        require: true
    },
    SuAgPic: {
        type: String,
        require: true
    },
    DrPrPic: {
        type: String,
        require: true
    },
    GeLiPic: {
        type: String,
        require: true
    }, TrInExp: {
        type: Date,
        require: true
    },
    WoCoExp: {
        type: Date,
        require: true
    },
    MoCaPeExp: {
        type: Date,
        require: true
    },
    SuAgExp: {
        type: Date,
        require: true
    },
    DrPrExp: {
        type: Date,
        require: true
    },
    GeLiExp: {
        type: Date,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }, DriPass: {
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
    }

});

module.exports = mongoose.model('ICDriver', ICDriversSchema);

