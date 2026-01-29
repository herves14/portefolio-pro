"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaFolderOpen,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  images: string[];
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      router.push("/admin/login");
    }
  }, [router]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      const safe = Array.isArray(data) ? data : [];
      setProjects(safe);
      if (!res.ok) {
        setError("Impossible de charger les projets.");
      } else {
        setError(null);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setProjects([]);
      setError("Impossible de charger les projets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchProjects();
  }, [checkAuth, fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Fallback: supprimer le cookie manuellement
      document.cookie = "auth-token=; path=/; max-age=0";
      router.push("/admin/login");
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const publishedCount = projects.filter((p) => p.status === "published").length;
  const draftCount = projects.filter((p) => p.status === "draft").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Tableau de Bord Admin
            </h1>
            <div className="flex gap-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-primary-600"
              >
                Voir le site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:text-red-700 flex items-center gap-2"
              >
                <FaSignOutAlt />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Projets</p>
                <p className="text-3xl font-bold text-gray-900">
                  {projects.length}
                </p>
              </div>
              <FaFolderOpen className="text-4xl text-primary-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Publiés</p>
                <p className="text-3xl font-bold text-green-600">
                  {publishedCount}
                </p>
              </div>
              <FaCheckCircle className="text-4xl text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Brouillons</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {draftCount}
                </p>
              </div>
              <FaTimesCircle className="text-4xl text-yellow-600" />
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <FaPlus />
            Ajouter un projet
          </Link>
        </div>

        {/* Liste des projets */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Liste des Projets
            </h2>
          </div>

          {error && (
            <div className="p-6 bg-red-50 text-red-800 border-b">
              {error}
            </div>
          )}

          {projects.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              Aucun projet pour le moment. Créez votre premier projet !
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Miniature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {project.images.length > 0 ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                            <Image
                              src={project.images[0]}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                            Pas d&apos;image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {project.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {project.shortDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {project.status === "published"
                            ? "Publié"
                            : "Brouillon"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
