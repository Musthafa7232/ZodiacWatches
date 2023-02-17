const couponModel = require('../Models/couponSchema')


const getCoupon = async (req, res) => {
    try {
        const coupon = await couponModel.find({ isDeleted: false })
        if (req.session.message) {
            const message = req.session.message;
            req.session.message = ""
            res.render('admin/coupons/coupons', { coupon, message, dashboard: false, product: false, user: false, returns: false, categorys: false, coupons: true, banner: false, order: false,sale:false  })
        } else {
            const message = ""
            res.render('admin/coupons/coupons', { coupon, message, dashboard: false, product: false, user: false, returns: false, categorys: false, coupons: true, banner: false, order: false,sale:false  })
        }

    } catch (err) {
        console.log(err);
    }


}

const addCoupon = async (req, res) => {
    
    try {
        const existing = await couponModel.find({code:req.body.code})

        if (existing.length!=0) {
            req.session.message = 'This coupon code already exixts'
            res.redirect('/admin/coupons')
        } else {
            const {  expiry, description, minPurchaseValue, discount } = req.body
            const code=req.body.code.toUpperCase()
            let isPercentage
            if (req.body.isPercentage) {
                isPercentage = true
            }
           

            const coupon = new couponModel({
                code,
                expiry,
                description,
                minPurchaseValue,
                discount,
                isPercentage
            })
            await coupon.save()

            res.redirect('/admin/coupons')
        }
    } catch (error) {
        if (error.errors.code) {
            req.session.message = error.errors.code.message
        } else if (error.errors.description) {
            req.session.message = error.errors.description.message
        } else if (error.errors.isPercentage) {
            req.session.message = error.errors.isPercentage.message
        } else if (error.errors.discount) {
            req.session.message = error.errors.discount.message
        } else if (error.errors.minPurchaseValue) {
            req.session.message = error.errors.minPurchaseValue.message
        } else if (error.errors.expiry) {
            req.session.message = error.errors.expiry.message
        }
        res.redirect('/admin/coupons')
        
        console.log(error);
    }

}
const deleteCoupon = async (req, res) => {
    try {
        const id = req.params.id
        await couponModel.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true
            }
        })
        res.json({
            successStatus: true,
            redirect: '/admin/coupons'
        })
    } catch (err) {
console.log(err);
    }
}
module.exports = {
    getCoupon,
    addCoupon,
    deleteCoupon
}