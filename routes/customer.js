const express = require('express');
const router = express.Router();
const Customer = require('../modals/customer.js')
const AR = require('../modals/ARmodal')
const invmodal = require('../modals/invoiceModal')
const ftb = require('../modals/ftbill')
const Jobs = require('../modals/jobs')
const activity = require('../modals/activity')
var log4js = require('log4js');
const ftbill = require('../modals/ftbill');
var logger = log4js.getLogger(), timestamp = new Date()

//reterving data
router.get('/customers', (req, res, next) => {
    Customer.find(function (err, Customer) {
        var response = Customer
        if (err) {
            response = {
                'error': 38846
            }
            logActivity(req.body.user, req.body.role, timestamp, '/customers', err)
            logger.error('customer.js Line #15 /customers' + err);
        }
        var msg = 'View All Customers'
        logActivity(req.body.user, req.body.role, timestamp, 'View All Customers', msg)
        logger.info('customer.js Line #17 /customers' + Customer);
        res.json(response);
    })
})
//add contact
router.post('/customer', (req, res, next) => {
    let newCustomer = new Customer({
        customer_id: req.body.customer_id,
        customer_name: req.body.customer_name,
        customer_location: req.body.customer_location,
        phone: req.body.cust_phone,
        email: req.body.cust_email,
        status: req.body.status,
        broker: req.body.broker,
        TrIn: req.body.TrIn,
        WoCo: req.body.WoCo,
        MoCaPe: req.body.MoCaPe,
        SuAg: req.body.SuAg,
        DrPr: req.body.DrPr,
        GeLi: req.body.GeLi
    });
    newCustomer.save((err, Customer) => {
        if (err) {
            response = {
                'error': 45233
            }
            logActivity(req.body.user, req.body.role, timestamp, '/customer', err)
            logger.error('customer.js Line #33 /customer' + err);
            res.json(response);
        }
        var msg = 'View Customer details for ' + req.body.customer_name
        logActivity(req.body.user, req.body.role, timestamp, 'View Customer', msg)
        logger.info('customer.js Line #36 /customer' + Customer);
        newJob(req)
        res.json({ msg: 'success' });
    })
})
router.post('/updateCust', (req, res, next) => {
    Customer.updateOne({ customer_id: req.body.customer_id }, {
        $set: {
            status: req.body.status, updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate,
            customer_name: req.body.customer_name,
            customer_location: req.body.customer_location,
            phone: req.body.cust_phone,
            email: req.body.cust_email,
            status: req.body.status,
            broker: req.body.broker,
            TrIn: req.body.TrIn,
            WoCo: req.body.WoCo,
            MoCaPe: req.body.MoCaPe,
            SuAg: req.body.SuAg,
            DrPr: req.body.DrPr,
            GeLi: req.body.GeLi
        }
    }, function (err, result) {
        if (err) {
            logger.error('customer.js Line #53 /updateCust' + err);
            res.json({ msg: 'fail' });
        } else {
            logger.info('customer.js Line #56 /updateCust' + result);
            AR.updateOne({ customer_id: req.body.customer_id }, {
                $set: {
                    status: req.body.status, updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate,
                    customer_name: req.body.customer_name,
                }
            }, function (err, ARresult) {
                if (err) {
                    logger.error('customer.js Line #64 /updateCust' + err);
                    res.json({ msg: 'fail' });
                } else {
                    var msg = 'Updated Customer ' + req.body.customer_name
                    logActivity(req.body.user, req.body.role, timestamp, 'Updated Customer', msg)
                    logger.info('customer.js Line #67 /updateCust' + ARresult);
                    res.json({ msg: 'success' });
                }
            })
        }
    })
})

//get job details  of a job
router.post('/custLoc', (req, res, next) => {
    Customer.findOne({ customer_id: req.body.customer_id }, function (err, result) {
        if (err) {
            logger.error('customer.js Line #79 /custLoc' + err);
            res.json(err);
        } else {
            logger.info('customer.js Line #82 /custLoc' + result);
            res.json(result);
        }
    })
})

//delete contact
router.delete('/customer/:id', (req, res, next) => {
    Customer.remove({ _id: req.params.id }, function (err, result) {
        if (err) {
            logger.error('customer.js Line #92 /customer' + err);
            res.json(err);
        } else {
            logger.info('customer.js Line #95 /customer' + result);
            res.json({ msg: 'Success' });
        }
    })
})

