const express = require('express');
const router = express.Router();
const dispatch = require('../modals/dispatch')
var log4js = require('log4js');
const bill = require('../modals/ftbill')
const activity = require('../modals/activity')
const ICDriver = require('../modals/ICdriver')
const accountSid = 'ACca12430647230407d512c639bf87853c';
const authToken = 'ca5991007bbe3a4db5ecbadb0ac35fd5';
const nodemailer = require("nodemailer");
const user = require('../modals/user')
const emp = require('../modals/employee')
const msg = require('../modals/messages')
const email = require('../modals/emails');
const client = require('twilio')(accountSid, authToken);
const moment = require('moment')
var logger = log4js.getLogger(), timestamp = new Date()

router.post('/newdispatch', (req, res) => {
    let newDispatch = new bill({
        customer_id: req.body.custId,
        customer_name: req.body.custName,
        job_id: req.body.jobId,
        job_name: req.body.jobName,
        job_location: req.body.jobLoc,
        job_type: req.body.jobType,
        status: req.body.status,
        notes: req.body.notes,
        date: req.body.DispDate,
        Fright_bill: req.body.Fright_Bill,
        Truck_id: req.body.Truck,
        Driver: req.body.Driver,
        material: req.body.dispMaterial,
        Time: req.body.Time,
        Rate: req.body.Rate,
        Truck_Type: req.body.Truck_Type,
        LocA: req.body.locA,
        LocB: req.body.locB,
        billRate: req.body.billRate,
        updated_by: req.body.updatedBy,
        updated_date: req.body.updatedDate
    });
    newDispatch.save((err, Driver) => {
        if (err) {
            logger.error('dispatch.js Line #31 /newdispatch' + err);
            res.json({ msg: 'fail' });
        } else {
            CreateTagID(req.body.Driver, Driver)
            sendSMS(req)
            var msg = 'Added new dispatch for ' + req.body.custName +
                ' for ' + req.body.DispDate + ' Driver ' + req.body.Driver
            logActivity(req.body.user, req.body.role, timestamp, 'New Dispatch', msg)
            logger.info(' dispatch.js Line #34 /newdispatch' + Driver);
            res.json({ msg: 'success' });
        }
    })
})

router.post('/newCustdispatch', (req, res) => {
    var time = req.body.Time, resp = ''
    for (var i = 0; i < time.length; i++) {
        let newDispatch = new bill({
            customer_id: req.body.custId,
            customer_name: req.body.custName,
            job_id: req.body.jobId,
            job_name: req.body.jobName,
            job_location: req.body.jobLoc,
            job_type: req.body.jobType,
            status: req.body.status,
            notes: req.body.notes,
            date: req.body.DispDate,
            Fright_bill: req.body.Fright_Bill,
            Truck_id: req.body.Truck,
            Driver: req.body.Driver,
            material: req.body.dispMaterial,
            Time: time[i],
            Rate: req.body.Rate,
            Truck_Type: req.body.Truck_Type,
            LocA: req.body.locA,
            LocB: req.body.locB,
            billRate: req.body.billRate,
            updated_by: req.body.updatedBy,
            updated_date: req.body.updatedDate
        });
        newDispatch.save((err) => {
            if (err) {
                logger.error('dispatch.js Line #66 /newCustdispatch' + err);
                resp = 'false'
            } else {
                if (req.body.Driver) {
                    sendSMS(req)
                }
                var msg = 'Added new dispatch for ' + req.body.custName +
                    ' for ' + req.body.DispDate + ' Driver ' + req.body.Driver
                logActivity(req.body.user, req.body.role, timestamp, 'New Dispatch', msg)
                logger.info(' dispatch.js Line #69 /newCustdispatch');
                resp = 'true'
            }
        })
    }
    if (resp == 'true') {
        logger.info(' dispatch.js Line #75 /newCustdispatch  ');
        res.json({ msg: 'success' })
    } else {
        logger.error('dispatch.js Line #78 /newCustdispatch');
        res.json({ msg: 'fail' })
    }
})



