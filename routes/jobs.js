const express = require('express');
const router = express.Router();
const Jobs = require('../modals/jobs')
const activity = require('../modals/activity')
var log4js = require('log4js');
var logger = log4js.getLogger(), timestamp = new Date()

//reterving data
router.get('/jobs', (req, res, next) => {
    Jobs.find(function (err, driver_details) {
        var msg = 'View All jobs '
        logActivity(req.body.user, req.body.role, timestamp, 'View All jobs', msg)
        logger.info(' jobs.js Line #10 /jobs  ' + driver_details);
        res.json(driver_details);
    })
})

//add contact
router.post('/newjob', (req, res, next) => {
    let newJobs = new Jobs({
        customer_id: req.body.customer_id,
        customer_name: req.body.customer_name,
        job_id: req.body.job_id,
        job_name: req.body.job_name,
        start_date: req.body.start_date,
        job_location: req.body.job_location,
        job_type: req.body.job_type,
        weekday: req.body.weekday,
        Sat: req.body.sat,
        Sun: req.body.sun,
        load: req.body.load,
        ton: req.body.ton,
        notes: req.body.notes,
        status: req.body.status,
        PayRateHr: req.body.PayRateHr,
        PayRateTon: req.body.PayRateTon,
        PayRateLoad: req.body.PayRateLoad
    });
    newJobs.save((err, Driver) => {
        if (err) {
            logger.error('jobs.js Line #38 /newjob' + err);
            res.json({ msg: 'fail' });
        } else {
            var msg = 'New jobs ' + req.body.job_id
            logActivity(req.body.user, req.body.role, timestamp, 'New jobs', msg)
            logger.info(' jobs.js Line #41 /newjob  ' + Driver);
            res.json({ msg: 'success' });
        }
    })
})

router.post('/UpdateJob', (req, res, next) => {
    Jobs.updateOne({ _id: req.body._id },
        {
            $set: {
                job_id: req.body.job_id,
                job_name: req.body.job_name,
                start_date: req.body.start_date,
                job_location: req.body.job_location,
                job_type: req.body.job_type,
                weekday: req.body.weekday,
                Sat: req.body.sat,
                Sun: req.body.sun,
                load: req.body.load,
                ton: req.body.ton,
                notes: req.body.notes,
                status: req.body.status,
                PayRateHr: req.body.PayRateHr,
                PayRateTon: req.body.PayRateTon,
                PayRateLoad: req.body.PayRateLoad
            }
        }, function (err, result) {
            if (err) {
                logger.error('jobs.js Line #69 /UpdateJob' + err);
                res.json(err);
            } else {
                var msg = 'Updated job ' + req.body.job_id
                logActivity(req.body.user, req.body.role, timestamp, 'updated job', msg)
                logger.info(' jobs.js Line #72 /UpdateJob  ' + result);
                res.json({ msg: 'success' });
            }
        })

})

//delete contact
router.delete('/Job/:id', (req, res, next) => {
    Jobs.remove({ _id: req.params.id }, function (err, result) {
        if (err) {
            logger.error('jobs.js Line #83 /Job/:id' + err);
            res.json(err);
        } else {
            logger.info(' jobs.js Line #86 /Job/:id  ' + result);
            res.json({ msg: 'Success' });
        }
    })
})

//get jobs of a customer
router.post('/custjobs', (req, res, next) => {
    Jobs.find({ customer_id: req.body.customer_id }, function (err, result) {
        if (err) {
            logger.error('jobs.js Line #96 /custjobs' + err);
            res.json(err);
        } else {
            var msg = 'get Customer jobs ' + req.body.customer_id
            logActivity(req.body.user, req.body.role, timestamp, 'view customer job', msg)
            logger.info(' jobs.js Line #99 /custjobs  ' + result);
            res.json(result);
        }
    })
})

//get jobs of a customer
router.post('/jobdetails', (req, res, next) => {
    Jobs.find({ job_id: req.body.job_id, customer_name: req.body.customer_name }, function (err, result) {
        if (err) {
            logger.error('jobs.js Line #109 /jobdetails' + err);
            res.json(err);
        } else {
            var msg = 'view jobs details ' + req.body.job_id
            logActivity(req.body.user, req.body.role, timestamp, 'view job details', msg)
            logger.info(' jobs.js Line #112 /jobdetails  ' + result);
            res.json(result);
        }
    })
})

//reterving data
router.get('/cust', (req, res, next) => {
    Jobs.find().distinct('customer_name', function (err, result) {
        if (err) {
            logger.error('jobs.js Line #122 /cust' + err);
            res.json(err);
        } else {
            logger.info(' jobs.js Line #125 /cust  ' + result);
            res.json(result);
        }
    })
})

//get jobs of a customer
router.post('/cjobs', (req, res, next) => {
    Jobs.find({ customer_name: req.body.customer_name }, { customer_id: 1, job_name: 1, job_location: 1 }, function (err, result) {
        if (err) {
            logger.error('jobs.js Line #135 /cjobs' + err);
            res.json(err);
        } else {
            var msg = 'get cust jobs details ' + req.body.customer_name
            logActivity(req.body.user, req.body.role, timestamp, 'view cust job details', msg)
            logger.info(' jobs.js Line #138 /cjobs  ' + result);
            res.json(result);
        }
    })
})

