require('dotenv').config();

const router = require('express').Router();
const User = require('../models/User');
const { loginValidation, registerValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Valid = require('../models/Valid');


//register user
router.post('/register', async (req, res) => {
     //validate user input 
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user is in database
    const userNameExists = await User.findOne({ name: req.body.name });
    const userEmailExists = await User.findOne({ email: req.body.email });
    
    if (userNameExists) return res.status(400).send("Username already exists");

    if (userEmailExists) return res.status(400).send("Email already exists");
//salt and then encrypt password for storage in DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //Create new user
    const user = new User({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
        accountCreated: Date.now(),
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user.name});
    } catch (err) {
        res.status(400).send(err);
    }
});


//Log user in and assign JWT token
router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //Checking if username exists
    const user = await User.findOne({ name: req.body.name });
    if (!user) return res.status(400).send("Username or password is invalid!");
    //Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Username or password is invalid!");

    const loguser = {name: user.name};

    //Create and assign tokens
   const accesstoken = jwt.sign(loguser, process.env.TOKEN_SECRET, {expiresIn: '1m' });
    const refreshtoken = jwt.sign(loguser, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '120m'});

   res.cookie('auth-token', refreshtoken, {httpOnly: true, sameSite: 'lax'}).send({accesstoken});

});


/*
//Log user in and assign JWT token
router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //Checking if username exists
    const user = await User.findOne({ name: req.body.name });
    if (!user) return res.status(400).send("Username or password is invalid!");
    //Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Username or password is invalid!");

    const loguser = {name: user.name};

    //Create and assign tokens
    const accesstoken = jwt.sign(loguser, process.env.TOKEN_SECRET, {expiresIn: '1m' });
    const refreshtoken = jwt.sign(loguser, process.env.REFRESH_TOKEN_SECRET);

   
    const validtoke = new Valid(
    {
    valid:{     
    username: user.name,    
    token : refreshtoken
     }});


    //console.log(user.name);
    const findValid = await Valid.findOne({"valid.username": user.name});

//    console.log(findValid + "find valid");
   // console.log('-----------------------------------------------------------------');
    //console.log('-----------------------------------------------------------------');
    if(findValid){
         await Valid.deleteOne({username: user.name});

    }

    const val = await validtoke.save();
    //
     console.log(val + "save valid");
  //  res.header('auth-token', refreshtoken).send({accesstoken});
   res.cookie('auth-token', refreshtoken, {httpOnly: true, sameSite: 'lax'}).send({accesstoken});
//      res.cookie('acookie', 'cookiecookie').send({accesstoken});

});
*/

/*
router.post('/logout', async (req,res) =>
{
 const token = req.cookies['auth-token'];
 try{
 const deleteValid = await Valid.deleteOne({token: token});
  res.status(200).send('Successful logout');
 }
 catch(err){
     res.status(403).send('Could not logout');
 }
});
*/



module.exports = router;