//get waiting dispatch info 
router.post('/dispatchW', (req, res) => {
    bill.find({ job_id: req.body.job_id, customer_name: req.body.customer_name, date: req.body.dispDate }, function (err, result) {
        if (err) {
            logger.error('dispatch.js Line #89 /dispatchW' + err);
            res.json(err);
        } else {
            var msg = 'Viewed dispatch for ' + req.body.job_id +
                ' for ' + req.body.dispDate
            logActivity(req.body.user, req.body.role, timestamp, 'View Dispatch', msg)
            logger.info(' dispatch.js Line #92 /dispatchW  ' + result);
            res.json(result);
        }
    })
})
//, 
router.post('/UpdateManyDispatch', (req, res) => {
    var dat = req.body, error
    for (var i = 0; i < dat.length; i++) {
        bill.updateOne({ job_id: req.body[i].job_id, DispDate: req.body[i].DispDate, Time: req.body[i].Time }, { $set: { Driver: req.body[i].Driver, Truck_id: req.body[i].Truck_id, status: req.body[i].status, notes: req.body[i].notes } }, function (err, result) {
            if (err) {
                logger.error('dispatch.js Line #103 /UpdateManyDispatch' + err);
                error = true
            } else {
                logger.info(' dispatch.js Line #106 /UpdateManyDispatch  ' + result);
            }
        })
    }
    if (error) {
        logger.info(' dispatch.js Line #107 /signup  ' + successMesg);
        res.json({ ok: 0 });
    } else {
        logger.error('dispatch.js Line #114 /customers' + result);
        res.json({ ok: 1 });
    }



})

//get waiting dispatch info 
router.get('/CurrDispatchW', (req, res) => {
    bill.find({ status: "wait" }, function (err, result) {
        if (err) {
            logger.error('dispatch.js Line #126 /CurrDispatchW' + err);
            res.json(err);
        } else {
            logger.info(' dispatch.js Line #129 /CurrDispatchW  ' + result);
            res.json(result);
        }
    })
})

router.post('/dispid', (req, res) => {
    bill.find({ job_id: req.body.jId }, { '_id': 1, 'job_id': 1 }, function (err, result) {
        if (err) {
            logger.error('dispatch.js Line #138 /dispid' + err);
            res.json(err);
        } else {
            logger.info(' dispatch.js Line #141 /dispid  ' + result);
            res.json(result);
        }
    })
})

//add FBill and status update
router.post('/dispUpdate', (req, res) => {
    bill.updateOne({ _id: req.body.id }, { $set: { status: req.body.status, Fright_Bill: req.body.Fbill, notes: req.body.notes, Driver: req.body.driver, Truck_id: req.body.truck_id } }, function (err, result) {
        if (err) {
            logger.error('dispatch.js Line #151 /dispUpdate' + err);
            res.json(err);
        } else {
            sendSMS(req)
            CreateTagID(req.body.driver, req)
            var msg = 'Updated dispatch for ' + req.body.job_id +
                ' for ' + req.body.dispDate + ' for Driver ' + req.body.driver
            logActivity(req.body.user, req.body.role, timestamp, 'Update Dispatch', msg)
            logger.info(' dispatch.js Line #154 /dispUpdate  ' + result);
            res.json(result);
        }
    })
})

//add FBill and status update
router.post('/cdispUpdate', (req, res) => {
    bill.updateOne({ _id: req.body.id }, { $set: { status: 'Assigned', Driver: req.body.driver, driver_id: req.body.driver_id } }, function (err, result) {
        if (err) {
            logger.error('dispatch.js Line #164 /cdispUpdate' + err);
            res.json(err);
        } else {
            CreateTagID(req.body.driver, req)
            sendSMS(req)
            var msg = 'Updated dispatch for ' + req.body.id + ' for Driver ' + req.body.driver
            logActivity(req.body.user, req.body.role, timestamp, 'Update Dispatch', msg)
            logger.info(' dispatch.js Line #167 /cdispUpdate  ' + result);
            res.json(result);
        }
    })
})

