import { getUser } from "@/lib/auth/dal";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div>
      <h1 className="text-2xl font-bold">ダッシュボード</h1>
      <p className="mt-2 text-muted-foreground">
        ようこそ、{user?.email} さん。案件の登録・管理機能は今後のサイクルで追加されます。
      </p>
    </div>
  );
}
