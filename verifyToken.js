const jwt = require('jsonwebtoken');
const Valid = require('./models/Valid');
const express = require('express');
const app = express();

//test
module.exports = async function (req, res, next) {
   const token = req.cookies['auth-token'];
    const accessToken = req.header('Authorization');
//////////////////////////////////////////////////////////
//console.log(req.header('Authorization'));
//console.log(req.params);
//console.log('Cookies: ',req.cookies['auth-token'])
console.log("here is token" + " " + token );


/////////////////////////////////////////
    //If access token doesn't exist
    if (!accessToken) return res.status(401).send('Access Denied');
       const verified = validatedToken(accessToken, process.env.TOKEN_SECRET);
       console.log('1 ', accessToken);
       //if token is valid
       if(verified)
       {
        req.user = verified;
        console.log('2 ', accessToken);
        next();
        }else{
        //if refresh token doesn't exist
        if(!token) return res.status(401).send('Access Denied');
        console.log('3 ', token);
        //check refresh is in valid collection
        const checkValid = await Valid.findOne({"valid.token": token});
       console.log(checkValid);

       if(checkValid){
        //console.log(checkValid.valid.username);
        console.log('4');
        renewTokens(checkValid.valid.username, res);
       }
       else{
          res.status(400).send('You do not have access');
       }

       }
      
       
}


//Works
function validatedToken(token, secretkey){
    try{
       return jwt.verify(token, secretkey);
    }
  catch(err){
      return null;
  }
  }

  async function renewTokens(user_name, res){
  
    //Create and assign tokens
    const loguser = {name: user_name};


    const accesstoken = jwt.sign(loguser, process.env.TOKEN_SECRET, {expiresIn: '1m' });
    const refreshtoken = jwt.sign(loguser, process.env.REFRESH_TOKEN_SECRET);
    const validtoke = new Valid(
        {
        valid:{     
        username: user_name,    
        token : refreshtoken
         }});
        const findValid = await Valid.findOne({username: user_name});
       console.log(findValid);
        if(findValid){
             await Valid.deleteOne({username: user_name});
           console.log("deleted");
        }
    
        const val = await validtoke.save();
        //console.log('5');
        res.cookie('auth-token', refreshtoken, {httpOnly: true, sameSite: 'lax'}).send({accesstoken});
}