// add Invoice
router.post('/newAR', (req, res, next) => {
    let newAR = new AR({
        customer_id: req.body.customer_id,
        customer_name: req.body.customer_name,
        status: req.body.status,
        totalInv: req.body.totalInv,
        recentCheck: req.body.recentCheck,
        invDetails: req.body.invDetails,
        TotalRev: req.body.totalRev,
        Due: req.body.Due,
        updatedBy: req.body.updatedBy,
        updatedDate: req.body.updatedDate
    });
    newAR.save((err, inv) => {
        if (err) {
            logger.error('customer.js Line #117 /newAR' + err);
            res.json({ msg: 'fail', err: err });
        } else {
            logger.info('customer.js Line #120 /newAR' + inv);
            res.json({ msg: 'success' });
        }
    })
})

router.get('/getAllAR', (req, res, next) => {
    AR.find(function (err, inv) {
        if (err) {
            logger.error('customer.js Line #129 /getAllAR' + err);
        }
        var msg = 'View Customer in AR'
        logActivity(req.body.user, req.body.role, timestamp, 'View Customers AR', msg)
        logger.info('customer.js Line #131 /getAllAR' + inv);
        res.json(inv);
    })
})

router.post('/updateARInv', (req, res, next) => {
    var amt = Math.abs(parseFloat(req.body.amt)) * -1
    AR.updateOne({ customer_id: req.body.customer_id }, { $push: { paymentDetails: req.body.paymentDetails }, $set: { updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate, recentCheck: req.body.recentCheck }, $inc: { Due: amt } }
        , function (err, ressult) {
            if (err) {
                logger.error('customer.js Line #141 /updateARInv' + err);
                res.json(err);
            } else {
                logger.info('customer.js Line #144 /updateARInv' + ressult);
                var invs = req.body.invDetails, response
                for (var i = 0; i < invs.length; i++) {
                    if (invs[i].ppaid) {
                        response = updateInvPP(invs[i].invs, invs[i].Paid, req, invs[i].Comment, 'P-Paid', invs[i].diff)
                    } else if (invs[i].adj) {
                        response = updateInvPP(invs[i].invs, invs[i].Paid, req, invs[i].Comment, 'Adjusted', invs[i].diff)
                    } else {
                        response = updateInvPaid(invs[i].invs, req)
                    }
                }
                var msg = 'posting check for ' + req.body.customer_id + 'for Invoices ' + req.body.invDetails
                logActivity(req.body.user, req.body.role, timestamp, 'Post Checks for invoices', msg)
                res.json({ msg: 'success' });
            }
        })
})

function updateInvPaid(invId, req) {
    invmodal.updateOne({ invId: invId },
        {
            $set: {
                status: 'Paid', updatedBy: req.body.updatedBy, updateDate: req.body.updatedDate,
                checkNo: req.body.paymentDetails.CheckNo
            }
        }, function (err, result) {
            if (err) {
                logger.error('customer.js Line #170 updateInvPaid()' + err);
            } else {
                logger.info('customer.js Line #172 updateInvPaid()' + result);
                ftb.updateOne({ invId: invId }, {
                    $set: {
                        status: 'Paid', updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate,
                        checkNo: req.body.paymentDetails.CheckNo
                    }
                }, function (err, ress) {
                    if (err) {
                        logger.error('customer.js Line #180 updateInvPaid()' + err);
                    } else {
                        logger.info('customer.js Line #182 updateInvPaid()' + ress);
                        AR.updateOne({ customer_id: req.body.customer_id }, { $pull: { invDetails: { invID: invId } } }, { multi: true }, function (err, ressult) {
                            if (err) {
                                logger.error('customer.js Line #185 updateInvPaid()' + err);
                                res.json(err);
                            } else {
                                logger.info('customer.js Line #188 updateInvPaid()' + ressult);
                                return 'success'
                            }
                        })
                    }

                })
            }

        })
}

function updateInvPP(invoiceId, amt, req, comment, reqStatus, diff) {
    invmodal.updateOne({ invId: invoiceId }, { $set: { status: reqStatus, updatedBy: req.body.updatedBy, updateDate: req.body.updatedDate, paid: amt, notes: comment, balance: diff } }, function (err, result) {
        if (err) {
            logger.error('customer.js Line #203 updateInvPP()' + err);
        } else {
            logger.info('customer.js Line #205 updateInvPP()' + result);
            AR.updateOne({ customer_id: req.body.customer_id }, { $set: { "invDetails.invTotal": amt } }, function (err, ressult) {
                if (err) {
                    logger.error('customer.js Line #208 updateInvPP()' + err);
                } else {
                    logger.info('customer.js Line #210 updateInvPP()' + ressult);
                    return 'success'
                }
            })
        }
    })
}

