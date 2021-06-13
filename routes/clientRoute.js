const express = require('express');
const router = express.Router();
const cli = require('../modals/client')


//reterving data
router.post('/thisCli', (req, res, next) => {
    console.log(req.body)
    cli.find({ clientName: req.body.name, entityType: req.body.entityType, typeOfAccount: req.body.toAccount }, function (err, Customer) {
        if (err) {
        }
        res.json(Customer);
    })
})
//add contact
router.post('/newCli', (req, res, next) => {
    let newCustomer = new cli({
        clientName: req.body.name,
        date: req.body.date,
        typeOfAccount: req.body.typeOfAccount,
        entityType: req.body.entityType,
        notes: req.body.note,
        amount: req.body.amount
    });
    newCustomer.save((err, cli) => {
        if (err) {
            response = {
                'error': 45233
            }

        }
        res.json({ msg: 'success' });
    })
})

router.post('/postDebit', (req, res, next) => {
    let newCustomer = new cli({
        clientName: req.body.name,
        date: req.body.date,
        typeOfAccount: req.body.typeOfAccount,
        entityType: req.body.entityType,
        notes: req.body.note,
        amount: req.body.amount
    });
    newCustomer.save((err, cli) => {
        if (err) {
            response = {
                'error': 45233
            }

        }
        res.json({ msg: 'success' });
    })
})

module.exports = router;