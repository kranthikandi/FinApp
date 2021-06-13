const express = require('express');
const moment = require('moment')
const paginate = require('express-paginate')
const router = express.Router();
const multer = require('multer')
const bill = require('../modals/ftbill')
const jobs = require('../modals/jobs')
const Driver = require('../modals/ICdriver')
const emp = require('../modals/employee')
const Apayble = require('../modals/APmodal')
const Customer = require('../modals/customer.js')
const rec = require('../modals/ARmodal')
const dispatch = require('../modals/dispatch')
const fs = require('fs');
const activity = require('../modals/activity')
var log4js = require('log4js');
var logger = log4js.getLogger(), timestamp = new Date()
router.use(paginate.middleware(50, 50))

router.post('/AllFtBills', async (req, res, _next) => {
    const skip = (req.body.page - 1) * req.query.limit
    try {
        const [results, itemCount] = await Promise.all([
            bill.find({ status: { $ne: 'Paid' } }, { Fright_Bill: 1, date: 1, customer_id: 1, customer_name: 1, job_id: 1, _id: 0, Driver: 1, status: 1 })
                .limit(req.query.limit)
                .skip(skip)
                //.lean()
                //.exec(),
                .sort({ 'date': 1 }),
            bill.countDocuments({})
        ])
        var msg = 'View recent Tags '
        logActivity(req.body.user, req.body.role, timestamp, 'View recent Tags', msg)
        const pageCount = Math.ceil(itemCount / req.query.limit);
        // inspired by Stripe's API response for list objects
        res.json({
            count: itemCount,
            pages: pageCount,
            resSize: results.length,
            data: results
        });
    } catch (err) {
    }

    // bill.find({ status: { $ne: 'Paid' } }, { Fright_Bill: 1, date: 1, customer_id: 1, customer_name: 1, job_id: 1, _id: 0, Driver: 1, status: 1 }, function (_err, ftbills) {
    //     logger.info(' ftbill.js Line #14 /AllFtBills  ' + ftbills);
    //     res.json(ftbills);
    // }).sort({ 'date': -1 }).limit(200)
})

