import { getUser } from "@/lib/auth/dal";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">ダッシュボード</h1>
      <p className="mt-3 text-muted-foreground">
        ようこそ、{user?.email} さん。案件の集計機能は今後のサイクルで追加されます。
      </p>
    </div>
  );
}
