import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/dal";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-16">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
          案件管理システム
        </p>
        {children}
      </div>
    </div>
  );
}