//get waiting dispatch info 
router.post('/getDispatch', async (req, res) => {
    var dateStr = req.body.date + 'T08:00:00.000Z',
        dateStr2 = req.body.date + 'T00:00:00.000Z',
        dateStr3 = req.body.date + 'T07:00:00.000Z'
    //new Date(req.body.date)
    const skip = (req.body.page - 1) * 20
    try {
        const [results, itemCount] = await Promise.all([
            bill.find({ '$or': [{ date: dateStr }, { date: dateStr2 }, { date: dateStr3 }] })
                .limit(20)
                .skip(skip),
            bill.countDocuments({ date: req.body.date })
        ])
        res.json({
            count: itemCount,
            pcount: pageCount,
            result: results
        })
        var msg = 'View dispatch for ' + req.body.date
        logActivity(req.body.user, req.body.role, timestamp, 'View Dispatch', msg)
        logger.info(' dispatch.js Line #180 /getDispatch  ' + result);
        const pageCount = Math.ceil(itemCount / 20);
        //res.json(result);
    } catch (err) {
    }

})

router.post('/jobDateDisp', (req, res) => {
    bill.find({ date: req.body.dispDte, job_id: req.body.jobid }, function (err, result) {
        if (err) {
            logger.error('dispatch.js Line #189 /jobDateDisp' + err);
            res.json(err);
        } else {
            var msg = 'View dispatch for ' + req.body.dispDte + ' for Job ' + req.body.jobid
            logActivity(req.body.user, req.body.role, timestamp, 'View Dispatch', msg)
            logger.info(' dispatch.js Line #192 /jobDateDisp  ' + result);
            res.json(result);
        }
    })
})

