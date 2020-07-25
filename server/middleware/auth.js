const { User } = require('./../models/user')
//midleware is a functon
let auth = (req, res, next) => {
    //we kill process there if smth is not good, or let to go next()
    let token = req.cookies.w_auth;

    User.findByToken(token, (err, user) => { //recieve token from cookies, and exec a function( with params, err, user)
        if (err) throw err;
        if (!user) return res.json({
            isAuth: false,
            error: true

        });
        req.token = token //if everything goes ok, we send request with a token
        //we are entering request wwe are receiveing from the server.js/ auth and we push a value called token
        req.user = user // we vahe all the user info inside req.user
        next() //goes to next line of code, server.js/(req, res) => {} , after auth
        //we have inside the request user data and token
    })
}

module.exports = { auth }