router.post('/newFTBill', (req, res, _next) => {
    let newBill = new bill({
        customer_id: req.body.custId, customer_name: req.body.custName,
        job_id: req.body.JobId, job_name: req.body.jobName, job_location: req.body.job_location,
        job_type: req.body.jobType, notes: req.body.notes, status: req.body.status,
        date: req.body.Date, Time: req.body.Time, Fright_Bill: req.body.Fright_Bill,
        Truck_id: req.body.Truck_id, Driver: req.body.Driver, driver_id: req.body.DriverId,
        Truck_Type: req.body.Truck_Type, LocA: req.body.locA,
        LocB: req.body.locB, updatedBy: req.body.updated,
        updatedDate: req.body.updatedTime, BHQty: req.body.BHQty, BHRate: req.body.BHRate,
        BHTotal: req.body.BHTotal, BLQty: req.body.BLQty, BLRate: req.body.BLRate,
        BLTotal: req.body.BLTotal, BTQty: req.body.BTQty, BTRate: req.body.BTRate,
        BTTotal: req.body.BTTotal, BTollQty: req.body.BTollQty, BTollRate: req.body.BTollRate,
        BTollTotal: req.body.BTollTotal, BDFQty: req.body.BDFQty, BDFRate: req.body.BDFRate,
        BDFTotal: req.body.BDFTotal, BSTQty: req.body.BSTQty, BSTRate: req.body.BSTRate,
        BSTTotal: req.body.BSTTotal, BBRate: req.body.BBRate,
        BBTotal: req.body.BBTotal, bTotal: req.body.btotal,
        PHQty: req.body.PHQty, PHRate: req.body.PHRate, PHTotal: req.body.PHTotal,
        PLQty: req.body.PLQty, PLRate: req.body.PLRate, PLTotal: req.body.PLTotal,
        PTQty: req.body.PTQty, PTRate: req.body.PTRate, PTTotal: req.body.PTTotal,
        PTollQty: req.body.PTollQty, PTollRate: req.body.PTollRate, PTollTotal: req.body.PTollTotal,
        PDFQty: req.body.PDFQty, PDFRate: req.body.PDFRate, PDFTotal: req.body.PDFTotal,
        PSTQty: req.body.PSTQty, PSTRate: req.body.PSTRate, PSTTotal: req.body.PSTTotal,
        PBRFeeRate: req.body.PBRFeeRate, PBRFee: req.body.PBRFee, pNetTotal: req.body.pNetTotal,
        pTotal: req.body.ptotal
    });
    newBill.save((err, data) => {
        if (err) {
            logger.error('ftbill.js Line #47 /newFTBill' + err);
            res.json({ msg: 'fail' });
        } else {
            logger.info(' ftbill.js Line #50 /newFTBill  ' + data);
            let newAP = new Apayble({
                Fright_Bill: req.body.Fright_Bill,
                status: 'Created',
                updatedDate: req.body.updatedTime,
                driver_id: req.body.DriverId,
                Driver: req.body.Driver,
                updatedBy: req.body.updated,
                BHRate: req.body.BHRate, BLRate: req.body.BLRate, BTRate: req.body.BTRate,
                PHQty: req.body.PHQty, PHRate: req.body.PHRate, PHTotal: req.body.PHTotal,
                PLQty: req.body.PLQty, PLRate: req.body.PLRate, PLTotal: req.body.PLTotal,
                PTQty: req.body.PTQty, PTRate: req.body.PTRate, PTTotal: req.body.PTTotal,
                PTollQty: req.body.PTollQty, PTollRate: req.body.PTollRate, PTollTotal: req.body.PTollTotal,
                PDFQty: req.body.PDFQty, PDFRate: req.body.PDFRate, PDFTotal: req.body.PDFTotal,
                PSTQty: req.body.PSTQty, PSTRate: req.body.PSTRate, PSTTotal: req.body.PSTTotal,
                PBRFeeRate: req.body.PBRFeeRate, PBRFee: req.body.PBRFee,
                ptotal: req.body.ptotal, pNetTotal: req.body.pNetTotal,
                customer_id: req.body.customer_id,
                customer_name: req.body.custName,
                job_id: req.body.JobId,
                job_name: req.body.jobName,
                job_type: req.body.jobType,
                tagDate: req.body.Date
            });
            newAP.save((err, apayable) => {
                if (err) {
                    logger.error('ftbill.js Line #76 /newFTBill' + err);
                    res.json({ err, msg: 'error' });
                } else {
                    var msg = 'Insert new Tags ' + req.body.Fright_Bill
                    logActivity(req.body.user, req.body.role, timestamp, 'New Tags', msg)
                    logger.info(' ftbill.js Line #79 /newFTBill  ' + apayable);
                    res.json({ msg: 'success' });
                }
            })
        }
    })
})

router.post('/ftBillAdd', (req, res, _next) => {
    bill.updateOne({ _id: req.body.id }, { $set: { status: req.body.status, Fright_bill: req.body.Fbill } }, function (err, result) {
        if (err) {
            logger.error('dispatch.js Line #151 /dispUpdate' + err);
            res.json(err);
        } else {
            //sendSMS(req)
            var msg = 'Updated dispatch for ' + req.body.job_id +
                ' for ' + req.body.dispDate + ' for Driver ' + req.body.driver
            logActivity(req.body.user, req.body.role, timestamp, 'Update Dispatch', msg)
            logger.info(' dispatch.js Line #154 /dispUpdate  ' + result);
            res.json(result);
        }
    })
})

router.post('/getFtBill', (req, res, _next) => {
    bill.find({ Fright_Bill: req.body.bill }, function (err, result) {
        if (err) {
            logger.error('ftbill.js Line #123 /getFtBill' + err);
            res.json(err);
        } else {
            var msg = 'View Tag' + req.body.bill
            logActivity(req.body.user, req.body.role, timestamp, 'View Tags', msg)
            logger.info(' ftbill.js Line #126 /getFtBill  ' + result);
            res.json(result);
        }
    })
})

