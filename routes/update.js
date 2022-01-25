const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const Entry = require('../models/Entry');
const verify = require('../verifyToken');

//Add next meal data by date and username
router.patch('/:date/:username', verify, async (req,res) =>{
   
  if(req.user.name !== req.params.username){
    return res.status(400).send("You don't have access")
  }
    try{
  
     const queryDate = new Date(req.params.date)
      const nextDate = new Date(queryDate)
      nextDate.setDate(queryDate.getDate() + 1)
     const newEntry = await Entry.updateOne({date: {$lt : nextDate, $gte : queryDate},
      user_name : req.params.username},
       {$addToSet: {food_item: req.body.food_item}});
       res.json(newEntry);
    }catch(err){
      res.json({message: err})
    }
    
    });


//Update specific meal data
router.patch('/:date/:username/:mealnum', verify, async (req,res) =>{

  if(req.user.name !== req.params.username){
    return res.status(400).send("You don't have access")
  }


    try{
     
     const queryDate = new Date(req.params.date)
      const nextDate = new Date(queryDate)
      nextDate.setDate(queryDate.getDate() + 1)
     const updateEntry = await Entry.updateOne({date: {$lt : nextDate, $gte : queryDate},
      user_name : req.params.username},
       {$set: {"food_item.$[elem]": req.body.food_item}},
       { arrayFilters: [ { "elem.meal_number":  req.params.mealnum  } ] } );
       res.json(updateEntry);
    }catch(err){
      res.json({message: err})
    }
    
    });    





module.exports = router;
