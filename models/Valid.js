
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema ({
 valid: {
 username:{
   type: String,
   required: true
 },
 
 token:{
       type: String,
       required: true
 }
}
   })


module.exports = mongoose.model('valid', tokenSchema);