router.post('/updateFtBill', (req, res, _next) => {
    bill.updateOne({ '$or': [{ _id: req.body.fullId }, { Fright_Bill: req.body.tagid }] }, {
        $set: {
            Fright_Bill: req.body.tagid,
            updatedBy: req.body.updated,
            updatedDate: req.body.updatedTime,
            status: req.body.status,
            BHQty: req.body.BHQty, BHRate: req.body.BHRate, BHTotal: req.body.BHTotal,
            BLQty: req.body.BLQty, BLRate: req.body.BLRate, BLTotal: req.body.BLTotal,
            BTQty: req.body.BTQty, BTRate: req.body.BTRate, BTTotal: req.body.BTTotal,
            BTollQty: req.body.BTollQty, BTollRate: req.body.BTollRate, BTollTotal: req.body.BTollTotal,
            BDFQty: req.body.BDFQty, BDFRate: req.body.BDFRate, BDFTotal: req.body.BDFTotal,
            BSTQty: req.body.BSTQty, BSTRate: req.body.BSTRate, BSTTotal: req.body.BSTTotal,
            BBRate: req.body.BBRate, BBTotal: req.body.BBTotal,
            bTotal: req.body.btotal,
            PHQty: req.body.PHQty, PHRate: req.body.PHRate, PHTotal: req.body.PHTotal,
            PLQty: req.body.PLQty, PLRate: req.body.PLRate, PLTotal: req.body.PLTotal,
            PTQty: req.body.PTQty, PTRate: req.body.PTRate, PTTotal: req.body.PTTotal,
            PTollQty: req.body.PTollQty, PTollRate: req.body.PTollRate, PTollTotal: req.body.PTollTotal,
            PDFQty: req.body.PDFQty, PDFRate: req.body.PDFRate, PDFTotal: req.body.PDFTotal,
            PSTQty: req.body.PSTQty, PSTRate: req.body.PSTRate, PSTTotal: req.body.PSTTotal,
            PBRFeeRate: req.body.PBRFeeRate, PBRFee: req.body.PBRFee,
            Driver: req.body.Driver,
            customer_name: req.body.customer_name, customer_id: req.body.customer_id,
            job_id: req.body.JobId, job_name: req.body.jobName, job_location: req.body.job_location, job_type: req.body.jobType,
            Time: req.body.Time, Truck_Type: req.body.Truck_Type, Truck_id: req.body.Truck_id,
            date: req.body.date,
            pNetTotal: req.body.pNetTotal,
            pTotal: req.body.ptotal,
            LocA: req.body.loca, LocB: req.body.locb, material: req.body.material
        }
    }, function (err, result) {

        if (err) {
            logger.error('ftbill.js Line #176 /updateFtBill' + err);
            res.json(err);
        } else {
            var msg = 'Update Tag' + req.body.tagid
            logActivity(req.body.user, req.body.role, timestamp, 'Update Tags', msg)
            logger.info(' ftbill.js Line #179 /updateFtBill  ' + result);
            res.json(result);
        }
    })
})

//{ Fright_Bill: 1, date: 1, bqty: 1, brate: 1, bTotal: 1, _id: 0, job_id: 1 },
router.post('/getEnterFTB', (req, res, _next) => {
    bill.find({ status: 'Entered' },
        { date: 1, Fright_Bill: 1, customer_name: 1, job_name: 1, Truck_id: 1, Driver: 1, job_location: 1, bqty: 1, brate: 1, bTotal: 1, _id: 0 },
        function (err, result) {
            if (err) {
                logger.error('ftbill.js Line #191 /getEnterFTB' + err);
                res.json(err);
            } else {
                var msg = 'View all Entered Tag' + req.body.tagid
                logActivity(req.body.user, req.body.role, timestamp, 'View Entered Tags', msg)
                logger.info(' ftbill.js Line #194 /getEnterFTB  ' + result);
                res.json(result);
            }
        }).sort({ 'date': -1 }).limit(200)
})

router.post('/DriFTBDetails', (req, res, _next) => {
    bill.find({ Driver: req.body.driver_name, '$or': [{ status: 'Created' }, { status: 'Entered' }, { status: 'Invoiced' }, { status: 'Preview' }, { status: 'Paid' }, { status: 'P-Paid' }] },
        { '_id': 0, 'Fright_Bill': 1 },
        function (_err, ICDrivers) {
            logger.info(' ftbill.js Line #202 /DriFTBDetails  ' + ICDrivers);
            var msg = 'View all Drivers Tag' + req.body.driver_name
            logActivity(req.body.user, req.body.role, timestamp, 'View Drivers Tags', msg)
            res.json(ICDrivers);
        })
})