router.post('/updateDispStat', (req, res) => {
    bill.updateOne({ job_id: req.body.jid, job_type: req.body.jtype, Truck_Type: req.body.jtt, Time: req.body.jtime, Driver: req.body.dri, Truck_id: req.body.truId }, { $set: { status: req.body.dstatus, notes: req.body.dnotes } }, function (err, result) {
        if (err) {
            logger.error('dispatch.js Line #201 /updateDispStat' + err);
            res.json(err);
        } else {
            var msg = 'Updated dispatch for ' + req.body.jobid + ' Driver ' + req.body.dri
            logActivity(req.body.user, req.body.role, timestamp, 'Update Dispatch', msg)
            logger.info(' dispatch.js Line #204 /updateDispStat  ' + result);
            res.json(result);
        }
    })
})
//delete contact
router.post('/dispDelete', async (req, res) => {
    if (req.body.freight_bill) {
        const [disp, Freight] = await Promise.all([
            dispatch.deleteOne({ _id: req.body.id }),
            bill.deleteOne({ Fright_Bill: req.body.freight_bill })
        ])
        res.json({ dispatch: disp, bill: Freight });
        var msg = 'Deleted dispatch  for ' + req.body.id + " and Freight Bill for " + req.body.freight_bill
        logActivity(req.body.user, req.body.role, timestamp, 'Delete Dispatch', msg)
        logger.info(' dispatch.js Line #216 /dispDelete  ' + result);
    } else {
        bill.deleteOne({ _id: req.body.id }, function (err, disp) {
            if (err) {
                logger.error('dispatch.js Line #213 /dispDelete' + err);
                res.json(err);
            } else {
                var msg = 'Deleted dispatch for ' + req.body.id
                logActivity(req.body.user, req.body.role, timestamp, 'Delete Dispatch', msg)
                logger.info(' dispatch.js Line #216 /dispDelete  ' + disp);
                res.json({ dispatch: disp });
            }
        })
    }

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

function sendSMS(req) {
    var Driver = req.body.driver || req.body.Driver
    if (req.body.DispDate == undefined) {
        bill.findOne({ _id: req.body.id }, function (err, bill) {
            req.body = bill
        })
    }

    if (Driver || req.body.DispDate || req.body.jobLoc || req.body.Time || req.body.Truck_Type || req.body.Rate) {
        ICDriver.findOne({ ICdriver_name: Driver }, function (err, Drivers) {
            if (Drivers == null) {
                emp.findOne({ empName: Driver }, function (err, empDrivers) {
                    empDriverNotification(empDrivers, req)
                })
            } else {
                DriverNotification(Drivers, req)
            }
        })
    } else {
    }
}

function DriverNotification(Drivers, req) {
    var msgs = '', body = ''
    if (req.body.DispDate == undefined) {
        msgs = 'New Dispatch! you have a dispatch on ' + moment(req.body.date).format('MM/DD/YYYY') + ' '
            + req.body.Time + ' for the job location ' + req.body.job_location
        body = 'Hi ' + req.body.Driver + ',<br><br> New Dispatch! you have a dispatch on <strong> ' + req.body.date + '  '
            + req.body.Time + ' </strong> for the job location <strong>' + req.body.job_location + ' </strong>  '
    } else {
        msgs = 'New Dispatch! you have a dispatch on ' + req.body.DispDate + ' '
            + req.body.Time + ' for the job location ' + req.body.jobLoc
        body = 'Hi ' + req.body.Driver + ',<br><br> New Dispatch! you have a dispatch on <strong> ' + req.body.DispDate + '  '
            + req.body.Time + ' </strong> for the job location <strong>' + req.body.jobLoc + ' </strong>  '
    }
    if (req.body.locA) {
        body = body + '  from  <strong> ' + req.body.locA + ' </strong>  '
        msgs = msgs + '  from ' + req.body.locA + ' '
    }
    if (req.body.locB) {
        msgs = msgs + ' to ' + req.body.locB + '. '
        body = body + ' to  <strong> ' + req.body.locB + ',</strong> '
    } else {
        msgs = msgs + '. '
        body = body + '<strong>. </strong> '
    }
    if (req.body.notes != undefined) {
        if (req.body.notes.length > 0) {
            msgs = msgs + ' Truck Type : ' + req.body.Truck_Type + ', Rate - $' + req.body.Rate + ', Note: ' + req.body.notes[0].msg
        }
    } else {
        msgs = msgs + ' Truck Type : ' + req.body.Truck_Type + ', Rate - $' + req.body.Rate + ', Note: -'
    }

    body = body + ' Truck Type : <strong> ' + req.body.Truck_Type +
        '.</strong> Rate - <strong>$' + req.body.Rate + '.<br></strong> Note: <strong>' + req.body.notes + '</strong>' +
        '<br><br><br> Best,<br>Sunny Trucking Inc.<br>Ph: (510)715-8262<br> Email: sandeep_mann@live.com' +
        '<br><br><br><br><br><br> This is an autogenerated email by Meega Trucking Software.<br> Please <strong>DO NOT REPLY</strong> and Contact your dispatcher/broker for more information on this dispatch'
    saveMsg(msgs, Drivers, req)
    if (Drivers.phone) {
        client.messages.create({
            body: msgs,
            to: Drivers.phone,  // Text this number
            from: '+16692134888' // From a valid Twilio number
        })
            .then((message) => console.log(message.status));
    }
    saveEmail(body, Drivers.email, Drivers.email || '')
    if (Drivers.email) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.us-west-2.awsapps.com',
            port: 465,
            secure: true,
            ssl: true, // upgrade later with STARTTLS
            auth: {
                user: "noreply@meegatrucnz.com",
                pass: "History@12"
            }
        });
        // send mail with defined transport object
        let info = transporter.sendMail({
            from: '"Meega Trucking Software" <noreply@meegatrucnz.com>', // sender address
            cc: '"Meega Trucking "<meegatruckings@gmail.com>', //"Sunny Trucking"<sandeep_mann@live.com>'
            to: Drivers.email, // list of receivers
            subject: 'Dispatch From Sunny Trucking Inc.', // Subject line
            html: body,
        });
    }
}

