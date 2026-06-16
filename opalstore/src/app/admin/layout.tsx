import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check — runs on every /admin request
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || null;

  if (!email) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!isAdmin(email)) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