router.post('/uniqueFTB', (req, res, _next) => {
    bill.find({ Fright_Bill: req.body.bill }, { '_id': 1, 'Fright_Bill': 1, 'customer_name': 1, 'date': 1 }, function (err, result) {
        if (err) {
            logger.error('ftbill.js Line #212 /uniqueFTB' + err);
            res.json(err);
        } else {
            logger.info(' ftbill.js Line #215 /uniqueFTB  ' + result);
            res.json(result);
        }
    })
})

router.post('/getCustInvs', (req, res, _next) => {
    bill.find({
        '$or': [{ status: 'Entered' }, { status: 'Invoiced' }, { status: 'Preview' }, { status: 'P-Paid' }],
        customer_name: req.body.custName, date: { $lte: req.body.end, $gte: req.body.start }
    }, function (err, result) {
        if (err) {
            logger.error('ftbill.js Line #224 /getCustInvs' + err);
            res.json(err);
        } else {
            var msg = 'View all Customer Tag' + req.body.custName
            logActivity(req.body.user, req.body.role, timestamp, 'View Customer Tags', msg)
            logger.info(' ftbill.js Line #227 /getCustInvs  ' + result);
            res.json(result);
        }
    })

})
router.post('/getCustTagsInved', (req, res, _next) => {
    bill.find({ customer_id: req.body.custId, '$or': [{ status: 'Invoiced' }, { status: 'P-Paid' }, { status: 'Entered' }] }, function (err, result) {
        if (err) {
            logger.error('ftbill.js Line #236 /getCustTagsInved' + err);
            res.json(err);
        } else {
            var msg = 'View all Customers invoiced Tag' + req.body.custName
            logActivity(req.body.user, req.body.role, timestamp, 'View Customer invoiced Tags', msg)
            logger.info(' ftbill.js Line #239 /getCustTagsInved  ' + result);
            res.json(result);
        }
    })

})
router.post('/getDriInvs', (req, res, _next) => {
    bill.find({
        '$or': [{ status: 'Entered' }, { status: 'Invoiced' }, { status: 'Preview' }, { status: 'Paid' }, { status: 'P-Paid' }],
        Driver: req.body.driName, date: { $lte: req.body.end, $gte: req.body.start }
    }, function (err, result) {
        if (err) {
            logger.error('ftbill.js Line #248 /getDriInvs' + err);
            res.json(err);
        } else {
            var msg = 'View Driver invoiced ' + req.body.custName
            logActivity(req.body.user, req.body.role, timestamp, 'View Driver Invoice', msg)
            logger.info(' ftbill.js Line #251 /getDriInvs  ' + result);
            res.json(result);
        }
    })

})

router.post('/getAllTags', (req, res, _next) => {
    bill.find({ customer_name: req.body.cust_name, status: 'Entered', date: { $gte: req.body.start, $lte: req.body.end, } }, function (err, result) {
        if (err) {
            logger.error('ftbill.js Line #261 /getAllTags' + err);
            res.json(err);
        } else {
            var msg = 'View customer enterd Tags ' + req.body.cust_name
            logActivity(req.body.user, req.body.role, timestamp, 'View Customer tags', msg)
            logger.info(' ftbill.js Line #264 /getAllTags  ' + result);
            res.json(result);
        }
    })
})

router.post('/CustDetails', (req, res, _next) => {
    bill.aggregate([
        { "$match": { customer_name: req.body.custName } },
        {
            $group: {
                _id: 0,
                job_name: { $addToSet: '$job_name' },
            }
        }
    ], function (err, result) {
        if (err) {
            logger.error('ftbill.js Line #281 /CustDetails' + err);
            res.json(err);
        } else {
            logger.info(' ftbill.js Line #284 /CustDetails  ' + result);
            Customer.findOne({ customer_name: req.body.custName }, { _id: 0, customer_id: 1 }, function (err, CustId) {
                if (err) {
                    res.json(err);
                } else {
                    logger.info(' ftbill.js Line #289 /CustDetails  ' + CustId);
                    res.json({ jobs: result, custId: CustId });
                }
            })

        }
    })
})

