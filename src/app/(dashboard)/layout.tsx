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
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="text-[15px] font-semibold tracking-tight">
              案件管理システム
            </Link>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/dashboard" className="transition-colors hover:text-foreground">
                ダッシュボード
              </Link>
              <Link href="/jobs" className="transition-colors hover:text-foreground">
                案件一覧
              </Link>
              <Link href="/applications" className="transition-colors hover:text-foreground">
                応募・選考
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <Button
              nativeButton={false}
              render={<Link href="/jobs/new">案件を登録</Link>}
            />
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                ログアウト
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-8 py-10">{children}</main>
    </div>
  );
}
