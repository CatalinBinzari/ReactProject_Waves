const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const app = express();
const mongoose = require('mongoose')
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE)

app.use(bodyParser.urlencoded({ extended: true })) //register middleware //
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 3002
const { response } = require('express');
//=====================================
//              MODELS
//=====================================
const { User } = require('./models/user');
const { Brand } = require('./models/brand');
const { Wood } = require('./models/wood');
const { Product } = require('./models/product');



//=====================================
//              MIDDLEWARE
//=====================================
const { auth } = require('./middleware/auth');
const { admin } = require('./middleware/admin')

//=====================================
//              PRODUCTS
//=====================================

app.get('/api/product/articles', (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;

    Product.
        find(). //finding a product
        populate('brand'). //get brand and wood information
        populate('wood').
        sort([[sortBy, order]]). //sort it by whatever we are passing there
        limit(limit). //limiting 
        exec((err, articles) => { //executing
            if (err) return res.status(400).send(err);
            res.send(articles)
        })
})




app.get('/api/product/articles_by_id', (req, res) => {
    let type = req.query.type;
    let items = req.query.id;

    if (type === "array") {
        let ids = req.query.id.split(',');
        items = [];
        items = ids.map(item => {
            return mongoose.Types.ObjectId(item)//push to array the id og the item but converted  to object ID
        })
    }

    Product.
        find({ '_id': { $in: items } }). // items can be one single or more items
        exec((err, docs) => {
            return res.status(200).send(docs) //find in products one single item or more  by id, and send back to docs
        })
})




app.post('/api/product/article', auth, admin, (req, res) => {
    const product = new Product(req.body);

    product.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            success: true,
            article: doc
        })
    })
})

//=====================================
//              WOODS
//=====================================
app.post('/api/product/wood', auth, admin, (req, res) => {
    const wood = new Wood(req.body);
    wood.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({
            success: true,
            wood: doc
        })
    })
})

app.get('/api/product/woods', () => {
    Wood.find({}, (err, woods) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(woods)
    })
})

//=====================================
//              BRAND
//=====================================
app.post('/api/product/brand', auth, admin, (req, res) => { //admin is a new middleware which is checking if user is admin or not
    const brand = new Brand(req.body)

    brand.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            success: true,
            brand: doc
        })
    })
})

app.get('/api/product/brands', (req, res) => {
    Brand.find({}, (err, brands) => { // .find({}) - brings eveything inside callback 
        if (err) return res.status(400).send(err)
        res.status(200).send(brands)
    })
})
//=====================================
//              USERS
//=====================================
app.post('/api/users/register', (req, res) => {
    //console.log(req);
    const user = new User(req.body);

    //user.save() the way to store things in mongo
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err }) //if goes wrong

        //res.status(200) browser gets status:200 as response
        res.status(200).json({//the json which we sent back to user
            success: true,
            //userdata: doc
        })
    })

})
app.get('/api/users/auth', auth, (req, res) => { //we have inside the request user data and token
    //midleware  acts before or while we are doing smth

    res.status(200).json({
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        card: req.user.cart,
        history: req.user.history

    })
})
app.post('/api/users/login', (req, res) => {
    User.findOne({ 'email': req.body.email }, (err, user) => {
        if (!user) return res.json({ loginSuccess: false, message: 'Ath failes, email not found' });
        //callback gives us null is does not find user, or user if it's found
        //req.body.email - is email introduced by user
        //.findOne() finds smth in the db
        user.comparePassword(req.body.password, (err, isMatch) => {//isMatch is true  is pass match or false
            if (!isMatch) return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err)

                //store token as cookie
                res.cookie('w_auth', user.token).status(200).json({
                    loginSuccess: true
                })
                //w_auth is name of the cookie

            })
        })
    })

})

app.get('/api/users/logout', auth, (req, res) => {//we use auth because if user is not authenticated, he will be kicked out from logout
    //find user by id and set token to nothing(destroy the token)
    User.findOneAndUpdate(
        { _id: req.user._id },
        { token: '' },
        (err, doc) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })

        }
    )
})




app.listen(port, () => {
    console.log(`Server Runing at ${port}`)
})