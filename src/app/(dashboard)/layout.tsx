import Link from "next/link";
import { requireUser } from "@/lib/auth/dal";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold">
            案件管理システム
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="hover:underline">
              ダッシュボード
            </Link>
            <Link href="/jobs" className="hover:underline">
              案件一覧
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button size="sm" render={<Link href="/jobs/new">案件を登録</Link>} />
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              ログアウト
            </Button>
          </form>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
