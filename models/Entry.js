const mongoose = require('mongoose');


const EntrySchema = mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    food_item :[
    {
    food_description: {type: String, required: true},
    meal_number:{type: Number,required: true},
    calories:{type: Number,required: true},
    fats:{type: Number,required: false},
    carbs:{type:Number,required: false},
    protein:{type:Number,required:false},
    }],

    date: {
        type: Date,
        default: Date.now
    },

    weight:{
        type: Number,
        required: false
    },
    total_calories:{
        type: Number,
        required: false
    }


});










module.exports = mongoose.model('Entries', EntrySchema);