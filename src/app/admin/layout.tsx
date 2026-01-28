import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Ne pas vérifier l'auth sur la page de login
  if (!pathname.includes("/admin/login")) {
    const user = await getCurrentUser();
    if (!user) {
      redirect("/admin/login");
    }
  }

  return <>{children}</>;
}
