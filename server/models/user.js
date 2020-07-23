const mongoose = require('mongoose');

const userSchema = mongoose.Schema({ //create schema before putting model in
    //userSchema's configuration
    email: {//the key of our entry
        type: String,
        required: true,
        trim: true, // no whitespaces
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 100
    },
    cart: {//user shops and can add an items to the cart
        type: Array,
        default: [] //nothing
    },
    history: {
        type: Array,
        default: []
    },
    role: { //users(0) and admins(1)
        type: Number,
        default: 0 // default: user
    },
    token: {
        type: String

    }
})

//create the 'User' model
const User = mongoose.model('User', userSchema) //export userSchema to use it on the server 

module.exports = { User }