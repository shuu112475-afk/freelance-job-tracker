import { getUser } from "@/lib/auth/dal";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function MyPage() {
  const user = await getUser();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight">マイページ</h1>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>アカウント設定</CardTitle>
          <CardDescription>登録中のアカウント情報です。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">メールアドレス</p>
            <p className="mt-1 font-medium">{user?.email}</p>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline">
              ログアウト
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
