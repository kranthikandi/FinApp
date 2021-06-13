const express = require('express');
const router = express.Router();
const invoice = require('../modals/invoiceModal')
const ftb = require('../modals/ftbill')
const AR = require('../modals/ARmodal')
const moment = require('../node_modules/moment')
const activity = require('../modals/activity')
const nodemailer = require("nodemailer");
const fileLoc = '/Users/kranthikumarkandi/docs'
var pdf = require('html-pdf');
var fs = require('fs');
var log4js = require('log4js');
var logger = log4js.getLogger(), timestamp = new Date()

router.get('/allInvs', (req, res, next) => {
    invoice.find(function (err, inv) {
        var msg = 'View All Invoices ' + req.body.id
        logActivity(req.body.user, req.body.role, timestamp, 'View All Invoices', msg)
        logger.info(' InvoiceRoute.js Line #12 /allInvs  ' + inv);
        res.json(inv);
    })
})

//reterving data
router.get('/maxInv', (req, res, next) => {
    const d = new Date()
    invoice.findOne({ InvDate: { '$lt': d } }).sort('-score').exec(function (err, result) {
        if (err) {
            logger.error('InvoiceRoute.js Line #22 /maxInv' + err);
            res.json(err);
        } else {
            logger.info(' InvoiceRoute.js Line #25 /maxInv  ' + result);
            res.json(result);
        }

    })
})


//new Invoice
router.post('/PreviewInv', (req, res, next) => {
    let newInvoice = new invoice({
        status: req.body.status,
        updatedBy: req.body.updatedBy,
        updateDate: req.body.updatedDate,
        InvDate: req.body.updatedDate,
        details: req.body.detail,
        Total: req.body.total,
        customer_id: req.body.cust_id,
        customer_name: req.body.cust_name,
        job_id: req.body.job_id,
        job_name: req.body.job_name,
        job_location: req.body.job_loc,
        job_type: req.body.job_type,
        totalTag: req.body.totalTag,
        qtytble: req.body.qty
    });
    newInvoice.save((err, inv) => {
        if (err) {
            logger.error('InvoiceRoute.js Line #54 /PreviewInv' + err);
            res.json({ msg: 'fail' });
        } else {
            logger.info(' InvoiceRoute.js Line #57 /PreviewInv  ' + inv);
            var id = inv._id
            id = id.toString().substr(22)
            id = parseInt(id, 16)
            var now = new Date(),
                invNum = moment(now).format('MMYY') + moment(now).week() + '-' + id,
                ft = req.body.ftb.split('||'),
                result = true
            for (var i = 0; i < ft.length; i++) {
                if (ft[i] == '') {
                } else {
                    ftb.updateOne({ Fright_Bill: ft[i] }, { $set: { status: 'Preview' } }, function (err, result) {
                        if (err) {
                            logger.error('InvoiceRoute.js Line #72 /PreviewInv' + err);
                            res.json({ msg: 'FTBills status not updated' });
                        } else {
                            logger.info(' InvoiceRoute.js Line #75 /PreviewInv  ' + result);
                        }
                    })
                }
            }
            var msg = 'Preview Invoice for Customer ' + req.body.cust_name
            logActivity(req.body.user, req.body.role, timestamp, 'Preview Invoice', msg)
            res.json({ msg: 'success', invRes: inv, ftbStat: result });
        }
    })
})

router.post('/jobInvoices', (req, res, next) => {
    invoice.find({ job_id: req.body.job_id }, function (err, result) {
        if (err) {
            logger.error('InvoiceRoute.js Line #88 /jobInvoices' + err);
            res.json(err);
        } else {
            logger.info(' InvoiceRoute.js Line #91 /jobInvoices  ' + result);
            res.json(result);
        }
    })
})

router.post('/invid', (req, res, next) => {
    invoice.find({ invId: req.body.invId }, function (err, result) {
        if (err) {
            logger.error('InvoiceRoute.js Line #100 /invid' + err);
            res.json(err);
        } else {
            logger.info(' InvoiceRoute.js Line #103 /invid  ' + result);
            res.json(result);
        }
    })
})

