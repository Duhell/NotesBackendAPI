import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
export default class Cloudinary {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  async UploadImage(imageDataUri) {
    const generatedPublicId = crypto.randomUUID();
    const folderName = "WDS";
    const uploaded = await cloudinary.uploader.upload(imageDataUri, {
      folder: folderName,
      public_id: generatedPublicId,
    });

    if (!uploaded) {
      return console.error("File was not uploaded.");
    }

    return generatedPublicId;
  }

  async OptimizePhoto(public_id) {
    const optimizedUrl = cloudinary.url(public_id, {
      fetch_format: "auto",
      quality: "auto",
      height: 394,
      aspect_ratio:"16:9",
      crop:"fill"
    });
    console.log("Optimized URL:", optimizedUrl);
    return optimizedUrl;
  }
  
}