//get job details  of a job
router.post('/jjobs', (req, res, next) => {
    var weeknumb = req.body.weeknumb, rates, brate
    Jobs.find({ job_name: req.body.job_name }, function (err, result) {
        if (err) {
            logger.error('jobs.js Line #149 /jjobs' + err);
            res.json(err);
        } else {
            if (result[0].job_type == 'hourly') {
                if (weeknumb > 0 && weeknumb < 6) {
                    brate = result[0].weekday
                } else if (weeknumb == 6) {
                    brate = result[0].Sat
                } else if (weeknumb == 0) {
                    brate = result[0].Sun
                }
                rates = {
                    bRate: brate,
                    pRate: result[0].PayRateHr
                }
            } else if (result[0].job_type == 'ton') {
                rates = {
                    bRate: result[0].ton,
                    pRate: result[0].PayRateTon
                }
            } else if (result[0].job_type == 'load') {
                rates = {
                    bRate: result[0].load,
                    pRate: result[0].PayRateLoad
                }
            }
            var msg = 'updated job details ' + req.body.job_name
            logActivity(req.body.user, req.body.role, timestamp, 'updated job details', msg)
            logger.info(' jobs.js Line #176 /jjobs  ' + result);
            res.json({ rate: rates, jDetails: result[0] });
        }
    })

})

//get job details  of a job
router.post('/jjobs1', (req, res, next) => {
    var weeknumb = req.body.weeknumb, HrRate, TonRate, LoadRate, pHRate, pTRate, pLRate,
        ttype = req.body.ttype
    Jobs.find({ job_id: req.body.job_id, customer_name: req.body.customer_name }, function (err, result) {
        if (err) {
            logger.error('jobs.js Line #189 /jjobs1' + err);
            res.json(err);
        } else {
            try {
                logger.info(' jobs.js Line #192 /jjobs1  ' + result);
                if (ttype == 'Super-Dump') {
                    if (weeknumb > 0 && weeknumb < 6) {
                        HrRate = result[0].weekday.superdump
                    } else if (weeknumb == 6) {
                        HrRate = result[0].Sat.superdump
                    } else if (weeknumb == 0) {
                        HrRate = result[0].Sun.superdump
                    }
                    TonRate = result[0].ton.superdump
                    LoadRate = result[0].load.superdump
                    pHRate = result[0].PayRateHr.superdump
                    pTRate = result[0].PayRateTon.superdump
                    pLRate = result[0].PayRateLoad.superdump
                } else if (ttype == 'End-Dump') {
                    if (weeknumb > 0 && weeknumb < 6) {
                        HrRate = result[0].weekday.enddump
                    } else if (weeknumb == 6) {
                        HrRate = result[0].Sat.enddump
                    } else if (weeknumb == 0) {
                        HrRate = result[0].Sun.enddump
                    }
                    TonRate = result[0].ton.enddump
                    LoadRate = result[0].load.enddump
                    pHRate = result[0].PayRateHr.enddump
                    pTRate = result[0].PayRateTon.enddump
                    pLRate = result[0].PayRateLoad.enddump
                } else if (ttype == 'Double-Bottom') {
                    if (weeknumb > 0 && weeknumb < 6) {
                        HrRate = result[0].weekday.doublebottom
                    } else if (weeknumb == 6) {
                        HrRate = result[0].Sat.doublebottom
                    } else if (weeknumb == 0) {
                        HrRate = result[0].Sun.doublebottom
                    }
                    TonRate = result[0].ton.doublebottom
                    LoadRate = result[0].load.doublebottom
                    pHRate = result[0].PayRateHr.doublebottom
                    pTRate = result[0].PayRateTon.doublebottom
                    pLRate = result[0].PayRateLoad.doublebottom
                } else if (ttype == '10-wheeler') {
                    if (weeknumb > 0 && weeknumb < 6) {
                        HrRate = result[0].weekday.tenwheeler
                    } else if (weeknumb == 6) {
                        HrRate = result[0].Sat.tenwheeler
                    } else if (weeknumb == 0) {
                        HrRate = result[0].Sun.tenwheeler
                    }
                    TonRate = result[0].ton.tenwheeler
                    LoadRate = result[0].load.tenwheeler
                    pHRate = result[0].PayRateHr.tenwheeler
                    pTRate = result[0].PayRateTon.tenwheeler
                    pLRate = result[0].PayRateLoad.tenwheeler
                } else if (ttype == 'Flatbed') {
                    if (weeknumb > 0 && weeknumb < 6) {
                        HrRate = result[0].weekday.flatbed
                    } else if (weeknumb == 6) {
                        HrRate = result[0].Sat.flatbed
                    } else if (weeknumb == 0) {
                        HrRate = result[0].Sun.flatbed
                    }
                    TonRate = result[0].ton.flatbed
                    LoadRate = result[0].load.flatbed
                    pHRate = result[0].PayRateHr.flatbed
                    pTRate = result[0].PayRateTon.flatbed
                    pLRate = result[0].PayRateLoad.flatbed
                }
                var msg = 'get job rates ' + req.body.job_id
                logActivity(req.body.user, req.body.role, timestamp, ' view Job rates', msg)
                logger.info(' jobs.js Line #259 /jjobs1  ' + { bHr: HrRate, bTon: TonRate, bLoad: LoadRate, pHr: pHRate, pTon: pTRate, pLoad: pLRate });
                var resmsg = { bHr: HrRate, bTon: TonRate, bLoad: LoadRate, pHr: pHRate, pTon: pTRate, pLoad: pLRate }
            } catch (error) {
                var resmsg = 'error'
                var msg = 'get job rates ' + req.body.job_id
                logActivity(req.body.user, req.body.role, timestamp, ' view Job rates', msg)
                logger.info(' jobs.js Line #259 /jjobs1  ' + { bHr: HrRate, bTon: TonRate, bLoad: LoadRate, pHr: pHRate, pTon: pTRate, pLoad: pLRate });
            }
            res.json(resmsg);
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
module.exports = router;
