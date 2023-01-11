module.exports={
   isLoggedIn : (req, res, next) => {
        if (req.session.user) {
          next()
        } else {
          res.redirect('/login')
        }
      },

     isLoggedOut :(req, res, next) => {
        if (!req.session.user) {
          next()
        } else {
          res.redirect('/home')
        }
      }
}