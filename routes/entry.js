const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const Entry = require('../models/Entry');
const verify = require('../verifyToken');

//Get all entries
router.get('/', async (req,res) =>{
    try{
       const entry = await Entry.find();
       res.json(entry);
    }catch(err){
    res.json({message: err});
    }
    });

 //Submits first meal in a day data
router.post('/', verify, async (req,res)=>{

    const entry = new Entry({
     user_name: req.user.name,
     food_item: req.body.food_item,
     date: new Date(req.body.date),
     weight: req.body.weight,
    });
  try{
    const savedEntry = await entry.save();
      res.json(savedEntry);
  }catch(err){
    res.json({message: err});
  }
  });  

  //Get meal data entries by date and username
router.get('/:date/:username', verify, async (req,res) =>{
    if(req.user.name !== req.params.username){
      return res.status(400).send("You don't have access")
    }

    try{
  
      const queryDate = new Date(req.params.date)
      const nextDate = new Date(queryDate)
      nextDate.setDate(queryDate.getDate() + 1)
      const searchQuery = {date: {$lt : nextDate, $gte : queryDate},user_name : req.params.username}
      const entry = await Entry.find(searchQuery)
     res.json(entry);
      }
      catch(err){
        res.json({message: err})
      }
  });

//Get meal data over duration of time
router.get('/:date/:date2/:username', verify, async (req,res) =>{
  if(req.user.name !== req.params.username){
    return res.status(400).send("You don't have access")
  }

    try{
  
      const queryDate = new Date(req.params.date)
      const nextDate = new Date(req.params.date2)
      nextDate.setDate(nextDate.getDate() + 1)
    
      const entry = await Entry.find({date: {$lt : nextDate, $gte : queryDate},
         user_name : req.params.username})
  
      res.json(entry);
      }
      catch(err){
        res.json({message: err})
      }
  });

//Delete specific meal data
router.patch('/:date/:username/:mealnum', verify, async (req,res) =>{

  if(req.user.name !== req.params.username){
    return res.status(400).send("You don't have access")
  }

    try{
      const queryDate = new Date(req.params.date)
      const nextDate = new Date(queryDate)
      nextDate.setDate(queryDate.getDate() + 1)
     const removeEntry = await Entry.updateOne({date: {$lt : nextDate, $gte : queryDate},
      user_name : req.params.username},
       {$pull: {"food_item": {"meal_number" : req.params.mealnum}}});
       res.json(removeEntry);
    }
    
    catch(err){
      res.json({message: err})
    }
    });
  
//deleteobject    
router.delete('/:date/:username', verify, async (req,res) => {

  if(req.user.name !== req.params.username){
    return res.status(400).send("You don't have access")
  }

    try{
        const queryDate = new Date(req.params.date)
        const nextDate = new Date(queryDate)
        nextDate.setDate(queryDate.getDate() + 1)  
       const removeEntry = await Entry.deleteOne({date: {$lt : nextDate, $gte : queryDate},
        user_name : req.params.username, "food_item":{ $size : 0}});
         res.json(removeEntry);
      }
      
      catch(err){
        res.json({message: err})
      }
});    
    
    




module.exports = router;