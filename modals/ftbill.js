const mongoose = require('mongoose');

const FtBillSchema = mongoose.Schema({
    date: {
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
        type: Array,
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
    }, Fright_Bill: {
        type: String,
        require: true
    }, LocA: {
        type: String,
        require: true
    }, LocB: {
        type: String,
        require: true
    }, bqty: {
        type: Number,
        require: true
    }, brate: {
        type: Number,
        require: true
    }, bfee: {
        type: Number,
        require: true
    }, dumpFee: {
        type: Number,
        require: true
    }, stTime: {
        type: Number,
        require: true
    }, mFee: {
        type: Number,
        require: true
    }, bAdj: {
        type: Number,
        require: true
    }, bTotal: {
        type: Number,
        require: true
    }, phr: {
        type: String,
        require: true
    }, pTon: {
        type: Number,
        require: true
    }, pLoad: {
        type: Number,
        require: true
    }, pqty: {
        type: Number,
        require: true
    }, prate: {
        type: Number,
        require: true
    }, pfee: {
        type: Number,
        require: true
    }, pBrokerFee: {
        type: Number,
        require: true
    }, pCredit: {
        type: Number,
        require: true
    }, pTotal: {
        type: Number,
        require: true
    }, updatedBy: {
        type: String,
        require: true
    }, updatedDate: {
        type: Date,
        require: true
    }, invId: {
        type: String,
        require: true
    }, invDate: {
        type: Date,
        require: true
    },
    BHQty: {
        type: Number,
        require: true
    },
    BHRate: {
        type: Number,
        require: true
    },
    BHTotal: {
        type: Number,
        require: true
    },
    BLQty: {
        type: Number,
        require: true
    },
    BLRate: {
        type: Number,
        require: true
    },
    BLTotal: {
        type: Number,
        require: true
    },
    BTQty: {
        type: Number,
        require: true
    },
    BTRate: {
        type: Number,
        require: true
    },
    BTTotal: {
        type: Number,
        require: true
    },
    BTollQty: {
        type: Number,
        require: true
    },
    BTollRate: {
        type: Number,
        require: true
    },
    BTollTotal: {
        type: Number,
        require: true
    },
    BDFQty: {
        type: Number,
        require: true
    },
    BDFRate: {
        type: Number,
        require: true
    },
    BDFTotal: {
        type: Number,
        require: true
    },
    BSTQty: {
        type: Number,
        require: true
    },
    BSTRate: {
        type: Number,
        require: true
    },
    BSTTotal: {
        type: Number,
        require: true
    },
    BBRate: {
        type: Number,
        require: true
    },
    BBTotal: {
        type: Number,
        require: true
    },
    PHQty: {
        type: Number,
        require: true
    }, PHRate: {
        type: Number,
        require: true
    }, PHTotal: {
        type: Number,
        require: true
    },
    PLQty: {
        type: Number,
        require: true
    }, PLRate: {
        type: String,
        require: true
    }, PLTotal: {
        type: Number,
        require: true
    },
    PTQty: {
        type: Number,
        require: true
    }, PTRate: {
        type: String,
        require: true
    }, PTTotal: {
        type: Number,
        require: true
    },
    PTollQty: {
        type: Number,
        require: true
    }, PTollRate: {
        type: Number,
        require: true
    }, PTollTotal: {
        type: Number,
        require: true
    },
    PDFQty: {
        type: Number,
        require: true
    }, PDFRate: {
        type: Number,
        require: true
    }, PDFTotal: {
        type: Number,
        require: true
    },
    PSTQty: {
        type: Number,
        require: true
    }, PSTRate: {
        type: Number,
        require: true
    }, PSTRate: {
        type: Number,
        require: true
    },
    PBRFeeRate: {
        type: Number,
        require: true
    }, PBRFee: {
        type: Number,
        require: true
    },
    pNetTotal: {
        type: Number,
        require: true
    }, checkNo: {
        type: Number,
        require: true
    }, payables: {
        type: Object,
        require: true
    }, received: {
        type: Number,
        require: true
    }, balance: {
        type: Number,
        require: true
    }, dispatchId: {
        type: Object,
        require: true
    }, material: {
        type: String,
        require: true
    }, contentType: {
        type: String,
        require: true
    }, image: {
        type: String,
        require: true
    }, fileName: {
        type: String,
        require: true
    }, tripDetails: {
        type: Array,
        require: true
    }, routeDetails: {
        type: Array,
        require: true
    }, locDetails: {
        type: Array,
        require: true
    }, jobTimer: {
        type: String,
        require: true
    }, sign: {
        type: String,
        require: true
    }, supName: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('ftBill', FtBillSchema);