import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configuration Cloudinary centralisée
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export type CloudinaryUploadResult = UploadApiResponse;

/**
 * (Optionnel) Exemple de helper pour supprimer une image Cloudinary
 * en utilisant son public_id.
 */
export async function deleteCloudinaryImage(publicId: string) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Erreur lors de la suppression Cloudinary:", error);
  }
}

