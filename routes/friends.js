const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verify = require('../verifyToken');

//add friends
router.post('/', verify, async (req,res) =>{

const exists = await User.findOne({name: req.body.friends});
const alreadyfriend = await User.findOne({name: req.user.name, "friends.username" : req.body.friends});
if(!exists || alreadyfriend){
    return res.status(401).send('Unable to add friend');
}
try{
const friend = await User.updateOne({name:req.user.name}, {$addToSet:{friends:{username : req.body.friends}}});
res.send(friend);
}
catch(err){
    res.status(404).send('Unable to process request');
}




});
//get friend data
router.get('/:username', verify, async (req,res) =>{

  const user = await User.findOne({name: req.params.username});
  const friendlist = user.friends.map(x => x.username);
  if(!friendlist.includes(req.user.name)) return res.status(404).send('You don\'t have access');
  try{
  const info = 
    {
    "username":user.name,    
    "birthday" :user.birthday,
    "weight" :user.weight,
    "height" :user.height,
    "public" :user.public,
    "friends" : friendlist,
    }
   res.json(info);
}
catch(err){
    res.status(404).send('Not Found');
}

});

//delete friend
router.delete('/', verify, async (req, res) =>{

    try{  
const removedFriend = await User.updateOne({name: req.user.name}, {$pull:{ friends :{username: req.body.username}}});
res.json(removedFriend);
    }
    catch(err){
        res.status(404).send('Not found');
    }
});











module.exports = router;