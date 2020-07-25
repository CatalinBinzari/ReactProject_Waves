const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_I = 10;
require('dotenv').config();
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

userSchema.pre('save', function (next) {//next will do the rest of .save() function
    var user = this;//we made refference to userSchema

    if (user.isModified('password')) { //check if users tryes to modify the passwd
        bcrypt.genSalt(SALT_I, function (err, salt) {
            if (err) return next(err);
            //next kills everything what we are doing there, and moves forward

            bcrypt.hash(user.password, salt, function (err, hash) {
                //callback function
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next()
    }

}) //before we do anything, we specify what we do it first, before .save(), we will do .pre()

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    //cb is callback, function, after we match passwd or not
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch)
    }) //this.password is user password
}

userSchema.methods.generateToken = function (cb) {
    var user = this; //user is now equal with this, to use the user inside the function
    var token = jwt.sign(user._id.toHexString(), process.env.SECRET)
    //sign needs several args: user.id + our password
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    jwt.verify(token, process.env.SECRET, function (err, decode) {//check the token and if ok, we move forward //decode is goona be user id if token is valid
        //when decode we get the token id
        //geting the it, means token is valid
        user.findOne({ "_id": decode, "token": token }, function (err, user) { //se cauta in bd _id si token, 
            if (err) return cb(err);
            cb(null, user);
        })
    })
}

//create the 'User' model
const User = mongoose.model('User', userSchema) //export userSchema to use it on the server 

module.exports = { User }