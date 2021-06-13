const express = require('express');
const router = express.Router();
const Employee = require('../modals/employee')
const truck = require('../modals/truck_modal')
const activity = require('../modals/activity')
const nodemailer = require("nodemailer");
const user = require('../modals/user')
var log4js = require('log4js');
const multer = require('multer')
const fs = require('fs')
var logger = log4js.getLogger(), timestamp = new Date()
//reterving data
router.get('/employees', (req, res, next) => {
    Employee.find(function (err, employee) {
        var msg = 'View All Employees '
        logActivity(req.body.user, req.body.role, timestamp, 'View All employees', msg)
        logger.info(' employee.js Line #9 /employees  ' + employee);
        res.json(employee);
    })
})
router.get('/AllDrivers', (req, res, next) => {
    Employee.find({ Role: 'Driver' }, function (err, employee) {
        var msg = 'View All Drivers '
        logActivity(req.body.user, req.body.role, timestamp, 'View All Drivers', msg)
        logger.info(' employee.js Line #15 /AllDrivers  ' + employee);
        res.json(employee);
    })
})

router.post('/driver', (req, res, next) => {
    Employee.findOne({ empName: req.body.driver_name, Role: 'Driver' }, function (err, drivers) {
        if (!err && drivers != null) {
            drivers.empPassword = undefined
            res.json(drivers);
        }
    })
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../etrucking_ui/uploads/emp/driver')
    },
    filename: function (req, file, cb) {
        cb(null, Date.parse(new Date()) + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage })
router.post('/driverProfilePic', upload.single('picture'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
    Employee.updateOne({ empName: req.body.name }, {
        $set: {
            profilePic: req.file.path
        }
    }, function (err, result) {
        if (err) {
            res.json('Error');
        } else {
            res.json('success');
        }
    })
})
var driverDL = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../etrucking_ui/uploads/emp/driver')
    },
    filename: function (req, file, cb) {
        cb(null, Date.parse(new Date()) + '-' + file.originalname)
    }
})

var upload = multer({ storage: driverDL })
router.post('/driUpdateDL', upload.single('dl'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
    Employee.updateOne({ empName: req.body.name }, {
        $set: {
            DLpic: req.file.path,
            Dl_Exp: req.body.dlExpDate,
            Dl_Id: req.body.dlNum
        }
    }, function (err, result) {
        if (err) {
            res.json('Error');
        } else {
            res.json('success');
        }
    })
})

router.get('/getAlltruck', (req, res) => {
    truck.find(function (err, trucks) {
        logger.info(' employee.js Line #22 /getAlltruck  ' + trucks);
        res.json(trucks);
    })
})

