const express = require('express');
const { UserInstance } = require('twilio/lib/rest/chat/v1/service/user');
const router = express.Router();
const contact = require('../modals/contactModal')
const ftb = require('../modals/ftbill')
const user = require('../modals/user');
const notif = require('../modals/notification')
const constants = require('../routes/constants')
const moment = require('moment')
const multer = require('multer')
const fs = require('fs')
const accountSid = 'ACca12430647230407d512c639bf87853c';
const authToken = 'ca5991007bbe3a4db5ecbadb0ac35fd5';
const client = require('twilio')(accountSid, authToken);
const { route } = require('./dispatch');
var log4js = require('log4js');
var logger = log4js.getLogger()

router.post('/appFeedback', (req, res, next) => {
    let UserFeedback = new contact({
        Time: req.body.time,
        Name: req.body.userName,
        Email: req.body.email,
        Message: req.body.msg,
    });
    UserFeedback.save((err, successMesg) => {
        if (err) {

        } else {
            res.json('success');
        }
    })
})

router.post('/ICDDispatch', (req, res, next) => {
    if (req.body.isTruck) {
        ftb.find({
            Driver: req.body.driver_name, Truck_id: req.body.truckId, date: req.body.date,
            '$or': [{ status: 'Assigned' }, { status: 'draft' }]
        },
            function (err, result) {
                if (err) {
                    res.json(err);
                } else {
                    var disp = []
                    if (result.length > 0) {
                        for (let i = 0; i <= result.length - 1; i++) {
                            var date = {
                                Date: moment(result[i].date).format('MM/DD/YYYY')
                            }
                            var response = Object.assign({}, result[i], date)
                            var dispatch = {
                                notes: response._doc.notes,
                                tripDetails: response._doc.tripDetails,
                                routeDetails: response._doc.routeDetails,
                                locDetails: response._doc.locDetails,
                                _id: response._doc._id,
                                customer_id: response._doc.customer_id,
                                customer_name: response._doc.customer_name,
                                job_id: response._doc.job_id,
                                job_name: response._doc.job_name,
                                job_location: response._doc.job_location,
                                job_type: response._doc.job_type,
                                status: response._doc.status,
                                date: response.Date,
                                material: response._doc.material,
                                Time: response._doc.Time,
                                Rate: response._doc.Rate,
                                Truck_Type: response._doc.Truck_Type,
                                Truck_id: response._doc.Truck_id,
                                LocA: response._doc.LocA,
                                LocB: response._doc.LocB,
                                Driver: response._doc.Driver,
                                driver_id: response._doc.driver_id,
                                Fright_Bill: response._doc.Fright_Bill
                            }
                            disp.push(dispatch)
                        }
                    }
                    res.json(result);
                }
            })
    } else {
        ftb.find({ Driver: req.body.driver_name, date: req.body.date, '$or': [{ status: 'Assigned' }, { status: 'Accepted' }, { status: 'draft' }] }, function (err, result) {
            if (err) {
                res.json(err);
            } else {
                var disp = []
                if (result.length > 0) {
                    for (let i = 0; i <= result.length - 1; i++) {
                        var date = {
                            Date: moment(result[i].date).format('MM/DD/YYYY')
                        }
                        var response = Object.assign({}, result[i], date)
                        var dispatch = {
                            notes: response._doc.notes,
                            tripDetails: response._doc.tripDetails,
                            routeDetails: response._doc.routeDetails,
                            locDetails: response._doc.locDetails,
                            _id: response._doc._id,
                            customer_id: response._doc.customer_id,
                            customer_name: response._doc.customer_name,
                            job_id: response._doc.job_id,
                            job_name: response._doc.job_name,
                            job_location: response._doc.job_location,
                            job_type: response._doc.job_type,
                            status: response._doc.status,
                            date: response.Date,
                            material: response._doc.material,
                            Time: response._doc.Time,
                            Rate: response._doc.Rate,
                            Truck_Type: response._doc.Truck_Type,
                            Truck_id: response._doc.Truck_id,
                            LocA: response._doc.LocA,
                            LocB: response._doc.LocB,
                            Driver: response._doc.Driver,
                            driver_id: response._doc.driver_id,
                            Fright_Bill: response._doc.Fright_Bill
                        }
                        disp.push(dispatch)
                    }
                }
                res.json(disp);
            }
        })
    }
})

