
const isRegistered = (req, res, next) => {
    if (req.session.newUser) {
        next()
    } else {
        res.redirect('/register')
    }
}

const validateRegister = (req, res, next) => {
    if (!req.body.name) {
        req.session.message = "Name is Required"
    }
    else if (!req.body.email) {
        req.session.message = "email is Required"
    }
    else if (!req.body.phone) {
        req.session.message = "phone is Required"
    }
    else if (!req.body.password) {
        req.session.message = "password is Required"
    }
    else if (req.body.confirmPassword != req.body.password) {
        req.session.message = "Password you have entered do not match "
    }

    if (req.session.message) {
        req.session.register = {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email
        }
        res.redirect('/register')
    }else{
        next()
    }

}
module.exports = { isRegistered ,
    validateRegister }