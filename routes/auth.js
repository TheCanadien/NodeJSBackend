require('dotenv').config();

//
const router = require('express').Router();
const User = require('../models/User');
const { loginValidation, registerValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {


    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user is in database
    const userNameExists = await User.findOne({ name: req.body.name });
    const userEmailExists = await User.findOne({ email: req.body.email });
    //
    if (userNameExists) return res.status(400).send("Username already exists");

    if (userEmailExists) return res.status(400).send("Email already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user.name});
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //Checking if username exists
    const user = await User.findOne({ name: req.body.name });
    if (!user) return res.status(400).send("Username is not found");
    //Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid password");


    //Create and assign token
    const token = jwt.sign({ name: user.name }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});


module.exports = router;