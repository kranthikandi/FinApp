const express = require('express');
const moment = require('moment')
const router = express.Router();
const dispatch = require('../modals/dispatch')
const ftb = require('../modals/ftbill')
const AR = require('../modals/ARmodal')
const AP = require('../modals/APmodal')
const invoice = require('../modals/invoiceModal')
var d = moment(new Date())
var today = moment(d).format('MM-DD-YYYY')
var sunday = moment(d).weekday(0).format('MM-DD-YYYY')
var thisMonth = moment(d).startOf('month').format('MM-DD-YYYY')
var weekNumber = moment(d).week()
var nxtSunday = moment(sunday, 'MM-DD-YYYY').add(7, 'days').format('MM-DD-YYYY');


router.get('/TotalDispatch', (req, res, next) => {
    console.log('TagsEntered ++++++')

    var from = moment(req.body.from).format('MM-DD-YYYY')
    var to = moment(req.body.to).format('MM-DD-YYYY')
    console.log(from + " ______ " + to)
    dispatch.countDocuments({ DispDate: { $lte: to, $gte: from } }, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            res.json(result);
            console.log(result)
        }
    })
})
router.post('/TagsEntered', (req, res, next) => {
    //sunday = '01-01-2019'
    //sunday = moment(thisMonth).format('MM-DD-YYYY')

    var from = moment(req.body.from).format('MM-DD-YYYY')
    var to = moment(req.body.to).format('MM-DD-YYYY')
    console.log(from + " ______ " + to)
    var error = false;
    var errs;
    var count = [];
    ftb.countDocuments({ status: 'Created', date: { $lte: to, $gte: from } }, function (err, Created) {
        if (err) {
            res.json(errs)
            console.log(err)
        } else {
            //var Created = { 'Created' : Created}
            count.push(Created)
            ftb.countDocuments({ status: 'Entered', date: { $lte: req.body.to, $gte: req.body.from } }, function (err, Entered) {
                if (err) {
                    res.json(errs);
                    console.log(err)
                } else {
                    //var Entered = { 'Entered' : Entered}
                    count.push(Entered)
                    ftb.countDocuments({ status: 'Invoiced', date: { $lte: req.body.to, $gte: req.body.from } }, function (err, Invoiced) {
                        if (err) {
                            res.json(errs);
                            console.log(err)
                        } else {
                            //var Invoiced = { 'Invoiced' : Invoiced}
                            count.push(Invoiced)
                            dispatch.countDocuments({ DispDate: { $lte: req.body.to, $gte: req.body.from } }, function (err, Dispatched) {
                                if (err) {
                                    res.json(errs);
                                    console.log(err)
                                } else {
                                    //var Invoiced = { 'Invoiced' : Invoiced}

                                    res.json({ donut: count, disp: Dispatched });
                                }
                            })
                        }
                    })
                }
            })
        }
    })


    if (error) {

    } else {

    }
})

router.get('/RevThisYear', (req, res, next) => {
    var from = moment(req.body.from).format('MM-DD-YYYY')
    var to = moment(req.body.to).format('MM-DD-YYYY')
    console.log(req.body)
    invoice.aggregate(
        [

            {
                $group:
                {
                    _id: { month: { $month: "$InvDate" } },
                    totalAmount: { $sum: '$Total' }
                }
            }
        ], function (err, result) {
            if (err) {
                console.log(err)
                res.json(err);
            } else {
                if (result.length == 0) {
                    console.log({ resData: result, annualSum: tarData })
                    res.json({ resData: result, annualSum: [0] });
                } else {
                    console.log(result)
                    console.log(result[0].totalAmount)

                    var tarData = [0], d = 0
                    for (var i = 0; i < result.length; i++) {
                        if (result.length < 14) {
                            d = d + result[0].totalAmount
                            tarData.push(d)
                        }
                    }

                    console.log({ resData: result, annualSum: tarData })
                    res.json({ resData: result, annualSum: tarData });
                }
            }
        }
    )
})

router.post('/RevThisWeek', (req, res, next) => {
    console.log(req.body)
    invoice.aggregate(
        [
            {
                $group:
                {
                    _id: { week: { $isoWeek: "$InvDate" } },
                    totalAmount: { $sum: '$Total' }
                }
            }
        ], function (err, result) {
            if (err) {
                res.json(err);
            } else {
                console.log(result)
                if (result.length == 0) {
                    res.json({ 'RevThisWeek': 0 });
                } else {
                    console.log(weekNumber)
                    if (result[0]._id.week == weekNumber) {
                        res.json({ 'RevThisWeek': result[0].totalAmount });
                    } else {
                        res.json({ 'RevThisWeek': 0 });
                    }
                }
            }

        }
    )
})

router.post('/InvThisWeek', (req, res, next) => {
    console.log('TagsEntered ++++++')
    console.log(req.body)
    invoice.countDocuments({ status: 'Created', InvDate: { $lte: req.body.to, $gte: req.body.from } }, function (err, result) {
        if (err) {
            res.json(errs);
            console.log(err)
        } else {
            console.log(nxtSunday + '++++ ' + sunday)
            res.json(result);
        }
    })
})

router.get('/payThisWeek', (req, res, next) => {
    AP.aggregate(
        [
            {
                $group:
                {
                    _id: { week: { $isoWeek: "$updatedDate" } },
                    totalAmount: { $sum: '$pTotal' }
                }
            }
        ], function (err, result) {
            if (err) {
                res.json(err);
                console.log(err)
            } else {
                if (result.length == 0) {
                    res.json({ 'RevThisWeek': 0 });
                } else {
                    if (result[0]._id.week == weekNumber) {
                        res.json({ 'RevThisWeek': result[0].totalAmount });
                    } else {
                        res.json({ 'RevThisWeek': 0 });
                    }
                }
            }
        })
})

router.get('/MissingTags', (req, res, next) => {
    dispatch.find({ '$or': [{ Fright_bill: '' }, { Fright_bill: null }], Driver: { $ne: null } }, function (err, result) {
        if (err) {
            res.json(errs);
            console.log(err)
        } else {
            res.json(result);
        }
    }).sort({ 'date': -1 })

})

router.get('/getUnpaidInv', (req, res, next) => {
    invoice.find({ '$or': [{ status: 'Created' }, { status: 'P-Paid' }] }, function (err, result) {
        if (err) {
            res.json(errs);
            console.log(err)
        } else {
            //console.log(today + '++++ ' + sunday)
            res.json(result);
        }
    })

})

module.exports = router