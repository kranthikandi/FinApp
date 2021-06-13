const express = require('express');
const router = express.Router();
const Driver = require('../modals/ICdriver')
const Apayble = require('../modals/APmodal')
const bill = require('../modals/ftbill')
const statement = require('../modals/statement')
const trucks = require('../modals/truck_modal')
const inv = require('../modals/invoiceModal')
const AR = require('../modals/ARmodal')
const emp = require('../modals/employee')
const user = require('../modals/user')
const ftb = require('../modals/ftbill')
var log4js = require('log4js');
const multer = require('multer')
const fs = require('fs')
const constants = require('../routes/constants')
const activity = require('../modals/activity')
var logger = log4js.getLogger(), timestamp = new Date()

//reterving data
router.get('/drivers', (req, res, next) => {
     Driver.find(function (err, ICDrivers) {
          var msg = 'View all IC Driver '
          logActivity(req.body.user, req.body.role, timestamp, 'View IC Driver', msg)
          logger.info(' ICDriver.js Line #17 /drivers  ' + ICDrivers);
          res.json(ICDrivers);
     })
})

//for Assigning drivers
router.get('/Alldrivers', (req, res, next) => {
     Driver.find({ status: 'Active' }, { 'ICdriver_id': 1, 'ICdriver_name': 1, 'NoOfTrucks': 1 }, function (err, ICDrivers) {
          if (err) {
               logger.error('ICDriver.js Line #26 /Alldrivers' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #29 /Alldrivers  ' + ICDrivers);
               emp.find({ status: 'Active', Role: 'Driver' }, { 'empId': 1, 'empName': 1 }, function (err, trucks) {
                    if (err) {
                         logger.error('ICDriver.js Line #32 /Alldrivers' + err);
                         res.json(err);
                    } else {
                         logger.info(' ICDriver.js Line #35 /Alldrivers  ' + ICDrivers);
                         var response = [], drivers = []
                         for (var i = 0; i < ICDrivers.length; i++) {
                              var d = {
                                   ICdriver_id: ICDrivers[i].ICdriver_id,
                                   ICdriver_name: ICDrivers[i].ICdriver_name,
                                   NoOfTrucks: ICDrivers[i].NoOfTrucks
                              }
                              drivers.push(ICDrivers[i].ICdriver_name)
                              response.push(d)
                         }
                         for (var i = 0; i < trucks.length; i++) {
                              var d = {
                                   ICdriver_id: trucks[i].empId,
                                   ICdriver_name: trucks[i].empName,
                                   NoOfTrucks: ' Our '
                              }
                              drivers.push(trucks[i].empName)
                              response.push(d)
                         }
                         var msg = 'View All Driver '
                         logActivity(req.body.user, req.body.role, timestamp, 'View All Driver', msg)
                         res.json({ res: response, dri: drivers });
                    }
               })
          }
     })
})

router.post('/driverDetails', (req, res, next) => {
     Driver.findOne({ ICdriver_name: req.body.driver_name }, function (err, ICDrivers) {
          var msg = 'View IC Driver Details ' + req.body.driver_name
          logActivity(req.body.user, req.body.role, timestamp, 'View IC Driver', msg)
          logger.info(' ICDriver.js Line #65 /driverDetails  ' + ICDrivers);
          res.json(ICDrivers);
     })
})

router.post('/updatedriver', (req, res, next) => {
     Driver.updateOne({ ICdriver_id: req.body.driver_id }, {
          $set:
          {
               ICdriver_name: req.body.driver_name,
               status: req.body.status,
               Dl_Id: req.body.Dl_Id,
               Dl_Exp: req.body.Dl_Exp,
               Ins_Exp: req.body.Ins_Exp,
               Ins_Id: req.body.Ins_Id,
               Ins_provider: req.body.Ins_provider,
               trucks: req.body.Trucks,
               zip: req.body.Zip,
               address: req.body.address,
               city: req.body.city,
               ssn: req.body.ssn,
               taxId: req.body.taxId,
               phone: req.body.phone,
               email: req.body.email,
               DriPass: req.body.driPassword,
               BrokerFee: req.body.BrokerFee,
               TrailerFee: req.body.TrailerFee,
               NoOfTrucks: req.body.NoOfTrucks,
               TrIn: req.body.TrIn,
               WoCo: req.body.WoCo,
               MoCaPe: req.body.MoCaPe,
               SuAg: req.body.SuAg,
               DrPr: req.body.DrPr,
               GeLi: req.body.GeLi
          }
     }, function (err, ICDrivers) {
          if (err) {
               logger.error('ICDriver.js Line #92 /updatedriver' + err);
               res.json({ msg: 'Something went wrong. Please try again.' });
          } else {
               var msg = 'Update IC Driver Details ' + req.body.driver_name
               logActivity(req.body.user, req.body.role, timestamp, 'Update IC Driver', msg)
               logger.info(' ICDriver.js Line #95 /updatedriver  ' + ICDrivers);
               user.updateOne({ drId: req.body.driver_id }, {
                    $set: {
                         name: req.body.driver_name, email: req.body.email, status: req.body.status,
                         password: req.body.driPassword, phone: req.body.phone
                    }
               }, function (err, updated) {
               })
               res.json({ msg: 'success' });
          }
     })
})

//add contact
router.post('/driver', (req, res, next) => {
     let newDriver = new Driver({
          ICdriver_id: req.body.driver_id,
          ICdriver_name: req.body.driver_name,
          NoOfTrucks: req.body.NoOfTrucks,
          status: req.body.status,
          address: req.body.address,
          city: req.body.city,
          zip: req.body.Zip,
          Trucks: req.body.Trucks,
          phone: req.body.phone,
          email: req.body.email,
          DriPass: req.body.driPassword,
          ssn: req.body.ssn,
          taxId: req.body.taxId,
          Ins_provider: req.body.Ins_provider,
          Ins_Id: req.body.Ins_Id,
          Ins_Exp: req.body.Ins_Exp,
          Dl_Id: req.body.Dl_Id,
          Dl_Exp: req.body.Dl_Exp,
          BrokerFee: req.body.BrokerFee,
          TrailerFee: req.body.TrailerFee,
          TrIn: req.body.TrIn,
          WoCo: req.body.WoCo,
          MoCaPe: req.body.MoCaPe,
          SuAg: req.body.SuAg,
          DrPr: req.body.DrPr,
          GeLi: req.body.GeLi
     });
     newDriver.save((err, Driver) => {
          if (err) {
               logger.error('ICDriver.js Line #124 /driver' + err);
               res.json({ msg: 'Something went wrong. Please try again.' });
          } else {
               var msg = 'New IC Driver  ' + req.body.driver_name
               logActivity(req.body.user, req.body.role, timestamp, 'New IC Driver', msg)
               logger.info(' ICDriver.js Line #127 /driver  ' + Driver);
               res.json({ msg: 'success' });
               CreateUser(req)
          }
     })
})

async function CreateUser(req) {
     const driName = req.body.driver_name.split(' ');
     var name = '', company = '@sunnytrans'
     for (var i = 0; i < driName.length; i++) {
          var temp = driName[i];
          name = name + temp.charAt(0);
     }
     name = name + Math.floor(Math.random() * Math.floor(899) + 100);
     let newuser = new user({
          drId: req.body.driver_id,
          user_name: name,
          name: req.body.driver_name,
          phone: req.body.phone,
          email: req.body.email,
          status: 'Active',
          password: req.body.driPassword,
          role: 'Driver',
          isBroker: true,
          isTruck: false
     });
     newuser.save((err, successMesg) => {
          if (err) {
               logger.error('user.js Line #79 /signup' + err);
          } else {
          }
     })
}

//delete contact
router.delete('/driver/:id', (req, res, next) => {
     Driver.remove({ _id: req.params.id }, function (err, result) {
          if (err) {
               logger.error('ICDriver.js Line #137 //driver/:id' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #140 //driver/:id  ' + ICDrivers);
               res.json({ msg: 'Success' });
          }
     })
})

//get driver to dispatch
router.post('/dispDrivers', (req, res, next) => {
     Driver.find({ tt: req.body.tt, '$or': [{ status: 'assigned' }, { status: 'available' }] }, function (err, result) {
          if (err) {
               logger.error('ICDriver.js Line #150 /dispDrivers' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #153 /dispDrivers  ' + ICDrivers);
               res.json(result);
          }

     })
})

router.post('/EDDrivers', (req, res, next) => {
     var response = []
     Driver.find({ status: 'Active' }, { trucks: { $elemMatch: { TruckType: 'End-Dump', Status: 'Available' } } }, function (err, result) {
          if (err) {
               logger.error('ICDriver.js Line #164 /EDDrivers' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #167 /EDDrivers  ' + result);
               for (var i = 0; i < result.length; i++) {
                    if (result[i].trucks.length > 0) {
                         var d = {
                              truckID: result[i].trucks[0].TruckID,
                              TName: result[i].trucks[0].ICName
                         }
                         response.push(d)
                    }
               }
               trucks.find({ status: 'Available', truck_type: 'End-Dump' }, function (err, trucks) {
                    if (err) {
                         logger.error('ICDriver.js Line #179 /EDDrivers' + err);
                         res.json(err);
                    } else {
                         logger.info(' ICDriver.js Line #182 /EDDrivers  ' + trucks);
                         for (var i = 0; i < trucks.length; i++) {
                              var d = {
                                   truckID: trucks[i].truck_id,
                                   TName: 'Ours'
                              }
                              response.push(d)
                         }
                         res.json(response);
                    }
               })

          }

     })
})

router.post('/SDDrivers', (req, res, next) => {
     Driver.find({ status: 'Active' }, { trucks: { $elemMatch: { TruckType: 'Super-Dump', Status: 'Available' } } }, function (err, result) {
          if (err) {
               logger.error('ICDriver.js Line #202 /SDDrivers' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #205 /SDDrivers  ' + result);
               var response = []
               for (var i = 0; i < result.length; i++) {
                    if (result[i].trucks.length > 0) {
                         var d = {
                              truckID: result[i].trucks[0].TruckID,
                              TName: result[i].trucks[0].ICName
                         }
                         response.push(d)
                    }
               }
               trucks.find({ status: 'Available', truck_type: 'Super-Dump' }, function (err, trucks) {
                    if (err) {
                         logger.error('ICDriver.js Line #218 /SDDrivers' + err);
                         res.json(err);
                    } else {
                         logger.info(' ICDriver.js Line #221 /SDDrivers  ' + trucks);
                         for (var i = 0; i < trucks.length; i++) {
                              var d = {
                                   truckID: trucks[i].truck_id,
                                   TName: 'Ours'
                              }
                              response.push(d)
                         }
                         res.json(response);
                    }
               })
          }

     })
})

router.post('/DBDrivers', (req, res, next) => {
     Driver.find({ status: 'Active' }, { trucks: { $elemMatch: { TruckType: 'Double-Bottom', Status: 'Available' } } }, function (err, result) {
          if (err) {
               logger.error('ICDriver.js Line #240 /DBDrivers' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #243 /DBDrivers  ' + result);
               var response = []
               for (var i = 0; i < result.length; i++) {
                    if (result[i].trucks.length > 0) {
                         var d = {
                              truckID: result[i].trucks[0].TruckID,
                              TName: result[i].trucks[0].ICName
                         }
                         response.push(d)
                    }
               }
               trucks.find({ status: 'Available', truck_type: 'Double-Bottom' }, function (err, trucks) {
                    if (err) {
                         logger.error('ICDriver.js Line #256 /DBDrivers' + err);
                         res.json(err);
                    } else {
                         logger.info(' ICDriver.js Line #259 /DBDrivers  ' + trucks);
                         for (var i = 0; i < trucks.length; i++) {
                              var d = {
                                   truckID: trucks[i].truck_id,
                                   TName: 'Ours'
                              }
                              response.push(d)
                         }
                         res.json(response);
                    }
               })
          }

     })
})

router.post('/TenWDrivers', (req, res, next) => {
     Driver.find({ status: 'Active' }, { trucks: { $elemMatch: { TruckType: '10-wheeler', Status: 'Available' } } }, function (err, result) {
          if (err) {
               logger.error('ICDriver.js Line #278 /TenWDrivers' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #281 /TenWDrivers  ' + result);
               var response = []
               for (var i = 0; i < result.length; i++) {
                    if (result[i].trucks.length > 0) {
                         var d = {
                              truckID: result[i].trucks[0].TruckID,
                              TName: result[i].trucks[0].ICName
                         }
                         response.push(d)
                    }
               }
               trucks.find({ status: 'Available', truck_type: '10-wheeler' }, function (err, trucks) {
                    if (err) {
                         logger.error('ICDriver.js Line #294 /TenWDrivers' + err);
                         res.json(err);
                    } else {
                         logger.info(' ICDriver.js Line #297 /TenWDrivers  ' + trucks);
                         for (var i = 0; i < trucks.length; i++) {
                              var d = {
                                   truckID: trucks[i].truck_id,
                                   TName: 'Ours'
                              }
                              response.push(d)
                         }
                         res.json(response);
                    }
               })
          }

     })
})

router.post('/Flatbed', (req, res, next) => {

     Driver.find({ status: 'Active' }, { trucks: { $elemMatch: { TruckType: 'Flatbed', Status: 'Available' } } }, function (err, result) {
          if (err) {
               logger.error('ICDriver.js Line #317 /Flatbed' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #320 /Flatbed  ' + result);
               var response = []
               for (var i = 0; i < result.length; i++) {
                    if (result[i].trucks.length > 0) {
                         var d = {
                              truckID: result[i].trucks[0].TruckID,
                              TName: result[i].trucks[0].ICName
                         }
                         response.push(d)
                    }
               } trucks.find({ status: 'Available', truck_type: 'Flatbed' }, function (err, trucks) {
                    if (err) {
                         logger.error('ICDriver.js Line #332 /Flatbed' + err);
                         res.json(err);
                    } else {
                         logger.info(' ICDriver.js Line #335 /Flatbed  ' + trucks);
                         for (var i = 0; i < trucks.length; i++) {
                              var d = {
                                   truckID: trucks[i].truck_id,
                                   TName: 'Ours'
                              }
                              response.push(d)
                         }
                         res.json(response);
                    }
               })
          }

     })
})

router.post('/dristatupdate', (req, res, next) => {
     if (req.body.driver == 'Ours') {
          trucks.updateOne({ truck_id: req.body.truId }, { $set: { status: 'Assigned' } }, function (err, result) {
               if (err) {
                    logger.error('ICDriver.js Line #355 /dristatupdate' + err);
                    res.json(err);
               } else {
                    logger.info(' ICDriver.js Line #358 /dristatupdate  ' + result);
                    res.json(result);
               }
          })
     } else {
          Driver.updateOne({ ICdriver_name: req.body.driver, 'trucks.TruckID': req.body.truId }, { $set: { 'trucks.$.Status': req.body.status } }, function (err, result) {
               if (err) {
                    logger.error('ICDriver.js Line #365 /dristatupdate' + err);
                    res.json(err);
               } else {
                    logger.info(' ICDriver.js Line #368 /dristatupdate  ' + result);
                    res.json(result);
               }
          })
     }
})

router.post('/updateReqDriver', (req, res, next) => {
     Driver.updateOne({ driver_name: req.body.driver_name }, { $set: { status: "Requested" } }, function (err, result) {
          if (err) {
               logger.error('ICDriver.js Line #378 /updateReqDriver' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #381 /updateReqDriver  ' + result);
               res.json(result);
          }
     })
})

router.post('/updateAvaDriver', (req, res, next) => {
     Driver.updateOne({ driver_name: req.body.driver_name }, { $set: { status: "Available" } }, function (err, result) {
          if (err) {
               logger.error('ICDriver.js Line #390 /updateAvaDriver' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #393 /updateAvaDriver  ' + result);
               res.json(result);
          }
     })
})

router.post('/getDriver', (req, res, next) => {
     Driver.find({ status: 'Active' }, { trucks: { $elemMatch: { TruckType: req.body.tt, Status: 'Available' } } }, function (err, result) {
          if (err) {
               logger.error('ICDriver.js Line #402 /getDriver' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #405 /getDriver  ' + result);
               var response = []
               for (var i = 0; i < result.length; i++) {
                    if (result[i].trucks.length > 0) {
                         var d = {
                              truckID: result[i].trucks[0].TruckID,
                              TName: result[i].trucks[0].ICName
                         }
                         response.push(d)
                    }
               }
               trucks.find({ status: 'Available', truck_type: req.body.tt }, function (err, trucks) {
                    if (err) {
                         logger.error('ICDriver.js Line #418 /getDriver' + err);
                         res.json(err);
                    } else {
                         logger.info(' ICDriver.js Line #421 /getDriver  ' + trucks);
                         for (var i = 0; i < trucks.length; i++) {
                              var d = {
                                   truckID: trucks[i].truck_id,
                                   TName: 'Ours'
                              }
                              response.push(d)
                         }
                         res.json(response);
                    }
               })
          }
     })
})

router.post('/addBillDriver', (req, res, next) => {
     Apayble.findOneAndUpdate({ Fright_Bill: req.body.tagid },
          {
               $set: {
                    status: req.body.status, updatedDate: req.body.updatedTime,
                    tagDate: req.body.tagDate, driver_id: req.body.driverId,
                    BHRate: req.body.BHRate, BLRate: req.body.BLRate, BTRate: req.body.BTRate,
                    Driver: req.body.driver, updatedBy: req.body.updated, phr: req.body.phr, pTon: req.body.pTon,
                    customer_id: req.body.customer_id, customer_name: req.body.custName,
                    job_id: req.body.jobId, job_name: req.body.jobName, job_type: req.body.jobType,
                    PHQty: req.body.PHQty, PHRate: req.body.PHRate, PHTotal: req.body.PHTotal,
                    PLQty: req.body.PLQty, PLRate: req.body.PLRate, PLTotal: req.body.PLTotal,
                    PTQty: req.body.PTQty, PTRate: req.body.PTRate, PTTotal: req.body.PTTotal,
                    PTollQty: req.body.PTollQty, PTollRate: req.body.PTollRate, PTollTotal: req.body.PTollTotal,
                    PDFQty: req.body.PDFQty, PDFRate: req.body.PDFRate, PDFTotal: req.body.PDFTotal,
                    PSTQty: req.body.PSTQty, PSTRate: req.body.PSTRate, PSTTotal: req.body.PSTTotal,
                    PBRFeeRate: req.body.PBRFeeRate, PBRFee: req.body.PBRFee,
                    ptotal: req.body.ptotal, pNetTotal: req.body.pNetTotal
               }
          }, function (err, ap) {
               if (err) {
                    logger.error('ICDriver.js Line #457 /addBillDriver' + err);
                    res.json(err);
               } else {
                    logger.info(' ICDriver.js Line #460 /addBillDriver  ' + ap);
                    if (ap == null) {
                         let newAP = new Apayble({
                              Fright_Bill: req.body.tagid,
                              status: req.body.status,
                              updatedDate: req.body.updatedTime,
                              driver_id: req.body.driverId,
                              Driver: req.body.driver,
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
                              job_id: req.body.jobId,
                              job_name: req.body.jobName,
                              job_type: req.body.jobType
                         });
                         newAP.save((err, apayable) => {
                              if (err) {
                                   logger.error('ICDriver.js Line #486 /addBillDriver' + err);
                                   res.json({ err, msg: 'error' });
                              } else {
                                   logger.info(' ICDriver.js Line #489 /addBillDriver  ' + apayable);
                                   res.json({ msg: 'success' });
                              }
                         })
                    } else {
                         var msg = 'Added New Bill in Ftbills and Apayables IC Driver for tag ' + req.body.tagid + ' for Driver ' + req.body.driver
                         logActivity(req.body.user, req.body.role, timestamp, 'Added Driver tag', msg)
                         res.json({ msg: 'success' });
                    }
               }
          })

})
router.post('/updateBillDriver', (req, res, next) => {
     Apayble.updateOne({ Fright_Bill: req.body.tagid },
          {
               $set: {
                    tagDate: req.body.tagDate,
                    updatedDate: req.body.updatedTime,
                    updatedBy: req.body.updated,
                    BHRate: req.body.BHRate, BLRate: req.body.BLRate, BTRate: req.body.BTRate,
                    PHQty: req.body.PHQty, PHRate: req.body.PHRate, PHTotal: req.body.PHTotal,
                    PLQty: req.body.PLQty, PLRate: req.body.PLRate, PLTotal: req.body.PLTotal,
                    PTQty: req.body.PTQty, PTRate: req.body.PTRate, PTTotal: req.body.PTTotal,
                    PTollQty: req.body.PTollQty, PTollRate: req.body.PTollRate, PTollTotal: req.body.PTollTotal,
                    PDFQty: req.body.PDFQty, PDFRate: req.body.PDFRate, PDFTotal: req.body.PDFTotal,
                    PSTQty: req.body.PSTQty, PSTRate: req.body.PSTRate, PSTTotal: req.body.PSTTotal,
                    PBRFeeRate: req.body.PBRFeeRate, PBRFee: req.body.PBRFee,
                    Driver: req.body.Driver, customer_name: req.body.customer_name,
                    ptotal: req.body.ptotal, pNetTotal: req.body.pNetTotal
               }
          }, function (err, ap) {
               if (err) {
                    logger.error('ICDriver.js Line #520 /updateBillDriver' + err);
                    res.json(err);
               } else {
                    logger.info(' ICDriver.js Line #523 /updateBillDriver  ' + ap);
                    updateInv(req)
                    updatedAR(req)
                    var msg = 'Updated Bill in Ftbills and Apayables IC Driver for tag ' + req.body.tagid
                    logActivity(req.body.user, req.body.role, timestamp, 'Updated Driver tag', msg)
                    res.json({ msg: 'success' });

               }
          })
})
function updateInv(req) {
     var rate = '', bqty = ''
     if (req.body.BHQty) {
          rate = rate + '$ ' + req.body.BHRate + '<br>'
          bqty = bqty + req.body.BHQty + ' Hour,<br> '
     } if (req.body.BLQty) {
          rate = rate + '$ ' + req.body.BLRate + '<br>'
          bqty = bqty + req.body.BLQty + ' Load,<br>'
     } if (req.body.BTQty) {
          rate = rate + '$ ' + req.body.BTRate + '<br>'
          bqty = bqty + req.body.BTQty + ' Ton,<br> '
     } if (req.body.BTollQty) {
          rate = rate + '$ ' + req.body.BTollRate + '<br>'
          bqty = bqty + req.body.BTollQty + ' Toll,<br> '
     } if (req.body.BDFQty) {
          rate = rate + '$ ' + req.body.BDFRate + '<br>'
          bqty = bqty + req.body.BDFQty + ' Dumps,<br> '
     } if (req.body.BSTQty) {
          rate = rate + '$ ' + req.body.BSTRate + '<br>'
          bqty = bqty + req.body.BSTQty + ' Standby Time,<br> '
     } if (req.body.BBRate) {
          rate = rate + '$ ' + req.body.BBRate + '<br>'
          bqty = bqty + req.body.BBTotal + ' Broker Fee,<br> '
     }
     inv.updateOne({ invId: req.body.invId, details: { $elemMatch: { ftb: req.body.tagid } } },
          {
               $set: { 'details.$.rate': rate, 'details.$.qty': bqty, 'details.$.total': req.body.btotal },
               $inc: {
                    Total: req.body.tot, 'qtytble.Hours': req.body.hr, 'qtytble.loads': req.body.lo, 'qtytble.tons': req.body.to, 'qtytble.tolls': req.body.toll, 'qtytble.dumpfee': req.body.df, 'qtytble.standbyTime': req.body.st, 'qtytble.material': req.body.mt
               },
          },
          function (err, pull) {
               if (err) {
                    logger.error('ICDriver.js Line #564 updateInv(req)' + err);
                    return 'Unable to updated AR to P-Paid Line customer.js-162 '
               } else {
                    logger.info(' ICDriver.js Line #567 updateInv(req)  ' + pull);
                    return 'sucess'
               }
          })
}

function updatedAR(req) {
     AR.updateOne({ invDetails: { $elemMatch: { invID: req.body.invId } } },
          {
               $inc: {
                    TotalRev: req.body.tot, Due: req.body.tot
               },
          }, function (err, ressult) {
               if (err) {
                    logger.error('ICDriver.js Line #581 updatedAR(req)' + err);
                    return 'Unable to updated AR to P-Paid Line customer.js-162 '
               } else {
                    logger.info(' ICDriver.js Line #584 updatedAR(req)  ' + ressult);
               }
          })
}
router.get('/getAllStatements', (req, res, next) => {
     bill.find({ payables: null }, function (err, apayments) {
          var msg = 'View all statements '
          logActivity(req.body.user, req.body.role, timestamp, 'View All Statements', msg)
          logger.info(' ICDriver.js Line #590 /getAllStatements  ' + apayments);
          res.json(apayments);
     })
})

router.post('/getDriFtBills', (req, res, next) => {
     bill.find({
          '$or': [{ status: 'Entered' }, { status: 'Invoiced' }, { status: 'Preview' }, { status: 'Paid' }, { status: 'P-Paid' }],
          Driver: req.body.driName, date: { $lte: req.body.end, $gte: req.body.start, }, payables: null
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
     /* Apayble.find({ Driver: req.body.dirName, status: 'Created', tagDate: { $lte: req.body.end, $gte: req.body.start } }, function (err, apayments) {
          var msg = 'View all Driver Bills ' + req.body.dirName
          logActivity(req.body.user, req.body.role, timestamp, 'View All Driver Bills', msg)
          logger.info(' ICDriver.js Line #597 /getDriFtBills  ' + apayments);
          res.json(apayments);
     }) */
})

router.post('/driFee', (req, res) => {
     Driver.findOne({ ICdriver_name: req.body.dname }, { _id: 0, BrokerFee: 1 }, function (err, driFee) {
          if (err) {
               logger.error('ICDriver.js Line #605 /driFee' + err);
               res.json(err);
          } else {
               logger.info(' ICDriver.js Line #608 /driFee  ' + driFee);
               if (!driFee) {
                    emp.find({ empName: req.body.dname }, { _id: 0, payHr: 1, payPer: 1 }, function (err, trucks) {
                         if (err) {
                              logger.error('ICDriver.js Line #612 /driFee' + err);
                              res.js
                         } else {
                              logger.info(' ICDriver.js Line #615 /driFee  ' + trucks);
                              res.json({ msg: 'Our', Fee: trucks });
                         }
                    })
               } else {
                    logger.info(' ICDriver.js Line #620 /driFee  ' + trucks);
                    res.json({ msg: 'IC', Fee: driFee });
               }
          }
     })
})

router.post('/driStatements', (req, res, next) => {
     statement.find({ DriverName: req.body.driver_name }, function (err, apayments) {
          var msg = 'View all Driver Statements ' + req.body.dirName
          logActivity(req.body.user, req.body.role, timestamp, 'View All Driver Statements', msg)
          logger.info(' ICDriver.js Line #629 /driStatements  ' + apayments);
          res.json(apayments);
     })
})

router.get('/ViewAllStatements', (req, res, next) => {
     statement.find({ status: 'Created' }, function (err, apayments) {
          var msg = 'View all Statements ' + req.body.dirName
          logActivity(req.body.user, req.body.role, timestamp, 'View All Statements', msg)
          logger.info(' ICDriver.js Line #636 /ViewAllStatements  ' + apayments);
          res.json(apayments);
     })
})

router.post('/newStatement', (req, res, next) => {
     let newSt = new statement({
          DriverID: req.body.DriverId,
          DriverName: req.body.DriverName,
          date: req.body.date,
          status: req.body.status,
          statementId: req.body.statementId,
          updatedBy: req.body.updatedby,
          statementDate: req.body.statementDate,
          Total: req.body.Total,
          check: req.body.checkNum,
          details: req.body.details,
          qty: req.body.qty
     });
     newSt.save((err, statement) => {
          if (err) {
               logger.error('ICDriver.js Line #656 /newStatement' + err);
               res.json({ err, msg: 'error' });
          } else {
               logger.info(' ICDriver.js Line #659 /newStatement  ' + statement);
               var details = req.body.details
               for (var i = 0; i < Object.keys(details).length; i++) {
                    ftb.updateOne({ Fright_Bill: details[i].ftb }, { $set: { payables: req.body.payables } }, function (err, result) {
                         if (err) {
                              logger.error('ICDriver.js Line #664 /newStatement' + err);
                              error = true
                         } else {
                              logger.info(' ICDriver.js Line #667 /newStatement  ' + result);
                         }
                    })
                    Apayble.updateOne({ Fright_Bill: details[i].ftb }, { $set: { statementId: req.body.statementId } }, function (err, ar) {
                         if (err) {
                              logger.error('ICDriver.js Line #664 /newStatement' + err);
                              error = true
                         } else {
                              logger.info(' ICDriver.js Line #667 /newStatement  ' + ar);
                         }
                    })
               }
               var msg = 'Create New Driver Statements ' + req.body.DriverName
               logActivity(req.body.user, req.body.role, timestamp, 'Create Driver Statements', msg)
               res.json({ msg: 'success' });
          }
     })
})

router.post('/updatedStatement', (req, res, next) => {
     var ftb = req.body.ftbs
     var result = true;

     for (var i = 0; i < ftb.length; i++) {
          Apayble.updateOne({ Fright_Bill: ftb[i] }, { $set: { status: 'Paid', updatedDate: req.body.updatedDate, updatedBy: req.body.updatedby } }, function (err, result) {
               if (err) {
                    logger.error('ICDriver.js Line #683 /updatedStatement' + err);
                    res.json(err);
               } else {
                    logger.info(' ICDriver.js Line #686 /updatedStatement  ' + result);
               }
          })
     }
     var msg = 'Update Driver Statements ' + req.body.ftb
     logActivity(req.body.user, req.body.role, timestamp, 'Update Driver Statements', msg)
     res.json({ msg: 'success', ftbStat: result });
})

router.post('/getStmt', (req, res, next) => {
     statement.find({ statementId: req.body.stmtId }, function (err, ICDrivers) {
          var msg = 'View Statement ' + req.body.stmtId
          logActivity(req.body.user, req.body.role, timestamp, 'View Statements', msg)
          logger.info(' ICDriver.js Line #17 /drivers  ' + ICDrivers);
          res.json(ICDrivers);
     })
})
router.post('/stmtArch', async (req, res, next) => {
     /* statement.updateOne({ statementId: req.body.id }, { $set: { status: 'Archieve' } }, function (err, ICDrivers) {
          if (err) {
          } else {
               logger.info(' ICDriver.js Line #17 /drivers  ' + ICDrivers);
               Apayble.updateMany({ statementId: req.body.id }, { $set: { status: 'Created' } }, function (err, ap) {
                    if (err) {
                    } else {
                         logger.info(' ICDriver.js Line #17 /drivers  ' + ap);
                    }
               })
          }
     }) */
     const [results, bills] = await Promise.all([
          statement.updateOne({ statementId: req.body.id }, { $set: { status: 'Archieve' } }),
          bill.updateMany({ 'payables.statementId': req.body.id }, { $set: { payables: null } })
     ])
     var msg = 'Archieve Statement ' + req.body.id
     logActivity(req.body.user, req.body.role, timestamp, 'Archieve Statements', msg)
     res.json({ stmt: results, ftbills: bills });
})

var icdProfilePicStorage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, '../etrucking_ui/uploads/icdriver/icdProfilePic')
     },
     filename: function (req, file, cb) {
          cb(null, Date.parse(new Date()) + '-' + file.originalname)
     }
})

var icdProfilePic = multer({ storage: icdProfilePicStorage })
router.post('/icdProfilePic', icdProfilePic.single('picture'), (req, res) => {
     var img = fs.readFileSync(req.file.path);
     var encode_image = img.toString('base64');
     // Define a JSONobject for the image attributes for saving to database
     Driver.updateOne({ ICdriver_name: req.body.name }, {
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

var icdTrInStorage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, '../etrucking_ui/uploads/icdriver/icdDocs')
     },
     filename: function (req, file, cb) {
          cb(null, Date.parse(new Date()) + '-' + file.originalname)
     }
})

var icdTrIn = multer({ storage: icdTrInStorage })
router.post('/icdTrIn', icdTrIn.single('trin'), (req, res) => {
     var img = fs.readFileSync(req.file.path);
     var encode_image = img.toString('base64');
     // Define a JSONobject for the image attributes for saving to database
     Driver.updateOne({ ICdriver_name: req.body.name }, {
          $set: {
               TrInPic: req.file.path,
               TrInExp: req.body.TrInExpDate,
               TrIn: true
          }
     }, function (err, result) {
          if (err) {
               res.json('Error');
          } else {
               res.json('success');
          }
     })
})
var icdWoCoStorage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, '../etrucking_ui/uploads/icdriver/icdDocs')
     },
     filename: function (req, file, cb) {
          cb(null, Date.parse(new Date()) + '-' + file.originalname)
     }
})

var icdWoCo = multer({ storage: icdWoCoStorage })
router.post('/icdWoCo', icdWoCo.single('WoCo'), (req, res) => {
     var img = fs.readFileSync(req.file.path);
     var encode_image = img.toString('base64');
     // Define a JSONobject for the image attributes for saving to database
     Driver.updateOne({ ICdriver_name: req.body.name }, {
          $set: {
               WoCoPic: req.file.path,
               WoCoExp: req.body.WoCoExpDate,
               WoCo: true
          }
     }, function (err, result) {
          if (err) {
               res.json('Error');
          } else {
               res.json('success');
          }
     })
})
var icdMoCaPeStorage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, '../etrucking_ui/uploads/icdriver/icdDocs')
     },
     filename: function (req, file, cb) {
          cb(null, Date.parse(new Date()) + '-' + file.originalname)
     }
})

var icdMoCaPe = multer({ storage: icdMoCaPeStorage })
router.post('/icdMoCaPe', icdMoCaPe.single('MoCaPe'), (req, res) => {
     var img = fs.readFileSync(req.file.path);
     var encode_image = img.toString('base64');
     // Define a JSONobject for the image attributes for saving to database
     Driver.updateOne({ ICdriver_name: req.body.name }, {
          $set: {
               MoCaPePic: req.file.path,
               MoCaPeExp: req.body.MoCaPeExpDate,
               MoCaPe: true
          }
     }, function (err, result) {
          if (err) {
               res.json('Error');
          } else {
               res.json('success');
          }
     })
})
var icdSuAgStorage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, '../etrucking_ui/uploads/icdriver/icdDocs')
     },
     filename: function (req, file, cb) {
          cb(null, Date.parse(new Date()) + '-' + file.originalname)
     }
})

