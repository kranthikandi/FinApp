const express = require('express');
const router = express.Router();
const svcc = require('../modals/svcc_modal')




//add contact
router.post('/svcc18',(req, res, next)=>{
    let newReq = new svcc({
        full_name : req.body.fullname,
        email : req.body.email,
        phone : req.body.phone,
        request : req.body.request
    }); 
    console.log("req ++++"+ req);
    newReq.save((err,Driver)=>{
        if(err){
            res.json({msg: 'fail'});
        }else{
             res.json({msg: 'success'});
        }
    })
})

module.exports = router;