router.post('/createTid', async (req, res, next) => {
    var truck = req.body.truckId
    const driName = req.body.driver_name.split(' ');
    var name = '', company = '@demo'
    for (var i = 0; i < driName.length; i++) {
        var temp = driName[i];
        name = name + temp.charAt(0);
    }
    const userName = name + '_' + truck + company
    var pin = Math.floor(Math.random() * Math.floor(9999))
    const [results, itemCount] = await Promise.all([
        user.findOne({ name: req.body.driver_name, user_name: name + '_' + truck }, function (err, users) {
            if (err) {
                res.json(err);
            } else {
                if (users == null) {
                    user.findOne({ name: req.body.driver_name, isBroker: true }, function (err, users) {
                        let newuser = new user({
                            user_name: name + '_' + truck,
                            drId: users.drId + '-' + truck,
                            name: req.body.driver_name,
                            status: 'Active',
                            truckId: truck,
                            password: pin,
                            role: 'Driver',
                            isBroker: false,
                            isTruck: true
                        });
                        newuser.save((err, users) => {
                            if (err) {
                                logger.error('user.js Line #79 /signup' + err);
                            } else {
                                var details = {
                                    empAccess: [],
                                    _id: users._id,
                                    user_name: userName,
                                    name: users.name,
                                    drId: users.drId,
                                    status: users.status,
                                    truckId: users.truckId,
                                    password: users.password,
                                    role: users.role,
                                    isBroker: users.isBroker,
                                    isTruck: users.isTruck,
                                }
                                res.json(details);
                            }
                        })
                    })
                } else {
                    var details = {
                        empAccess: [],
                        _id: users._id,
                        user_name: userName,
                        name: users.name,
                        drId: users.drId,
                        status: users.status,
                        truckId: users.truckId,
                        password: users.password,
                        role: users.role,
                        isBroker: users.isBroker,
                        isTruck: users.isTruck,
                    }
                    res.json(details);
                }
            }
        }),
        ftb.updateOne({ Fright_Bill: req.body.tagId }, { $set: { Truck_id: req.body.truckId, status: 'Assigned' } })
    ])
})

router.post('/shardDetails', (req, res, next) => {
    var msg = 'Login Details!! please downlod the app and login with username: ' + req.body.username + ' and pin ' + req.body.password
    client.messages.create({
        body: msg,
        to: req.body.phone,  // Text this number
        from: '+16692134888' // From a valid Twilio number
    })
        .then((message) => console.log(message.status));
    res.json('success');
})

router.post('/ftbStartTrip', (req, res, next) => {
    var trips = [], tripNo = -1
    ftb.findOne({ Fright_Bill: req.body.tagId }, { _id: 0, tripDetails: 1 }, function (err, trip) {
        if (trip != null && !err) {
            trips = trip.tripDetails
            if (trip.tripDetails.length > 0) {
                tripNo = trip.tripDetails.length
            }
            console.log(trips, tripNo, req.body.tripNo)
            if (trips.length > 0) {
                console.log(trips[tripNo - 1].endTime)
                if (trips.length == (req.body.tripNo - 1) && trips[tripNo - 1].endTime != undefined) {
                    ftb.updateOne({ Fright_Bill: req.body.tagId }, {
                        $push: { tripDetails: req.body.tripDetails, }
                    }, function (err, result) {
                        if (err) {
                            res.json('error');
                        } else {
                            res.json('success');
                        }
                    })
                } else {
                    res.json(true);
                }
            } else {
                console.log('inserting here')
                ftb.updateOne({ Fright_Bill: req.body.tagId }, {
                    $push: { tripDetails: req.body.tripDetails, }
                }, function (err, result) {
                    if (err) {
                        res.json('error');
                    } else {
                        res.json('success');
                    }
                })
            }

        }
    })
})

router.post('/ftbIncTrip', (req, res, next) => {
    var trips
    ftb.findOne({ Fright_Bill: req.body.tagId }, { _id: 0, tripDetails: 1 }, function (err, trip) {
        if (trip != null && !err) {
            if (trip.tripDetails.length > 0) {
                trips = trip.tripDetails
                if (trips[trip.tripDetails.length - 1].endTime == undefined) {
                    res.json(trips[trip.tripDetails.length - 1]);
                } else {
                    res.json('');
                }
            }
        }
    })
})

