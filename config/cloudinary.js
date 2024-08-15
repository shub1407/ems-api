import cloudinaryv1 from "cloudinary"
const cloudinary = cloudinaryv1.v2

function cloudinaryConnect() {
  try {
    cloudinary.config({
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      cloud_name: process.env.CLOUD_NAME,
    })
    console.log("Cloudinary connected successfully")
  } catch (err) {
    console.log("Some error occured while connecting with cloudinary", err)
  }
}

export default cloudinaryConnect
