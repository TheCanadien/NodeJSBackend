const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verify = require('../verifyToken');

router.get('/', verify, async (req, res)  =>  {

  //console.log(req.body.search_term);
/*
    const users = await User.aggregate([{$search: {autocomplete :{query: req.body.search_term, path: "name"}}},
     {$limit: 5}, {$project: {_id: 0, name:1}}]);
  */
 try{
     const agg = [
        {$search: {autocomplete: {query: req.body.search_term, path: "name"}}},
        {$limit: 5},  {$project: {_id: 0, name: 1}}];

     const users = await User.aggregate(agg);
     res.json(users);
     }
     catch(err){
         res.status(400).send('can\'t do it');
     }

});

//get user data
router.get('/:username', verify, async (req,res) =>{

  const admin = await User.findOne({name: req.user.name});
  const user = await User.findOne({name: req.params.username});
  const friendlist = user.friends.map(x => x.username);
  if(user.public === false && admin.admin === false) return res.status(404).send('You don\'t have access');
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







module.exports = router;



