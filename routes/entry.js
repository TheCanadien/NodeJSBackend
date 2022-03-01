const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const Entry = require('../models/Entry');
const verify = require('../verifyToken');
const User = require('../models/User');


//Get all entries
/*
router.get('/', async (req,res) =>{

  

    try{
       const entry = await Entry.find();
       res.json(entry);
    }catch(err){
    res.json({message: err});
    }
    });
*/


router.get('/', verify, async(req,res) =>{
 
  try{
  const validUser = await User.findOne({name: req.user.name});
  console.log(validUser);  
res.json(validUser.name);
  }
  catch(err){
  res.json({messsage: err})
  }
})





 //Submits first meal in a day data
router.post('/', verify, async (req,res)=>{
  //console.log(req.body.food_item[0].calories);


    const entry = new Entry({
     user_name: req.user.name,
     food_item: req.body.food_item,
     date: new Date(req.body.date),
     weight: req.body.weight,
  
     total_calories: req.body.food_item[0].calories,
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
  
try{
const friend = await User.findOne({name: req.params.username, "friends.username" : req.user.name});
  const isAdmin = await User.findOne({name: req.user.name});

  if(req.user.name !== req.params.username && isAdmin.admin === false && !friend){
    return res.status(400).send("You don't have access");  
  }
      const queryDate = new Date(req.params.date);
      const nextDate = new Date(queryDate);
      nextDate.setDate(queryDate.getDate() + 1);
      const searchQuery = {date: {$lt : nextDate, $gte : queryDate},user_name : req.params.username};
      const entry = await Entry.find(searchQuery);
      const obj = entry[0];
      console.log('here');
      console.log(obj);
     res.json(obj);
      }
      catch(err){
        res.json({message: err})
      
}
  });

//Get meal data over duration of time
router.get('/:date/:date2/:username', verify, async (req,res) =>{
  const friend = await User.findOne({name: req.params.username, "friends.username" : req.user.name});
  const isAdmin = await User.findOne({name: req.user.name});

  if(req.user.name !== req.params.username && isAdmin.admin === false && !friend){
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

  const reducecalories = req.body.reducecals;
  console.log(reducecalories);

  if(req.user.name !== req.params.username){
    return res.status(400).send("You don't have access")
  }

    try{
      const queryDate = new Date(req.params.date)
      const nextDate = new Date(queryDate)
      nextDate.setDate(queryDate.getDate() + 1)
     const removeEntry = await Entry.findOneAndUpdate({date: {$lt : nextDate, $gte : queryDate},
      user_name : req.params.username},
       {$pull: {"food_item": {"meal_number" : req.params.mealnum}}});
       console.log(removeEntry);
       removeEntry.total_calories = parseInt(removeEntry.total_calories) - parseInt(reducecalories);
       await removeEntry.save();
       const updatedEntry = await Entry.findOne({date: {$lt : nextDate, $gte : queryDate},
        user_name : req.params.username});
       res.json(updatedEntry);
    }
    
    catch(err){
      res.json({message: err})
    }
    });
  
//deletes food_item object   
router.delete('/:date/:username', verify, async (req,res) => {

  if(req.user.name !== req.params.username){
    return res.status(400).send("You don't have access")
  }

    try{

       console.log(req.params.username);
      console.log(req.params.date);



        const queryDate = new Date(req.params.date)
        const nextDate = new Date(queryDate)
        nextDate.setDate(queryDate.getDate() + 1)  
       const removeEntry = await Entry.deleteOne({date: {$lt : nextDate, $gte : queryDate},
        user_name : req.params.username, "food_item":{ $size : 1}});
         res.json(removeEntry);
      }
      
      catch(err){
        res.json({message: err})
      }
});    
    
    




module.exports = router;
