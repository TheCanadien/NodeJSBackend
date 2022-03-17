const jwt = require('jsonwebtoken');
const Valid = require('./models/Valid');
const express = require('express');
const app = express();

module.exports = async function (req, res, next) {
    const accessToken = req.header('Authorization');

/////////////////////////////////////////
    //If access token doesn't exist
    if (!accessToken) return res.status(401).send('Access Denied');
       const verified = validatedToken(accessToken, process.env.TOKEN_SECRET);
       //if token is valid
       if(verified)
       {
        req.user = verified;
        next();
       }  
       else{
         res.status(400).send('You do not have access');
       }   
}

function validatedToken(token, secretkey){
   try{
      return jwt.verify(token, secretkey);
   }
 catch(err){
     return null;
 }
 }


