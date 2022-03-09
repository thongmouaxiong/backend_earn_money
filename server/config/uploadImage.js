import cloudinary from "../config/cloudinary.js";

const UploadImage = async (img, oldImg) => {
  try {
    if (!img) return "";
    
    if (oldImg) {
      const spliturl = oldImg.split("/");
      const img_id = spliturl[spliturl.length - 1].split(".")[0];
      await cloudinary.uploader.destroy(img_id);
    }

    const res_upload = await cloudinary.uploader.upload(img, null, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    });
    return res_upload.url;
  } catch (err) {
    console.log(err)
    return "";
  }
};

export default UploadImage;