router.post('/newDriver', (req, res, next) => {
    let newEmployee = new Employee({
        empId: req.body.id,
        empName: req.body.name,
        Role: req.body.EmpRole,
        empEmail: req.body.empEmail,
        empPassword: req.body.empPass,
        empPhone: req.body.phone,
        hireDate: req.body.hireDate,
        address: req.body.address,
        city: req.body.city,
        zip: req.body.zip,
        ssn: req.body.ssn,
        taxId: req.body.taxId,
        Dl_Id: req.body.Dl_Id,
        Dl_Exp: req.body.Dl_Exp,
        payHr: req.body.payHr,
        payPer: req.body.payPer,
        status: 'Active'
    });
    newEmployee.save((err, employee) => {
        if (err) {
            logger.error('employee.js Line #46 /newDriver' + err);
            res.json({ msg: 'failed to add contact : ' });
        } else {
            var msg = 'Insert Driver ' + req.body.name
            logActivity(req.body.user, req.body.role, timestamp, 'add New Driver', msg)
            logger.info(' employee.js Line #49 /newDriver  ' + employee);
            const driName = req.body.name.split(' ')
            var name = ''
            for (var i = 0; i < driName.length - 1; i++) {
                var temp = driName[i]
                name = name + temp.charAt(0)
            }
            name = name + driName[driName.length - 1] + Math.floor(Math.random() * Math.floor(899) + 100)
            CreateUser(req, name)
            res.json({ msg: 'success' });
        }
    })
})
//add contact
router.post('/newEmp', (req, res, next) => {
    let newEmployee = new Employee({
        empId: req.body.id,
        empName: req.body.name,
        Role: req.body.EmpRole,
        empEmail: req.body.empEmail,
        empPassword: req.body.empPass,
        empAccess: req.body.access,
        status: 'Active'
    });
    newEmployee.save((err, employee) => {
        if (err) {
            logger.error('employee.js Line #65 /newEmp' + err);
            res.json({ msg: 'failed to add Employee : ' });
        } else {
            var body =
                '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;"><tr>' +
                '<td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>' +
                '<td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;"><b>Welcome <span style="color: #60aadf;"> ' + req.body.name + ' </span></b></td></tr><tr>' +
                '<td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;"></td></tr><tr><td>' +
                '<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">' +
                '</td ></tr ></table ></td ></tr ></table >You have been added as new user to the Software. <br> Username :  ' + req.body.empEmail + ' <br>Password : ' + req.body.empPass + ' <br><br>' +
                'You can <a href="http://meegatrucnz.com/Trial.html">Click here</a> to login <br><br><br><pre>Please find the attached manual to explore the software.</pre>' +
                '<br><br> Kind Regards, <br> <span style="color: #ebba34;">Meega Trucking Softwares</span> <br><a href="www.meegatrucnz.com">www.meegatrucnz.com</a>',
                emails = req.body.empEmail + ' , ' + ', megatruckings@gmail.com'
            sendEmail(body, emails)
            var msg = 'Create new Employees ' + req.body.name
            logActivity(req.body.user, req.body.role, timestamp, 'add New Employees', msg)
            logger.info(' employee.js Line #68 /newEmp  ' + employee);
            CreateUser(req, req.body.name)
            res.json({ msg: 'success' })
        }
    })
})

function CreateUser(req, name) {
    let newuser = new user({
        drId: req.body.id,
        user_name: name,
        name: req.body.name,
        email: req.body.empEmail,
        status: 'Active',
        password: req.body.empPass,
        role: req.body.EmpRole,
        empAccess: req.body.access,
        phone: req.body.phone,
        isBroker: false,
        isTruck: false
    });
    newuser.save((err, successMesg) => {
        if (err) {
            logger.error('user.js Line #79 /signup' + err);
        } else {

        }
    })
}

//add contact
router.post('/newTruck', (req, res, next) => {
    let newTruck = new truck({
        truck_id: req.body.truckid,
        license: req.body.truLic,
        Reg_exp: req.body.truReg,
        truck_type: req.body.truckType,
        status: req.body.status
    });
    newTruck.save((err, employee) => {
        if (err) {
            logger.error('employee.js Line #85 /newTruck' + err);
            res.json({ msg: 'failed to add contact : ' });
        } else {
            logger.info(' employee.js Line #8 /newTruck  ' + employee);
            res.json({ msg: 'success' });
        }
    })
})

//delete contact
router.delete('/employee/:id', (req, res, next) => {
    Employee.remove({ _id: req.params.id }, function (err, result) {
        if (err) {
            logger.error('employee.js Line #98 /employee/:id' + err);
            res.json(err);
        } else {
            logger.info(' employee.js Line #98 /employee/:id  ' + result);
            res.json({ msg: 'Success' });
        }
    })
})

router.post('/UpdateTruck', (req, res) => {
    truck.findOneAndUpdate({ truck_id: req.body.truckid }, { $set: { truck_type: req.body.truckType, license: req.body.truLic, Reg_exp: req.body.truReg, status: req.body.status } }, function (err, result) {
        if (err) {
            logger.error('employee.js Line #110 /UpdateTruck' + err);
            res.json(err);
        } else {
            logger.info(' employee.js Line #113 /UpdateTruck  ' + result);
            res.json({ msg: 'success' });
        }
    })

})


