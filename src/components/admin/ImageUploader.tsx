"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { FaUpload, FaTimes } from "react-icons/fa";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

interface LocalPreview {
  url: string;
  isNew: boolean;
}

export default function ImageUploader({
  images,
  onChange,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    const total = files.length;
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data?.error ||
            "Une erreur est survenue lors de l'upload. Veuillez réessayer."
        );
        return;
      }

      const urls: string[] = Array.isArray(data.urls) ? data.urls : [];
      onChange([...images, ...urls]);

      // Progression simple basée sur le nombre de fichiers
      setProgress(100);
    } catch (err) {
      console.error("Erreur upload Cloudinary:", err);
      setError(
        "Impossible d'uploader les images pour le moment. Vérifiez votre connexion."
      );
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging
            ? "border-primary-500 bg-primary-50 shadow-inner"
            : "border-gray-300 hover:border-primary-400 bg-gray-50"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={onFileChange}
          className="hidden"
          id="image-upload-input"
        />
        <label
          htmlFor="image-upload-input"
          className="flex flex-col items-center justify-center text-center"
        >
          <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center mb-3">
            <FaUpload className="text-2xl text-primary-500" />
          </div>
          <span className="text-gray-800 font-semibold">
            Glissez-déposez des images ici
          </span>
          <span className="text-gray-500 text-sm">
            ou cliquez pour sélectionner des fichiers
          </span>
          <span className="mt-2 text-xs text-gray-400">
            Formats autorisés : JPG, JPEG, PNG, WEBP • Max 5MB par image
          </span>
          {uploading && (
            <span className="mt-2 text-sm text-primary-600">
              Upload en cours...
            </span>
          )}
        </label>
      </div>

      {/* Barre de progression */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all"
            style={{ width: `${progress || 30}%` }}
          />
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Prévisualisation des images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {images.map((url, index) => (
            <div key={url + index} className="relative group">
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                width={400}
                height={230}
                className="w-full h-32 object-cover rounded-lg shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Supprimer l'image"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