router.post('/AllUnpaidBills', (req, res, _next) => {
    bill.find({
        $and: [
            { customer_name: req.body.cust },
            { '$or': [{ status: 'Invoiced' }, { status: 'Entered' }] }
        ]
    }, { Fright_Bill: 1, date: 1, customer_id: 1, customer_name: 1, job_id: 1, _id: 0, Driver: 1, status: 1 }, function (_err, ftbills) {
        var msg = 'View unpaid tags for  customer ' + req.body.cust
        logActivity(req.body.user, req.body.role, timestamp, 'View unpaid Customer tags', msg)
        logger.info(' ftbill.js Line #14 /AllUnpaidBills  ' + ftbills);
        res.json(ftbills);
    }).sort({ 'date': -1 })
})

router.post('/pendingTags', (req, res, _next) => {
    bill.find({
        $or: [
            { status: 'Pending' },
            { status: 'Uploaded' },
        ]
    }, function (_err, ftbills) {
        var msg = 'View pending tags for  customer '
        logActivity('', '', timestamp, 'View unpaid Customer tags', msg)
        logger.info(' ftbill.js Line #14 /AllUnpaidBills  ' + ftbills);
        res.json(ftbills);
    }).sort({ 'date': -1 })

})

router.post('/dataFixes', (req, res, _next) => {
    /* bill.find({ customer_name: req.body.cust_name, status: 'Entered', date: { $lte: req.body.end, $gte: req.body.start } }, function (err, result) {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    }) */
    /* bill.updateMany({ status: { $ne: "Entered" } }, { $set: { status: 'Entered' } }, function (err, result) {
        if (err) {
            logger.error('ftbill.js Line #310 /dataFixes' + err);
            res.json(err);
        } else {
            logger.info(' ftbill.js Line #313 /dataFixes  ' + result);
            res.json(result);
        }
    }) */
    /*  dispatch.find({ 'Fright_bill': { $exists: true, $ne: null, $ne: '' } }, function (err, r) {
         if (err) {
             res.json(err);
         } else {
             for (var i = 0; i < r.length; i++) {
                 var r
                 bill.where({ Fright_Bill: r[0].Fright_bill }).updateOne({
                     $set: { dispatchId: r[0]._id }
                 }, function (err, result) {
                     if (err) {
                         console.log(err)
                     } else {
                         console.log(result)
                         r = result
                     }
                 })
             }
             res.json(r);
         }
     }) */


    //.distinct('Fright_Bill',
    /*  bill.find().distinct('Fright_Bill', function (err, bi) {
         if (err) {
 
         } else {
             console.log(bi.length)
              res.json({ 'Count': bills.length });
             Apayble.find().distinct('Fright_Bill', function (err, Apayble) {
                 var missingTag = []
                 for (var i = 0; i < bills.length; i++) {
                     if (!Apayble.includes(bills[i])) {
                         missingTag.push(bills[i])
                     }
                 }
                 res.json({ 'missingTag': missingTag }); 
}
    }) * /
 
 
    /* //add driver to dispatch
    Driver.find({ status: 'Active' }, { 'ICdriver_id': 1, 'ICdriver_name': 1, 'NoOfTrucks': 1 }, function (err, ICDrivers) {
     
             if (err) {
                 logger.error('ICDriver.js Line #26 /Alldrivers' + err);
                 res.json(err);
             } else {
                 var lastID
                 logger.info(' ICDriver.js Line #29 /Alldrivers  ' + ICDrivers);
                 emp.find({ status: 'Active', Role: 'Driver' }, { 'empId': 1, 'empName': 1 }, function (err, trucks) {
                     if (err) {
                         logger.error('ICDriver.js Line #32 /Alldrivers' + err);
                     } else {
                         logger.info(' ICDriver.js Line #35 /Alldrivers  ' + ICDrivers);
                         var drivers = []
                         for (var i = 0; i < ICDrivers.length; i++) {
                             var d = {
                                 ICdriver_id: ICDrivers[i].ICdriver_id,
                                 ICdriver_name: ICDrivers[i].ICdriver_name,
                                 NoOfTrucks: parseInt(ICDrivers[i].NoOfTrucks)
                             }
                             drivers.push(d)
                         }
                         for (var i = 0; i < trucks.length; i++) {
                             var d = {
                                 ICdriver_id: trucks[i].empId,
                                 ICdriver_name: trucks[i].empName,
                                 NoOfTrucks: 1
                             }
                             drivers.push(d)
                         }
                         dispatch.find({ 'Driver': null }, { _id: 1 }, function (err, re) {
                             var totalDri = drivers.length
     
                             for (var d = 0; d < re.length; d++) {
                                 for (var i = 0; i < drivers.length; i++) {
                                     for (var t = 0; t < drivers[i].NoOfTrucks; t++) {
                                         if (re[d] && drivers[i].ICdriver_name) {
                                             dispatch.updateOne({ _id: re[d] }, { $set: { Driver: drivers[i].ICdriver_name, Truck_id: drivers[i].ICdriver_id } }, function (err, updated) {
                                             })
                                             d++
                                         }
                                     }
                                 }
                             }
                             var totCount = re.length + ' : ' + totalDri
                             res.json(
                                 totCount
                             );
                         })
                     }
                 })
             }
         }) */
    // find dispatch without drivers assigined 

    /* dispatch.find({ 'Driver': null }, { _id: 1 }, function (err, re) {
        console.log(re.length)
        res.json(re.length);
    }) */

    /* dispatch.where({ _id: req.body.dispatchId }).updateOne({
        $set: { Fright_Bill: req.body.Fright_Bill }
    }, function (err, resu) {
        if (err) {
            console.log(err)
            res.json(err);
        } else {
            console.log(resu)
            res.json(resu);
        }
    }) */

    //find missing tags
    //Add FTbills to Disp
    /* var missingTags, disp = []
    dispatch.find({ '$or': [{ Fright_bill: '' }, { Fright_bill: null }] }, function (err, re) {
        disp = re
        console.log(re.length)
        for (var i = 0; i <= re.length - 1; i++) {
            var ftbill = Math.floor(Math.random() * 100000)
            //console.log(ftbill)
            dispatch.updateOne({ _id: disp[i]._id }, { $set: { Fright_bill: ftbill } }, function (err, updated) {
                console.log(updated)
            })
            var ran = Math.ceil(Math.random() * 3)
            if (ran == 1) {
                assignFTBillshr(ftbill, disp[i])
            } else if (ran == 2) {
                assignFTBillsload(ftbill, disp[i])
            } else {
                assignFTBillstn(ftbill, disp[i])
            }
        }
    }).limit(1000) */
    //Remove Duplicate Tags
    bill.updateMany({ Driver: 'golden state trucking' }, { $set: { Driver: 'golden gate trucking' } }, function (err, b) {
        console.log(b)
    })

    /*  var bills = []
     var results = [];
     console.log('test')
     bill.find({}, { 'Fright_Bill': 1, '_id': 0 }), function (err, b) {
         bills = b
         console.log(b)
         var sorted_arr = bills.slice().sort();
         console.log(sorted_arr)
         for (var i = 0; i < sorted_arr.length - 1; i++) {
             if (sorted_arr[i + 1] === sorted_arr[i]) {
                 results.push(sorted_arr[i]);
                 console.log(sorted_arr[i])
             }
         }
         res.json(results);
     } */
})
function logActivity(user, role, timestamp, a, msg) {
    let log = new activity({
        user: user,
        role: role,
        timestamp: timestamp,
        activity: a,
        msg: msg,
    });
    log.save((err, log) => {
        if (err) {
            logger.error('dispatch.js Line #236 logging Activity' + err);
        }
        else {
        }
    })
}
function assignFTBillshr(ftbill, disp) {
    let hr = Math.random() * 14 + 4,
        rate = Math.random() * 20 + 95
    hr = hr.toFixed(2)
    rate = rate.toFixed(2)
    var prate = rate - 8,
        brFee = (hr * prate) * 0.08,
        net = (hr * prate) - brFee, result
    prate = prate.toFixed(2)
    let newBill = new bill({
        Fright_Bill: ftbill,
        status: 'Entered',
        customer_id: disp.customer_id,
        customer_name: disp.customer_name,
        job_id: disp.job_id,
        job_name: disp.job_name,
        job_type: disp.job_type,
        driver_id: disp.DriverId,
        Driver: disp.Driver,
        Truck_id: disp.Truck_id,
        Truck_Type: disp.Truck_Type,
        date: disp.DispDate,
        Time: disp.Time,
        LocA: disp.locA,
        LocB: disp.locB,
        job_location: disp.job_location,
        updatedDate: new Date(),
        updatedBy: 'admin',
        BHQty: hr, BHRate: rate, BHTotal: (hr * rate).toFixed(2), bTotal: (hr * rate).toFixed(2),
        PHQty: hr, PHRate: prate, PHTotal: (hr * prate).toFixed(2),
        PBRFeeRate: 8, PBRFee: brFee.toFixed(2), pNetTotal: net.toFixed(2),
        pTotal: (hr * prate).toFixed(2)
    });
    newBill.save((err, data) => {
        result = data
        //console.log(data)
    })
    return result
}
function assignFTBillsload(ftbill, disp) {
    let ld = Math.ceil(Math.random() * 10),
        rate = Math.random() * 350 + 150
    ld = ld.toFixed(2)
    rate = rate.toFixed(2)
    var prate = rate - (Math.floor(Math.random() * 150)),
        brFee = (ld * prate) * 0.08,
        net = (ld * prate) - brFee, result
    prate = prate.toFixed(2)
    let newBill = new bill({
        Fright_Bill: ftbill,
        status: 'Entered',
        customer_id: disp.customer_id,
        customer_name: disp.customer_name,
        job_id: disp.job_id,
        job_name: disp.job_name,
        job_type: disp.job_type,
        driver_id: disp.DriverId,
        Driver: disp.Driver,
        Truck_id: disp.Truck_id,
        Truck_Type: disp.Truck_Type,
        date: disp.DispDate,
        Time: disp.Time,
        LocA: disp.locA,
        LocB: disp.locB,
        job_location: disp.job_location,
        updatedDate: new Date(),
        updatedBy: 'admin',
        BLQty: ld, BLRate: rate, BLTotal: (ld * rate).toFixed(2), bTotal: (ld * rate).toFixed(2),
        PLQty: ld, PLRate: prate, PLTotal: (ld * prate).toFixed(2),
        PBRFeeRate: 8, PBRFee: brFee.toFixed(2), pNetTotal: net.toFixed(2),
        pTotal: (ld * prate).toFixed(2)
    });
    newBill.save((err, data) => {
        result = data
        //console.log(data)
    })
    return result
}
function assignFTBillstn(ftbill, disp) {
    let tn = (Math.random() * 50) + 40,
        rate = Math.random() * 15 + 8
    tn = tn.toFixed(2)
    rate = rate.toFixed(2)
    var prate = rate - (Math.floor(Math.random() * 150)),
        brFee = (tn * prate) * 0.08,
        net = (tn * prate) - brFee, result
    prate = prate.toFixed(2)
    let newBill = new bill({
        Fright_Bill: ftbill,
        status: 'Entered',
        customer_id: disp.customer_id,
        customer_name: disp.customer_name,
        job_id: disp.job_id,
        job_name: disp.job_name,
        job_type: disp.job_type,
        driver_id: disp.DriverId,
        Driver: disp.Driver,
        Truck_id: disp.Truck_id,
        Truck_Type: disp.Truck_Type,
        date: disp.DispDate,
        Time: disp.Time,
        locA: disp.locA,
        locB: disp.locB,
        job_location: disp.job_location,
        updatedDate: new Date(),
        updatedBy: 'admin',
        BTQty: tn, BTRate: rate, BTTotal: (tn * rate).toFixed(2), bTotal: (tn * rate).toFixed(2),
        PTQty: tn, PTRate: prate, PTTotal: (tn * prate).toFixed(2),
        PBRFeeRate: 8, PBRFee: brFee.toFixed(2), pNetTotal: net.toFixed(2),
        pTotal: (tn * prate).toFixed(2)
    });
    newBill.save((err, data) => {
        result = data
        //console.log(data)
    })
    return result
}
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../etrucking_ui/uploads/ftbills')
    },
    filename: function (req, file, cb) {
        cb(null, Date.parse(new Date()) + '-' + file.originalname)
    }
})


var upload = multer({ storage: storage })
router.post('/uploadphoto', upload.single('picture'), (req, res) => {

    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database

    bill.findOneAndUpdate({ Fright_Bill: req.body.tagId }, {
        date: req.body.date,
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        image: req.file.path,
        status: 'Uploaded'
    }, {
        upsert: true
    }, function (err, result) {
        if (!err) {
            res.json('success');
        } else {
            res.json('Error');
        }
    })
})

module.exports = router;