router.post('/empUpdate', async (req, res) => {
    const [emp, u] = await Promise.all([
        Employee.updateOne({ empId: req.body.id },
            {
                $pullAll: { empAccess: ["Customer", "ICDriver", "Emp", "Dispatch", "Tags", "Invoices", "payables", "receivables"] },
            }, function (err, result) {
                if (err) {
                    logger.error('employee.js Line #124 /empUpdate' + err);
                    res.json(err);
                } else {
                    Employee.updateOne({ empId: req.body.id },
                        {
                            $set: { Role: req.body.empRole, status: req.body.status, Address: req.body.Address, Social: req.body.Social, Rate: req.body.Rate, empEmail: req.body.email },
                            $push: { Pay: req.body.Pay, empAccess: req.body.access }
                        }, function (err, result) {
                            if (err) {
                                logger.error('employee.js Line #124 /empUpdate' + err);
                                res.json(err);
                            } else {
                                var msg = 'Updated Employees ' + req.body.id
                                logActivity(req.body.user, req.body.role, timestamp, 'updated Employees', msg)
                                logger.info(' employee.js Line #127 /empUpdate  ' + result);

                            }
                        })
                }
            }),
        user.updateOne({ email: req.body.email },
            {
                $pullAll: { empAccess: ["Customer", "ICDriver", "Emp", "Dispatch", "Tags", "Invoices", "payables", "receivables"] },
            }, function (err, result) {
                if (err) {
                    logger.error('employee.js Line #124 /empUpdate' + err);
                    res.json(err);
                } else {
                    user.updateOne({ email: req.body.email },
                        {
                            $push: { empAccess: req.body.access }
                        }, function (err, result) {
                            if (err) {
                                logger.error('employee.js Line #124 /empUpdate' + err);
                                res.json(err);
                            } else {
                                var msg = 'Updated Employees ' + req.body.id
                                logActivity(req.body.user, req.body.role, timestamp, 'updated Employees', msg)
                                logger.info(' employee.js Line #127 /empUpdate  ' + result);
                            }
                        })
                }
            })
    ])
    res.json({ emps: emp, users: u });
});
router.post('/updateDriver', (req, res) => {
    Employee.updateOne({ empId: req.body.id }, {
        $set: {
            empName: req.body.name, hireDate: req.body.hireDate,
            empEmail: req.body.email,
            empPassword: req.body.driPassword,
            empPhone: req.body.phone,
            city: req.body.city, zip: req.body.zip, taxId: req.body.taxId, Dl_Id: req.body.Dl_Id, Dl_Exp: req.body.Dl_Exp, status: req.body.status, address: req.body.address, Social: req.body.ssn,
            payHr: req.body.payHr, payPer: req.body.payPer
        }
    }, function (err, result) {
        if (err) {
            logger.error('employee.js Line #140 /updateDriver' + err);
            res.json(err);
        } else {
            var msg = 'Updated Driver ' + req.body.id
            logActivity(req.body.user, req.body.role, timestamp, 'updated Driver', msg)
            logger.info(' employee.js Line #143 /updateDriver  ' + result);
            user.updateOne({ drId: req.body.id }, {
                $set: {
                    name: req.body.name, email: req.body.email, status: req.body.status,
                    password: req.body.driPassword, phone: req.body.phone
                }
            }, function (err, updated) {
            })
            res.json({ msg: 'success' });
        }
    })
});

router.post('/thisEmp', (req, res) => {
    Employee.find({ empId: req.body.id }, function (err, result) {
        if (err) {
            logger.error('employee.js Line #152 /thisEmp' + err);
            res.json(err);
        } else {
            logger.info(' employee.js Line #155 /thisEmp  ' + result);
            res.json(result);
        }
    })
});
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
async function sendEmail(body, mailList) {
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
        to: mailList, // list of receivers
        subject: 'Welcome to Meega trucking Software', // Subject line
        html: body, // plain text body
    });
}

module.exports = router;
