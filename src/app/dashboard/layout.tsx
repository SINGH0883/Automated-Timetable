import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import GalgotiasHeader from "@/components/GalgotiasHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <GalgotiasHeader role={session.role as "admin" | "teacher" | "student"} userName={session.name} />
      <main className="flex-1 flex pt-16">{children}</main>
    </div>
  );
}
