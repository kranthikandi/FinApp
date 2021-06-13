const express = require('express');
const router = express.Router();
const contact = require('../modals/contactModal')

router.post('/ccForm', (req, res, next) => {
    let newContact = new contact({
        Time: req.body.time,
        Name: req.body.name,
        Email: req.body.email,
        Message: req.body.message
    });
    newContact.save((err, Driver) => {
        if (err) {
            res.json({ msg: 'Something went wrong. Please try again.' });
        } else {
            res.json({ msg: 'success' });
        }
    })
})

module.exports = router;