import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Récupérer les projets (public ou admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    const where = status === "published" ? { status: "published" } : {};

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    // IMPORTANT: toujours retourner un tableau pour éviter les crashes `.map is not a function`
    return NextResponse.json([], { status: 500 });
  }
}

// POST - Créer un projet (admin seulement)
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

    const body = await request.json();

    const project = await prisma.project.create({
      data: {
        title: body.title,
        shortDescription: body.shortDescription,
        fullDescription: body.fullDescription,
        problemSolved: body.problemSolved || null,
        technologies: body.technologies || [],
        siteUrl: body.siteUrl || null,
        images: body.images || [],
        completionDate: body.completionDate
          ? new Date(body.completionDate)
          : null,
        status: body.status || "draft",
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
