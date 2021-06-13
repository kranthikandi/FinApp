const express = require('express');
const router = express.Router();
const Truck = require('../modals/truck_modal');
const Trailer = require('../modals/trailer_modal');

//reterving data
router.get('/trucks', (req, res, next)=>{
    Truck.find(function(err,driver_details){
         res.json(driver_details);
    })
})

// //get trucks
// router.post('/trucks',(req, res, next)=>{
//     console.log("request for /trucks"+req.body.trucks)

//     Jobs.find({ equp_type: req.body.trucks }, function (err, result) {
//     if(err){
//         console.log("error for /trucks"+result)
//         res.json(err);
//    }else{
//         console.log("response body for /trucks"+result)
//         res.json(result);
//    }
//     })
// })


router.get('/trailers', (req, res, next)=>{
    Trailer.find(function(err,driver_details){
         res.json(driver_details);
    })
})


//add truck
router.post('/newtruck',(req, res, next)=>{
    let newTruck = new Truck({
        truck_number : req.body.truck_number,
        truck_type : req.body.truck_type,
        days_on_field : req.body.days_on_field,
        milage : req.body.milage,
        status : req.body.status
    });
    newTruck.save((err,Truck)=>{
        if(err){
            res.json({msg: 'failed'});
        }else{
             res.json({msg: 'success'});
        }
    })
})

//add truck
router.post('/newtrailer',(req, res, next)=>{
    let newTrailer = new Trailer({
        trailer_number : req.body.trailer_number,
        last_used : req.body.last_used,
        days_on_field : req.body.days_on_field,
        status : req.body.status,
    });
    newTrailer.save((err,Trailer)=>{
        if(err){
            res.json({msg: 'failed'});
        }else{
            console.log("success")
             res.json({msg: 'success'});
        }
    })
})

//delete truck
router.delete('/truck/:id',(req, res, next)=>{
    Truck.remove({_id: req.params.id}, function (err, result){
           if(err){
                res.json(err);
           }else{
               res.json({msg:'Success'});
           }
       })
})

module.exports = router;
