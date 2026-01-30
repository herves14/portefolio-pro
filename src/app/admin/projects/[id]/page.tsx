"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import ImageUploader from "@/components/admin/ImageUploader";

const projectSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  shortDescription: z
    .string()
    .min(10, "La description courte doit contenir au moins 10 caractères"),
  fullDescription: z
    .string()
    .min(20, "La description complète doit contenir au moins 20 caractères"),
  problemSolved: z.string().optional(),
  technologies: z.string().min(1, "Ajoutez au moins une technologie"),
  siteUrl: z.string().url().optional().or(z.literal("")),
  completionDate: z.string().optional(),
  status: z.enum(["published", "draft"]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const project = await res.json();
        setValue("title", project.title);
        setValue("shortDescription", project.shortDescription);
        setValue("fullDescription", project.fullDescription);
        setValue("problemSolved", project.problemSolved || "");
        setValue("technologies", project.technologies.join(", "));
        setValue("siteUrl", project.siteUrl || "");
        setValue(
          "completionDate",
          project.completionDate
            ? new Date(project.completionDate).toISOString().split("T")[0]
            : ""
        );
        setValue("status", project.status);
        setImages(project.images || []);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId, setValue]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);

    try {
      const technologiesArray = data.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const projectData = {
        ...data,
        technologies: technologiesArray,
        images,
        completionDate: data.completionDate || null,
        siteUrl: data.siteUrl || null,
      };

      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <FaArrowLeft />
            Retour au tableau de bord
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Modifier le Projet
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du projet *
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description courte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description courte *
              </label>
              <textarea
                {...register("shortDescription")}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.shortDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            {/* Description complète */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description complète *
              </label>
              <textarea
                {...register("fullDescription")}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.fullDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullDescription.message}
                </p>
              )}
            </div>

            {/* Problème résolu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problème résolu / Impact (optionnel)
              </label>
              <textarea
                {...register("problemSolved")}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies utilisées * (séparées par des virgules)
              </label>
              <input
                {...register("technologies")}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.technologies && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.technologies.message}
                </p>
              )}
            </div>

            {/* Lien du site */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lien du site (optionnel)
              </label>
              <input
                {...register("siteUrl")}
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Date de réalisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de réalisation (optionnel)
              </label>
              <input
                {...register("completionDate")}
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Images du projet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images du projet
              </label>
              <ImageUploader images={images} onChange={setImages} />
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut *
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
              <Link
                href="/admin/dashboard"
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
