const userModel = require('../Models/userSchema')




const getUser = async (req, res) => {
    try {
        const users = await userModel.find()
        return res.render("admin/users/users", { users,dashboard:false,product:false,user:true,returns:false,categorys:false,coupons:false,banner:false,order:false,sale:false  })
    } catch (err) {
        console.log(err);
    }
}

const blockUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await userModel.findById(id)
        if (user.isBlocked) {
            try {
                await userModel.findOneAndUpdate({ _id: id }, {
                    $set: {
                        isBlocked: false
                    }
                })
                return res.json({
                    successStatus: true,
                    redirect: '/admin/users'
                })
            } catch (error) {
                console.log(error)
                return res.json({
                    successStatus: false
                })
            }
        } else {
            try {
                await userModel.findOneAndUpdate({ _id: id }, {
                    $set: {
                        isBlocked: true
                    }
                })
                return res.json({
                    successStatus: true,
                    redirect: '/admin/users'
                })
            } catch (error) {
                console.log(error)
                return res.json({
                    successStatus: false
                })
            }
        }
    } catch (err) {
        console.log(err);
    }
}

const viewUser = (req, res) => {
    try {
        const id = req.params.id
        userModel.findById(id, function (err, docs) {
            if (err) {
                console.log(err);
            }
            else {
                const users = docs
                res.render('admin/users/viewUser', { users,dashboard:false,product:false,user:true,returns:false,categorys:false,coupons:false,banner:false,order:false,sale:false  })
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}

module.exports={getUser,
    blockUser,
    viewUser
    }