router.post('/ftbTripDetails', (req, res, next) => {
    var stTime = req.body.tripDetails.startTime,
        endTime = req.body.tripDetails.endTime,
        diff = moment(endTime, "HH:mm:ss A").diff(moment(stTime, "HH:mm:ss A")),
        hr = parseFloat((diff / (1000 * 60 * 60)))
    hr = hr.toFixed(2)
    if (hr < 0) {
        res.json('Timestamp is wrong');
    } else {
        var tn = req.body.tripDetails.ton || 0
        var toll = req.body.tripDetails.toll
        ftb.updateOne({ Fright_Bill: req.body.tagId }, {
            $pop: { tripDetails: 1 }
        }, function (err, result) {
            if (err) {
                res.json('error');
            } else {
                ftb.updateOne({ Fright_Bill: req.body.tagId }, {
                    $push: { tripDetails: req.body.tripDetails, },
                    $inc: { BHQty: hr, BLQty: 1, BTQty: tn, PHQty: hr, PLQty: 1, PTQty: tn, BTollQty: 1, PTollQty: 1, BTollTotal: toll, PTollTotal: toll },
                    $set: { status: 'draft', PTollRate: toll, BTollRate: toll, jobTimer: req.body.jobTimer }
                }, function (err, result) {
                    if (err) {
                        res.json('error');
                    } else {
                        res.json('success');
                    }
                })
            }
        })
    }
})

router.post('/ftbRouteDetails', (req, res, next) => {
    logger.info(' /ftbRouteDetails  ' + JSON.stringify(req.body));
    ftb.updateOne({ Fright_Bill: req.body.tagId }, { $push: { routeDetails: req.body.routeDetails, locDetails: req.body.locDetails } }, function (err, result) {
        if (err) {
            res.json('error');
        } else {
            logger.info(' /ftbRouteDetails  ' + JSON.stringify(result));
            res.json('success');
        }
    })
})

var ftbCompleteStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../etrucking_ui/uploads/ftbills')
    },
    filename: function (req, file, cb) {
        cb(null, Date.parse(new Date()) + '-' + file.originalname)
    }
})

var ftbComplete = multer({ storage: ftbCompleteStorage })
/* var data={
tagId:,
picture:,//base 64,
supName:
note:{"name": "Driver", //if user enters any notes otherwise enter blank msg
    "msg":"admin entered some text",
    "time":"10/13/2020 05:00:23.004"}
} */
router.post('/ftbEndJob', (req, res) => {
    //domain info 
    var sigUrl = 'http://demo.meegatrucnz.com/uploads/ftbills/' + req.body.tagId + '-sign.png',
        sig = '../etrucking_ui/uploads/ftbills' + req.body.tagId + '-sign.png'
    fs.writeFile(sig, req.body.picture, { encoding: 'base64' }, function (err) {
        if (err) {
            res.json('Signature not saved.');
        } else {

            ftb.updateOne({ Fright_Bill: req.body.tagId }, {
                $push: { notes: req.body.note },
                $set: {
                    status: 'Pending',
                    sign: sigUrl,
                    supName: req.body.supName
                }
            }, function (err, result) {
                if (err) {
                    res.json('error');
                    console.log(err)
                } else {
                    let newNotif = new notif({
                        user: '',
                        role: 'Driver',
                        timestamp: new Date(),
                        activity: req.body.tagId + 'Job completed',
                        msg: ''
                    })
                    newNotif.save()
                    res.json('success');
                }
            })
        }
    });
})

router.post('/previewTag', (req, res, next) => {
    ftb.findOne({ Fright_Bill: req.body.tagId }, function (err, ftb) {
        if (err) {
            res.json('error');
        } else {
            var index = ftb.tripDetails.length
            if (index > 0) {
                if (ftb.tripDetails[index - 1].endTime == undefined || ftb.tripDetails[index - 1].endTime == null) {
                    ftb.tripDetails.pop()
                }
            }
            res.json(ftb);
        }
    })
})

module.exports = router;