//  
router.post('/newARInvoice', (req, res, next) => {
    AR.updateOne({ customer_id: req.body.customer_id }, { $push: { invDetails: req.body.invDetails }, $set: { updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate }, $inc: { totalInv: 1, TotalRev: req.body.TotalRev, Due: req.body.TotalRev } }
        , function (err, ressult) {
            if (err) {
                logger.error('customer.js Line #223 /newARInvoice' + err);
                res.json(err);
            } else {
                var msg = 'Created New Invoice ' + req.body.customer_id + ' invoice ID ' + req.body.invDetails
                logActivity(req.body.user, req.body.role, timestamp, ' New Invoice ', msg)
                logger.info('customer.js Line #226 /newARInvoice' + ressult);
                res.json({ msg: 'success' });
            }
        })
})

router.post('/updateARTags', (req, res, next) => {
    var amt = parseFloat(req.body.amt) * -1, response
    AR.updateOne({ customer_id: req.body.customer_id }, { $push: { paymentDetails: req.body.paymentDetails }, $set: { updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate, recentCheck: req.body.recentCheck }, $inc: { Due: amt } }
        , function (err, ressult) {
            if (err) {
                logger.error('customer.js Line #237 /updateARTags' + err);
                res.json(err);
            } else {
                logger.info('customer.js Line #240 /updateARTags' + ressult);
                var tags = req.body.tagDetails
                for (var i = 0; i < tags.length; i++) {
                    if (tags[i].ppaid) {
                        response = updateTagPP(tags[i].tags, tags[i].Paid, req, tags[i].Comment, 'P-Paid', tags[i].diff)
                    } else if (tags[i].adj) {
                        response = updateTagPP(tags[i].tags, tags[i].Paid, req, tags[i].Comment, 'Adjusted', tags[i].diff)
                    } else {
                        response = updateTagPaid(tags[i].tags, req)
                    }
                }
                var msg = 'posting check for ' + req.body.customer_id + 'for Tags ' + req.body.tagDetails
                logActivity(req.body.user, req.body.role, timestamp, 'Post Checks for Tags', msg)
                res.json({ msg: 'success' });
            }
        })
})

function updateTagPaid(tagId, req) {
    ftb.updateOne({ Fright_Bill: tagId }, {
        $set: {
            status: 'Paid', updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate,
            checkNo: req.body.paymentDetails.CheckNo
        }
    }, function (err, ress) {
        if (err) {
            logger.error('customer.js Line #264 updateTagPaid()' + err);
        } else {
            logger.info('customer.js Line #266 updateTagPaid()' + ress);
        }

    })
}

function updateTagPP(tagId, amt, req, comment, reqStatus, diff) {
    ftb.updateOne({ Fright_Bill: tagId }, { $set: { status: reqStatus, updatedBy: req.body.updatedBy, updateDate: req.body.updatedDate, received: amt, notes: comment, balance: diff } }, function (err, result) {
        if (err) {
            logger.error('customer.js Line #275 updateTagPP()' + err);
        } else {
            logger.info('customer.js Line #277 updateTagPP()' + result);
        }
    })
}
function newJob(req) {
    let newJobs = new Jobs({
        customer_id: req.body.customer_id,
        customer_name: req.body.customer_name,
        job_id: 'Job-1',
        job_name: 'Job-1',
        job_type: 'hourly',
        status: 'running',
        job_location: req.body.customer_location,
        start_date: '',
    });
    newJobs.save((err, Driver) => {
        if (err) {
            logger.error('customer.js Line #38 /newjob' + err);
        } else {
            logger.info('customer.js Line #41 /newjob  ' + Driver);
        }
    })
}

router.post('/uniqCustId', (req, res, next) => {
    Customer.find({ customer_id: req.body.custId }, function (err, result) {
        if (err) {
            logger.error('customer.js Line #303 /uniqCustId' + err);
            res.json(err);
        } else {
            var resp = true
            logger.info('customer.js Line #306 /uniqCustId' + result);
            if (result.length > 0) {
                resp = 'false'
            }
            res.json(resp);
        }
    })
})

router.post('/deleteCheq', async (req, res, next) => {
    var a = parseFloat(req.body.amt)
    const [ARres, Inv, dec, FtBills] = await Promise.all([
        AR.updateOne({ customer_name: req.body.customer_name, paymentDetails: { $elemMatch: { CheckNo: req.body.checkNo } } },
            { $pull: { paymentDetails: { CheckNo: req.body.checkNo } } }, { $inc: { Due: a } }),
        invmodal.updateMany({ checkNo: req.body.checkNo, customer_name: req.body.customer_name },
            { $set: { status: 'Created', checkNo: '' } }),
        AR.updateOne({ customer_name: req.body.customer_name },
            { $inc: { Due: a } }),
        ftbill.updateMany({ checkNo: req.body.checkNo, customer_name: req.body.customer_name },
            { $set: { status: 'Entered', checkNo: '' } })
    ])
    res.json({ ar: ARres, Inv: Inv, Ftbill: FtBills, DecVal: dec });
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
module.exports = router;