router.post('/invArch', (req, res, next) => {
    var qry = '', preview
    if (req.body.arch) {
        qry = { _id: req.body.invId }
        preview = true
    } else {
        qry = { invId: req.body.invId }
    }
    invoice.updateOne(qry, { $set: { status: 'Archived', updatedBy: req.body.updatedBy, updateDate: req.body.updatedDate } }, function (err, result) {

        if (err) {
            logger.error('InvoiceRoute.js Line #120 /invArch' + err);
            res.json({ mongoMsg: err, msg: 'failed' });
        } else {
            logger.info(' InvoiceRoute.js Line #123 /invArch  ' + result);
            if (!preview) {
                var totRev = req.body.TotalRev * -1
                AR.updateOne({ customer_id: req.body.custId }, { $pull: { invDetails: { invID: req.body.invId } }, $set: { updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate }, $inc: { totalInv: -1, TotalRev: totRev, Due: totRev } }, function (err, ressult) {
                    if (err) {
                        logger.error('InvoiceRoute.js Line #128 /invArch' + err);
                        invoice.updateOne({ invId: req.body.invId }, { $set: { status: 'Created', updatedBy: req.body.updatedBy, updateDate: req.body.updatedDate } }, function (err, result) {
                            if (err) {
                                logger.error('InvoiceRoute.js Line #31 /invArch' + err);
                                res.json({ mongoMsg: err, msg: 'failed' });
                            } else {
                                logger.info(' InvoiceRoute.js Line #134 /invArch  ' + result);
                            }
                        })
                    } else {
                        logger.info(' InvoiceRoute.js Line #138 /invArch  ' + ressult);
                    }
                })
                ftb.updateMany({ invId: req.body.invId }, { $set: { status: 'Entered', invId: '', invDate: '', updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate } }, function (err, ress) {
                    if (err) {
                        invoice.updateOne({ invId: req.body.invId }, { $set: { status: 'Created', updatedBy: req.body.updatedBy, updateDate: req.body.updatedDate } }, function (err, result) {
                            if (err) {
                                logger.error('InvoiceRoute.js Line #146 /invArch' + err);
                                res.json({ mongoMsg: err, msg: 'failed' });
                            } else {
                                logger.info(' InvoiceRoute.js Line #149 /invArch  ' + result);
                            }
                        })
                    } else {
                        logger.info(' InvoiceRoute.js Line #153 /invArch  ' + ress);
                    }
                })
            } else {
                for (var i = 0; i < req.body.ftb.length; i++) {
                    ftb.updateOne({ Fright_Bill: req.body.ftb[i] }, { $set: { status: 'Entered', invId: '', invDate: '', updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate } }, function (err, ress) {
                        if (err) {
                            invoice.updateOne({ invId: req.body.invId }, { $set: { status: 'Created', updatedBy: req.body.updatedBy, updateDate: req.body.updatedDate } }, function (err, result) {
                                if (err) {
                                    logger.error('InvoiceRoute.js Line #163 /invArch' + err);
                                    res.json({ mongoMsg: err, msg: 'failed' });
                                } else {
                                    logger.info(' InvoiceRoute.js Line #166 /invArch  ' + result);
                                }
                            })
                        } else {
                            logger.info(' InvoiceRoute.js Line #170 /invArch  ' + ress);
                        }
                    })
                }
            }
            var msg = ' Archieve Invoice ' + req.body.invId
            logActivity(req.body.user, req.body.role, timestamp, 'Archieve Invoice', msg)
            res.json({ msg: 'success' });
        }
    })
})

