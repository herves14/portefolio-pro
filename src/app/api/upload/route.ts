import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

// Taille max 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Types MIME autorisés
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const uploadFolder =
      process.env.CLOUDINARY_UPLOAD_FOLDER || "portfolio-projects";

    const urls: string[] = [];

    for (const file of files) {
      // Validation du type de fichier
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: "Type de fichier non supporté",
            details: `Type reçu: ${file.type}`,
          },
          { status: 400 }
        );
      }

      // Validation de la taille
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: "Fichier trop volumineux (max 5MB)",
            details: `Taille reçue: ${(file.size / (1024 * 1024)).toFixed(
              2
            )}MB`,
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload vers Cloudinary via un stream
      const url = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: uploadFolder,
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              return reject(error || new Error("Upload Cloudinary échoué"));
            }
            resolve(result.secure_url);
          }
        );

        uploadStream.end(buffer);
      });

      urls.push(url);
    }

    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    console.error("Erreur upload Cloudinary:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}

