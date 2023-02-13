module.exports = {
    isRegistered: (req, res, next) => {
        if (req.session.newUser) {
            next()
        } else {
            res.redirect('/register')
        }
    }
}