var icdSuAg = multer({ storage: icdSuAgStorage })
router.post('/icdSuAg', icdSuAg.single('SuAg'), (req, res) => {
     var img = fs.readFileSync(req.file.path);
     var encode_image = img.toString('base64');
     // Define a JSONobject for the image attributes for saving to database
     Driver.updateOne({ ICdriver_name: req.body.name }, {
          $set: {
               SuAgPic: req.file.path,
               SuAgExp: req.body.SuAgExpDate,
               SuAg: true
          }
     }, function (err, result) {
          if (err) {
               res.json('Error');
          } else {
               res.json('success');
          }
     })
})
var icdDrPrStorage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, '../etrucking_ui/uploads/icdriver/icdDocs')
     },
     filename: function (req, file, cb) {
          cb(null, Date.parse(new Date()) + '-' + file.originalname)
     }
})

var icdDrPr = multer({ storage: icdDrPrStorage })
router.post('/icdDrPr', icdDrPr.single('DrPr'), (req, res) => {
     var img = fs.readFileSync(req.file.path);
     var encode_image = img.toString('base64');
     // Define a JSONobject for the image attributes for saving to database
     Driver.updateOne({ ICdriver_name: req.body.name }, {
          $set: {
               DrPrPic: req.file.path,
               DrPrExp: req.body.DrPrExpDate,
               DrPr: true
          }
     }, function (err, result) {
          if (err) {
               res.json('Error');
          } else {
               res.json('success');
          }
     })
})
var icdGeLiStorage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, '../etrucking_ui/uploads/icdriver/icdDocs')
     },
     filename: function (req, file, cb) {
          cb(null, Date.parse(new Date()) + '-' + file.originalname)
     }
})

