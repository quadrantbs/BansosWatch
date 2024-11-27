import { toast } from "react-toastify";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_REACT_APP_CLOUDINARY_PRESET
  );

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_APP_CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Upload failed.");
    }

    const data = await response.json();
    console.log(data)
    return data.secure_url;
  } catch (error) {
    console.error("Failed to upload file:", error);
    toast.error(error.message || "Failed to upload file.");
    throw error;
  }
};

export { uploadToCloudinary };
