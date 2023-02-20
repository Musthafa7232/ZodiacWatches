const categoryModel = require('../Models/categorySchema');
const bannerModel = require('../Models/bannerSchema')

const getLandingPage = async (req, res) => {
  try {
    const banner = await bannerModel.find({ isDeleted: false })

    const category = await categoryModel.aggregate(
      [
        {
          '$match': {
            'isDeleted': false
          }
        }, {
          '$lookup': {
            'from': 'products',
            'localField': '_id',
            'foreignField': 'categoryId',
            'pipeline': [
              {
                '$match': {
                  'isDeleted': false
                }
              }, {
                '$limit': 3
              }
            ],
            'as': 'products'
          }
        }
      ]
    )
    return res.render("user/landing-page", { banner, category })
  } catch (err) {
    console.log(err);
  }
}

const getHome = async (req, res) => {
  try {
    const banner = await bannerModel.find({ isDeleted: false })
console.log("kkk");
    const category = await categoryModel.aggregate(
      [
        {
          '$match': {
            'isDeleted': false
          }
        }, {
          '$lookup': {
            'from': 'products',
            'localField': '_id',
            'foreignField': 'categoryId',
            'pipeline': [
              {
                '$match': {
                  'isDeleted': false
                }
              }
            ],
            'as': 'products'
          }
        }
      ]
    )
    return res.render("user/home", { banner, category })
  } catch (err) {
    console.log(err);
  }

}

const getAbout = (req, res) => {
  return res.render("user/about",{user:req.session?.user?.name})
}




const getLogout = (req, res) => {
  req.session.user = null;
  res.redirect("/")
}

module.exports = {
  getHome,
  getAbout,
  getLandingPage,
  getLogout,
}