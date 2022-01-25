const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verify = require('../verifyToken');


//Assign admin
router.post('/assign', verify, async (req, res) =>
{
    try{
    const anAdmin = await User.findOne({name: req.user.name});
    if(!anAmin || anAdmin.superAdmin !== true){
    res.status(401).send('Not authorized');
    }
    const user = await User.updateOne({name: req.body.name}, {$set : {admin: true}});
    res.json(user);
}
catch(err){
    res.status(404).send("Can not process request");
}

});

//Creates Superadmin
router.post('/createsadmin', verify, async (req,res) =>
{
    try{
    const anAdmin = await User.findOne({superAdmin: true});
    if(!anAdmin)
    {
     const user = await User.updateOne({name: req.user.name}, {$set : {superAdmin: true, admin: true}});
     const deleteDum = await User.deleteOne({name: "DummyAcc"});
     res.json(user);
    }
    else{
        res.send('First admin already exists');
    }
}
catch(err){
    res.status(404).send('Could not process request');
}
});

//Check if Superadmin account exists
router.get('/existssadmin', async(req, res) =>{
     try{
    const anAdmin = await User.findOne({superAdmin: true});
    if(!anAdmin){
    res.send('No SuperAdmin Exists');
    }
    else{
       res.send('SuperAdmin Exists'); 
    }
     }
     catch(err){
         res.status(404).send('Can not access');
     }
});

//Remove admin status
router.post('/unassign', verify, async(req, res) =>{
//
try{
    const anAdmin = await User.findOne({name: req.user.name});
    if(!admin || anAdmin.superAdmin !== true){
    res.status(401).send('Not authorized');
    }
    const user = await User.updateOne({name: req.body.name}, {$set : {admin: false}});
    res.json(user);
}
catch(err){
    res.status(404).send("Can not process request");
}
});

//Get all users and admin status
router.get('/users', verify, async (req,res) =>
{
    const user = await User.findOne({name: req.user.name});

    if(!user || user.admin !== true)
    {
       res.status(401).send('You do not have access');
   }

try{
const usersList = await User.find({}, {_id: 0, name:1, admin:1});
res.json(usersList);
}
catch(err)
{
 res.status(404).send('Could not process request');
}

});



module.exports = router;