function empDriverNotification(Drivers, req) {
    var msgs = '', body = ''
    if (req.body.DispDate == undefined) {
        msgs = 'New Dispatch! you have a dispatch on ' + moment(req.body.date).format('MM/DD/YYYY') + ' '
            + req.body.Time + ' for the job location ' + req.body.job_location
        body = 'Hi ' + req.body.Driver + ',<br><br> New Dispatch! you have a dispatch on <strong> ' + req.body.date + '  '
            + req.body.Time + ' </strong> for the job location <strong>' + req.body.job_location + ' </strong>  '
    } else {
        msgs = 'New Dispatch! you have a dispatch on ' + req.body.DispDate + ' '
            + req.body.Time + ' for the job location ' + req.body.jobLoc
        body = 'Hi ' + req.body.Driver + ',<br><br> New Dispatch! you have a dispatch on <strong> ' + req.body.DispDate + '  '
            + req.body.Time + ' </strong> for the job location <strong>' + req.body.jobLoc + ' </strong>  '
    }
    if (req.body.locA) {
        body = body + '  from  <strong> ' + req.body.locA + ' </strong>  '
        msgs = msgs + '  from ' + req.body.locA + ' '
    }
    if (req.body.locB) {
        msgs = msgs + ' to ' + req.body.locB + '. '
        body = body + ' to  <strong> ' + req.body.locB + ',</strong> '
    } else {
        msgs = msgs + '. '
        body = body + '<strong>. </strong> '
    }
    if (req.body.notes.length > 0) {
        msgs = msgs + ' Truck Type : ' + req.body.Truck_Type + ', Rate - $' + req.body.Rate + ', Note: ' + req.body.notes[0].msg
    } else {
        msgs = msgs + ' Truck Type : ' + req.body.Truck_Type + ', Rate - $' + req.body.Rate + ', Note: -'
    }
    body = body + ' Truck Type : <strong> ' + req.body.Truck_Type +
        '.</strong> Rate - <strong>$' + req.body.Rate + '.<br></strong> Note: <strong>' + req.body.notes + '</strong>' +
        '<br><br><br> Best,<br>Sunny Trucking Inc.<br>Ph: (510)715-8262<br> Email: sandeep_mann@live.com' +
        '<br><br><br><br><br><br> This is an autogenerated email by Meega Trucking Software.<br> Please <strong>DO NOT REPLY</strong> and Contact your dispatcher/broker for more information on this dispatch'
    saveEmpDriverMsg(msgs, Drivers, req)
    if (Drivers.empPhone) {
        /*  client.messages.create({
             body: msgs,
             to: Drivers.empPhone,  // Text this number
             from: '+16692134888' // From a valid Twilio number
         })
             .then((message) => console.log(message.status)); */
    }
    saveEmail(body, Drivers.empEmail, Drivers.empEmail || '')
    if (Drivers.empEmail) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.us-west-2.awsapps.com',
            port: 465,
            secure: true,
            ssl: true, // upgrade later with STARTTLS
            auth: {
                user: "noreply@meegatrucnz.com",
                pass: "History@12"
            }
        });
        // send mail with defined transport object
        let info = transporter.sendMail({
            from: '"Meega Trucking Software" <noreply@meegatrucnz.com>', // sender address
            cc: '"Meega Trucking "<meegatruckings@gmail.com>', //"Sunny Trucking"<sandeep_mann@live.com>'
            to: Drivers.empEmail, // list of receivers
            subject: 'Dispatch From Sunny Trucking Inc.', // Subject line
            html: body,
        });
    }
}
function saveMsg(msgs, Drivers, req) {
    var stat = 'Delivered'
    if (!Drivers.phone || Drivers.phone == '') {
        stat = 'ND'
    }
    let newMsg = new msg({
        to: Drivers.ICdriver_id,
        from: req.body.user,
        fromRole: req.body.role,
        body: msgs,
        timestamp: new Date(),
        status: stat,
        type: 'Dispatch'
    });
    newMsg.save((err, Driver) => {
        if (err) {
            logger.error('dispatch.js Line #31 /newdispatch' + err);
        } else {
            user.findOne({ drId: Drivers.ICdriver_id }, function (err, user) {
                console.log(user)
                var message = {
                    app_id: "2aae6d0a-f0bc-4708-8e6c-6524928f9ef3",
                    contents: { "en": msgs },
                    include_player_ids: [user.userToken] //["d1398dc3-ac86-47c2-95db-f92c16e41136"] userToken
                };
                console.log(message)
                sendNotification(message);
            })
        }
    })
}
function saveEmpDriverMsg(msgs, Drivers, req) {
    var stat = 'Delivered'
    if (!Drivers.empPhone || Drivers.empPhone == '') {
        stat = 'ND'
    }
    let newMsg = new msg({
        to: Drivers.empId,
        from: req.body.user,
        fromRole: req.body.role,
        body: msgs,
        timestamp: new Date(),
        status: stat,
        type: 'Dispatch'
    });
    newMsg.save((err, Driver) => {
        if (err) {
            logger.error('dispatch.js Line #31 /newdispatch' + err);
        } else {
            user.findOne({ drId: Drivers.empId }, function (err, user) {
                var message = {
                    app_id: "2aae6d0a-f0bc-4708-8e6c-6524928f9ef3",
                    contents: { "en": msgs },
                    include_player_ids: [user.userToken] //["d1398dc3-ac86-47c2-95db-f92c16e41136"] userToken
                };
                sendNotification(message);
            })
        }
    })
}
function saveEmail(body, Driver, mail) {
    var stat = 'Delivered'
    if (!mail || mail == '') {
        stat = 'ND'
    }
    let newEmail = new email({
        to: Driver,
        body: body,
        timestamp: new Date(),
        status: stat,
        type: 'Dispatch'
    });
    newEmail.save((err, Driver) => {
        if (err) {
            logger.error('dispatch.js Line #31 /newdispatch' + err);
        } else {
        }
    })
}

