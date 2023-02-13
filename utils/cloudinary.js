require('dotenv').config()
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
  
// Cloudinary configuration
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:'656421436189497' ,
    api_secret:'viPdBcKp36sr8b8yyT9uEL6_QwY' ,
});
  
module.exports={

 uploadToCloudinary:(locaFilePath) =>{
    const mainFolderName = "main";
    const filePathOnCloudinary = 
        mainFolderName + "/" + locaFilePath;
    return cloudinary.uploader
        .upload(locaFilePath, { public_id: filePathOnCloudinary })
        .then((result) => {
            fs.unlinkSync(locaFilePath);
            return {
                message: "Success",
                url: result.url,
            };
        })
        .catch((error) => {
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
}

}
