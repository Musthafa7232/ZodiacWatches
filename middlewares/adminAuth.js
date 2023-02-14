
  const  isLoggedIn= (req, res, next) => {
         if (req.session.admin) {
           next()
         } else {
           res.redirect('/admin')
         }
       }
 
     const isLoggedOut=(req, res, next) => {
         if (!req.session.admin) {
           next()
         } else {
           res.redirect('/admin/home')
         }
       }
module.exports={isLoggedIn,isLoggedOut }