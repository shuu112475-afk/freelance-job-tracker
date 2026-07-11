"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>新規登録</CardTitle>
        <CardDescription>
          メールアドレスとパスワードでアカウントを作成します
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
            />
            <p className="text-xs text-muted-foreground">8文字以上</p>
          </div>
          {state?.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
          {state?.message && (
            <p className="text-sm text-emerald-600" role="status">
              {state.message}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "登録中…" : "登録する"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          既にアカウントをお持ちの方は{" "}
          <Link href="/login" className="underline underline-offset-4">
            ログイン
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
