import { CloudinaryConfig } from "./types";

export const CLOUDINARY_ORIGIN = "https://res.cloudinary.com";

const CLOUDINARY: CloudinaryConfig = {
  defaultCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  prefix: "/fotp.com",
};

export default CLOUDINARY;
