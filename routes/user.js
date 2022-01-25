const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verify = require('../verifyToken');


//update personal data
router.patch('/', verify, async (req,res) =>{
 try{
 const myaccount = await User.updateOne({ name: req.user.name }, 
    {$set: {weight: req.body.weight, birthday: req.body.birthday, height: req.body.height, public: req.body.public}});
    res.send(myaccount);
 }
 catch(err){
     res.status(404).send('Not Found');
 }

}
);

//get personal data
router.get('/', verify, async (req,res) =>{
    console.log(req.user.name);
    try{
    const myaccount = await User.findOne({ name: req.user.name });
    const friendlist = myaccount.friends.map(x => x.username);
    const info = 
    {
    "username": myaccount.name,    
    "birthday" : myaccount.birthday,
    "weight" : myaccount.weight,
    "height" : myaccount.height,
    "public" : myaccount.public,
    "friends" : friendlist,
    }

    res.json(info);
}
catch(err){
   res.json({message: err});
}
   }
   );




module.exports = router;