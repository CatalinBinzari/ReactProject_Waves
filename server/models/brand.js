const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique: 1,
        maxlength: 100
    }
})

const Brand = mongoose.model('Brand', userSchema) //creating brand based on schema 
module.exports = { Brand }