var icdGeLi = multer({ storage: icdGeLiStorage })
router.post('/icdGeLi', icdGeLi.single('GeLi'), (req, res) => {
     var img = fs.readFileSync(req.file.path);
     var encode_image = img.toString('base64');
     // Define a JSONobject for the image attributes for saving to database
     Driver.updateOne({ ICdriver_name: req.body.name }, {
          $set: {
               GeLiPic: req.file.path,
               GeLiExp: req.body.GeLiExpDate,
               GeLi: true
          }
     }, function (err, result) {
          if (err) {
               res.json('Error');
          } else {
               res.json('success');
          }
     })
})
var icdupdateDLStorage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, '../etrucking_ui/uploads/icdriver/icdDocs')
     },
     filename: function (req, file, cb) {
          cb(null, Date.parse(new Date()) + '-' + file.originalname)
     }
})

var icdupdateDL = multer({ storage: icdupdateDLStorage })
router.post('/icdupdateDL', icdupdateDL.single('dl'), (req, res) => {
     var img = fs.readFileSync(req.file.path);
     var encode_image = img.toString('base64');
     // Define a JSONobject for the image attributes for saving to database
     Driver.updateOne({ ICdriver_name: req.body.name }, {
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

router.post('/appDriUpdate', (req, res, next) => {
     if (req.body.isBroker) {
          Driver.updateOne({ ICdriver_name: req.body.driver_name }, {
               $set:
               {
                    zip: req.body.zip,
                    street_name: req.body.street_name,
                    address: req.body.address,
                    state: req.body.state,
                    city: req.body.city,
                    zip: req.body.zip,
                    phone: req.body.phone,
                    email: req.body.email,
               }
          }, function (err, ICDrivers) {
               if (err) {
                    logActivity(req.body.driver_name, 'IC Driver', new Date(), 'error ', err)
                    res.json('err')
               } else {
                    res.json('success')
                    logActivity(req.body.driver_name, 'IC Driver', new Date(), 'IC Driver details updated from the app', JSON.stringify(ICDrivers))
               }
          })
     } else {
          emp.updateOne({ empName: req.body.driver_name }, {
               $set: {
                    empEmail: req.body.email,
                    empPhone: req.body.phone,
                    city: req.body.city,
                    zip: req.body.zip,
                    street_name: req.body.street_name,
                    state: req.body.state,
                    address: req.body.address,
               }
          }, function (err, result) {
               if (err) {
                    logActivity(req.body.driver_name, 'Emp Driver', new Date(), 'error ', err)
                    res.json('err')
               } else {
                    logActivity(req.body.driver_name, 'Emp Driver', new Date(), 'IC Driver details updated from the app', JSON.stringify(result))
                    res.json('success')
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

module.exports = router;
