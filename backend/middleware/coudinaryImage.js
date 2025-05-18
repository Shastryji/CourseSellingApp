const { v2 : cloudinary} = require("cloudinary");

async function cloudinaryImageUrlGen(imageUrl)
{
    if (imageUrl) {
          if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            try {
              const uploadedResponse = await cloudinary.uploader.upload(imageUrl, {
                resource_type: "image",
              });
              return imageUrl = uploadedResponse.secure_url;
            } catch (cloudinaryErr) {
              console.error("Cloudinary Upload from URL Error:", cloudinaryErr);
            }
          } else {
            try {
              const uploadedResponse = await cloudinary.uploader.upload(imageUrl);
              return imageUrl = uploadedResponse.secure_url;
            } catch (cloudinaryErr) {
                console.error("Cloudinary Upload from base64 Error:", cloudinaryErr);
            }
          }
        } else {
          return imageUrl = ""; 
        }
}

module.exports = {cloudinaryImageUrlGen};