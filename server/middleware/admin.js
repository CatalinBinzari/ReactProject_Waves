let admin = (req, res, next) => {
    if (req.user.role === 0) {
        //is not admin
        return res.send('You are not allowed to do this action!')
    }
    next(); //if everything goes ok
}
module.exports = { admin }