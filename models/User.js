const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 200,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    accountCreated:
    {
        type: Date,
        default: Date.now,
    },
    birthday:{
        type: Date,
        required: false,
        private:{ Boolean: true, },
    },
    weight:{
        //metric
        type: Number,
        required: false,
    },
    height:{
        type: Number,
        required: false,
    },
    friends:[
    {
        username:{
         type: String,
         required: true,            
        }
    }],
    public:{
        type: Boolean,
        default: true,
    },
    admin:{
      type: Boolean,
      default: false,
    },
    superAdmin:{
        type:Boolean,
        default: false
    }
    
});

module.exports = mongoose.model('User', userSchema);