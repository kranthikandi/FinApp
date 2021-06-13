const express = require('express');
const router = express.Router();
const user = require('../modals/user')
const email = require('../routes/email')
//const sec = require('../modals/secure')
const nodemailer = require("nodemailer");
const activity = require('../modals/activity')
var log4js = require('log4js');
log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'all-the-logs.log' },
        emergencies: { type: 'file', filename: 'panic-now.log' },
        justerrors: { type: 'logLevelFilter', appender: 'emergencies', level: 'debug' }
    },
    categories: {
        default: { appenders: ['justerrors', 'everything', 'emergencies'], level: 'debug' }
    }
});
var logger = log4js.getLogger();

router.post('/signin', async (req, res, next) => {
    var email = req.body.email
    email = email.toLowerCase()
    user.findOne({ user_name: email }, function (err, result) {
        if (err) {
            logger.error('user.js Line #23 /signin' + err);
            res.json(err);
        } else {
            if (result == null) {
                res.json({ isLogin: false, msg: 'Incorrect Username!!' });
            } else {
                if (result.status != 'Active' && result.status != 'active') {
                    res.json({ isLogin: false, msg: "You don't have and Active account!!" });
                    return
                }
                if (result.password == req.body.password) {
                    user.updateOne({ '$or': [{ user_name: email }, { email: email }] }, { $set: { userToken: req.body.token } }, function (err, tokenStatus) {
                        if (err) {
                            res.json("unable to create Token");
                        } else {
                            var body = 'loged in by : ' + req.body.email + '  <br> <br> <br>' +
                                'Address: ' + req.headers.origin + '  <br> <br> <br>' +
                                'Date: ' + Date()

                            //sendEmail(body)
                            let activities = new activity({
                                login_time: Date(),
                                user: req.body.email,
                                company: req.headers.origin,
                            });
                            activities.save((err, succes) => {
                                if (err) {
                                    logger.error('user.js Line #58 /signin logging Activity' + err);
                                }
                                logger.info('user.js Line #60 /signin record inserted logging Activity' + succes);
                                logger.info('user.js Line #61 /signin' + result);
                            })
                            result.password = undefined
                            res.json({ isLogin: true, msg: '', data: result });
                        }
                    })
                } else {
                    res.json({ isLogin: false, msg: 'Incorrect Password!!' });
                }
            }
        }
    })
})
//add activity
router.post('/signup', (req, res, next) => {
    let newuser = new user({
        //user_id : req.body.user_id,
        user_name: req.body.username,
        email: req.body.email,
        status: req.body.status,
        password: req.body.password,
        role: 'Admin'
    });
    newuser.save((err, successMesg) => {
        if (err) {
            logger.error('user.js Line #79 /signup' + err);
            res.json({ msg: 'fail' });
        } else {
            var body = 'You have successfully signed up.</br> please verify you email',
                subject = 'New User'
            //email.email(req.body.email, body, subject)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'meegatruckings@gmail.com',
                    pass: 'History@12'
                }
            });

            const mailOptions = {
                from: 'meegatruckings@gmail.com', // sender address
                to: req.body.email, // list of receivers
                //cc: 'meegatrucking@gmail.com',
                subject: subject, // Subject line
                html: body,// plain text body
            }
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    logger.error('user.js Line #102 /signup' + err);
                } else {
                    logger.info('user.js Line #104 /signup email sent' + info);
                }
            });
            logger.info('user.js Line #107 /signup record inserted' + successMesg);
            res.json({ msg: 'success' });
        }
    })
})

async function sendEmail(body) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
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
    let info = await transporter.sendMail({
        from: 'noreply@meegatrucnz.com', // sender address
        to: "kranthikumar.kandi@gmail.com", // list of receivers
        subject: 'Login Alert', // Subject line
        html: body, // plain text body
    });

}

module.exports = router;
