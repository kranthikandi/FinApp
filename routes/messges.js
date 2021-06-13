const express = require('express');
const { SyncMapPermissionPage } = require('twilio/lib/rest/sync/v1/service/syncMap/syncMapPermission');
const router = express.Router();
const msgs = require('../modals/messages')
const user = require('../modals/user')
const empDri = require('../modals/employee')
const icDri = require('../modals/ICdriver')
const accountSid = 'ACca12430647230407d512c639bf87853c';
const authToken = 'ca5991007bbe3a4db5ecbadb0ac35fd5';
const client = require('twilio')(accountSid, authToken);

router.get('/allMsgs', async (req, res) => {
    var empMsg = [], icdMsg = []
    await empDri.aggregate([
        {
            $lookup:
            {
                from: 'messages',
                as: "msgs",
                let: { empEmail: '$empEmail' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$to', '$$empEmail'] }
                        }
                    },
                    { $sort: { timestamp: -1 } }, // add sort if needed (for example, if you want first 100 comments by creation date)
                    { $limit: 1 }
                ]
            }
        }
    ], function (err, msg) {
        if (!err) {
            empMsg = msg
        } else {
        }
    })
    await icDri.aggregate([
        {
            $lookup:
            {
                from: 'messages',
                as: "msgs",
                let: { empEmail: '$email' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$to', '$$empEmail'] }
                        }
                    },
                    { $sort: { timestamp: -1 } }, // add sort if needed (for example, if you want first 100 comments by creation date)
                    { $limit: 1 }
                ]
            }
        }
    ], function (err, msg) {
        if (!err) {
            icdMsg = msg
        } else {
        }
    })
    res.json(empMsg.concat(icdMsg));
})
router.post('/getMsgs', async (req, res) => {
    const skip = (req.body.page - 1) * 10
    try {
        const [results, itemCount] = await Promise.all([
            msgs.find({ '$or': [{ to: req.body.to }, { from: req.body.to }] })
                .limit(10)
                .skip(skip)
                .sort({ 'timestamp': -1 }),
            msgs.countDocuments({ '$or': [{ to: req.body.to }, { from: req.body.to }] })
        ])
        const pageCount = Math.ceil(itemCount / 10);
        /*  var msg = 'View dispatch for ' + req.body.date
         logActivity(req.body.user, req.body.role, timestamp, 'View Dispatch', msg)
         logger.info(' dispatch.js Line #180 /getDispatch  ' + results); */
        res.json({
            count: itemCount,
            pcount: pageCount,
            result: results
        });
    } catch (err) {
        res.json("Error")
    }
})

router.post('/appSendText', async (req, res) => {
    let newMsg = new msgs({
        from: req.body.driver,
        body: req.body.msg,
        timestamp: req.body.timestamp,
        status: 'Delivered',
        to: 'app'
    });
    newMsg.save((err, msg) => {
        if (err) {
            logger.error('dispatch.js Line #31 /newdispatch' + err);
        } else {
            res.json(msg)
        }
    })
})
router.post('/sendText', async (req, res) => {
    let newMsg = new msgs({
        from: req.body.from,
        body: req.body.msg,
        timestamp: req.body.timestamp,
        status: 'Delivered',
        to: req.body.to
    });
    newMsg.save((err, msg) => {
        if (err) {
            logger.error('dispatch.js Line #31 /newdispatch' + err);
            res.json('error')
        } else {
            user.findOne({ drId: req.body.to }, function (err, user) {
                var message = {
                    app_id: "2aae6d0a-f0bc-4708-8e6c-6524928f9ef3",
                    contents: { "en": req.body.msg },
                    include_player_ids: [user.userToken] //["d1398dc3-ac86-47c2-95db-f92c16e41136"] userToken
                };
                sendNotification(message);
            })
            res.json('success')
        }
    })
})

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
            console.log("Response:");
            console.log(JSON.parse(data));
        });
    });

    req.on('error', function (e) {
        console.log("ERROR:");
        console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
};




module.exports = router;