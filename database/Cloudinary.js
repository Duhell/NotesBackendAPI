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
    const uploaded = await cloudinary.uploader.upload(imageDataUri, {
      public_id: crypto.randomUUID(),
    });

    if (!uploaded) {
      return console.error("File was not uploaded.");
    }

    return uploaded;
  }

  async OptimizePhoto(url) {
    return cloudinary.url(url, {
      fetch_format: "auto",
      quality: "auto",
    });
  }
}
