const bannerModel = require('../Models/bannerSchema')

const getBanner = async (req, res) => {
    const banners = await bannerModel.find({ isDeleted: false })
    if (req.session.message) {
        const message = req.session.message;
        req.session.message = ""
        res.render('admin/banners/banners', { banners, message ,dashboard:false,product:false,user:false,returns:false,categorys:false,coupons:false,banner:true,order:false,sale:false })
    } else {
        const message = ""
        res.render('admin/banners/banners', { banners, message,dashboard:false,product:false,user:false,returns:false,categorys:false,coupons:false,banner:true,order:false,sale:false  })
    }
}



const addBanner = async (req, res) => {
    try {
        const paths = req.file.path.slice(6)
        const banner = new bannerModel({
            bannerTitle: req.body.banner,
            images: paths
        })
        try {
            await banner.save()
            res.redirect('/admin/banners')
        } catch (error) {
            console.log(error)
            res.redirect('/admin/banners')
        }
    } catch (err) {
        console.log(err);
    }
}

const deleteBanner = async (req, res) => {
    try {
        const id = req.params.id
        await bannerModel.findOneAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true
            }
        })
        return res.json({
            successStatus: true,
            redirect: '/admin/banners'
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports={
    getBanner,
    addBanner,
    deleteBanner,
}