//create Tag for accepted Dispatch
router.post('/creatTagId', async (req, res) => {
    const dispatchId = parseInt(req.body.dispatchId.substr(req.body.dispatchId.length - 3), 16)
    const dispDate = req.body.dispDate.split('/')
    var TagId = dispDate[0] + dispDate[1] + dispatchId
    var oldTagID, stat
    await bill.findOne({ Fright_Bill: TagId }, { '_id': 0, 'Fright_Bill': 1 }, function (err, ftb) {
        if (!err) {
            oldTagID = ftb
        }
    })
    if (oldTagID != null && (oldTagID.Fright_Bill != '' || oldTagID.Fright_Bill != undefined)) {
        TagId = dispDate[0] + dispDate[1] + parseInt(req.body.dispatchId.substr(req.body.dispatchId.length - 5), 16)
    }
    bill.updateOne({ _id: req.body.dispatchId }, { $set: { Fright_Bill: TagId } }, function (err, result) {
        if (!err) {
            res.json({ tagId: TagId });
        }
    })
})

//find if company Driver to create TagId
function CreateTagID(Driver, dispDetials) {
    var dispatchId = dispDetials._id || dispDetials.body.id,
        dispDate = dispDetials.date || dispDetials.body.date || dispDetials.body.dispDate,
        dID = dispatchId.toString()
    dID = parseInt(dID.substr(dID.length - 3), 16)
    var dispDate = moment(dispDate, 'MM/DD/YYYY').format("MM/DD/YYYY").toString()
    dispDate = dispDate.split('/')
    var TagId = dispDate[0] + dispDate[1] + dID
    emp.findOne({ empName: Driver, Role: 'Driver' }, function (err, empDriver) {
        if (!err && empDriver != null) {
            bill.updateOne({ _id: dispatchId }, {
                $set: { Fright_Bill: TagId, status: 'Assigned' }
            }, function (err, res) {
                if (!err) {
                    return true
                }
            })
        }
    })
    return false
}

var sendNotification = function (data) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8"
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    var https = require('https');
    var req = https.request(options, function (res) {
        res.on('data', function (data) {
        });
    });

    req.on('error', function (e) {
    });

    req.write(JSON.stringify(data));
    req.end();
};
module.exports = router;