router.post('/thisInv', (req, res, next) => {
    var error = false
    invoice.updateOne({ _id: req.body.fullId }, { $set: { status: 'Created', updatedBy: req.body.updatedBy, updateDate: req.body.updatedDate, invId: req.body.invId, InvDate: req.body.invDate } }, function (err, result) {
        if (err) {
            logger.error('InvoiceRoute.js Line #185 /thisInv' + err);
            res.json({ mongoMsg: err, msg: 'failed' });
        } else {
            logger.info(' InvoiceRoute.js Line #204 /thisInv  ' + result);
            for (var i = 0; i < Object.keys(req.body.allFtb).length; i++) {
                ftb.updateOne({ Fright_Bill: req.body.allFtb[i].ftb }, { $set: { status: 'Invoiced', invId: req.body.invId, invDate: req.body.invDate, updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate } }, function (err, result) {
                    if (err) {
                        logger.error('InvoiceRoute.js Line #191 /thisInv' + err);
                        error = true
                    } else {
                        logger.info(' InvoiceRoute.js Line #194 /thisInv  ' + result);
                        error = false
                    }
                })
            }
            AR.updateOne({ customer_id: req.body.customer_id }, { $push: { invDetails: { invID: req.body.invId, invTotal: req.body.totalRev, invDate: req.body.invDate } }, $set: { updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate }, $inc: { totalInv: 1, TotalRev: req.body.totalRev, Due: req.body.totalRev } }, function (err, ressult) {
                if (err) {
                    logger.error('InvoiceRoute.js Line #201 /thisInv' + err);
                    error = true
                } else {
                    logger.info(' InvoiceRoute.js Line #204 /thisInv  ' + ressult);
                    error = false
                }
            })
            if (error) {
                res.json({ msg: 'all ftbs are not updated' });
            } else {
                var msg = ' Create Invoice ' + req.body.fullId
                logActivity(req.body.user, req.body.role, timestamp, 'Create Invoice', msg)
                res.json({ msg: 'success' });
            }
            /* ftb.where({ invId: req.body.invId }).updateMany({ $set: { status: 'Invoiced', invDate: req.body.invDate, updatedBy: req.body.updatedBy, updatedDate: req.body.updatedDate } }, function (err, ress) {
                if (err) {
                    console.log("error for / -- " + err)
                    invoice.updateOne({ invId: req.body.invId }, { $set: { status: 'Preview', updatedBy: req.body.updatedBy, updateDate: req.body.updatedDate, invId: '', InvDate: '' } }, function (err, result) {
                        if (err) {
                            res.json({ mongoMsg: err, msg: 'failed' });
                        } else {
                            console.log(result)
                            res.json({ msg: 'unable to update the FTbills' });
                        }
                    })
                } else {
                    console.log('++++thisInv  175')
                    console.log(ress)
                    res.json({ msg: 'success' });
                }
            }) */
        }
    })
})

router.post('/getCustInv', (req, res, next) => {
    invoice.find({ customer_id: req.body.custId }, function (err, result) {
        if (err) {
            logger.error('InvoiceRoute.js Line #237 /getCustInv' + err);
            res.json(err);
        } else {
            var msg = ' get Customer Invoice ' + req.body.fullId
            logActivity(req.body.user, req.body.role, timestamp, 'View Customer Invoice', msg)
            logger.info(' InvoiceRoute.js Line #240 /getCustInv  ' + result);
            res.json(result);
        }
    })
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

router.post('/emailInv', async (req, res, next) => {
    let b, options = { format: 'Letter' };
    pdf.create(req.body.eBody, options).toFile('./businesscard.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.us-west-2.awsapps.com',
        port: 465,
        secure: true,
        ssl: true, // upgrade later with STARTTLS
        auth: {
            user: "noreply@meegatrucnz.com",
            pass: "History@12"
        }
    })
    //var body = 'test invoice '
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Meega Trucking Software" <noreply@meegatrucnz.com>', // sender address
        cc: '"Meega Trucking "<meegatruckings@gmail.com>, ',//sandeep_mann@live.com
        to: req.body.email, // list of receivers
        subject: 'Invoice From Sunny Trucking Inc.', // Subject line
        html: req.body.eBody,
        /* attachments: {   // binary buffer as an attachment
            filename: req.body.fileName,
            // content: new Buffer(b, 'utf-8')
        }, */
    })
    res.json(info);
})

module.exports = router;
