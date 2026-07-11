import Link from "next/link";
import { requireUser } from "@/lib/auth/dal";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/dashboard", label: "ダッシュボード" },
  { href: "/jobs", label: "案件一覧" },
  { href: "/applications", label: "応募・選考" },
  { href: "/progress", label: "作業・納期" },
  { href: "/delivery", label: "報酬・入金" },
  { href: "/reports", label: "実績・分析" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Link
            href="/dashboard"
            className="shrink-0 text-[15px] font-semibold tracking-tight whitespace-nowrap"
          >
            案件管理システム
          </Link>
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <Button
              nativeButton={false}
              size="sm"
              render={<Link href="/jobs/new">案件を登録</Link>}
            />
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
            <Link
              href="/mypage"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              マイページ
            </Link>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                ログアウト
              </Button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-8">
          <nav className="flex items-center gap-6 py-2.5 text-sm whitespace-nowrap text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">{children}</main>
    </div>
  );
}
