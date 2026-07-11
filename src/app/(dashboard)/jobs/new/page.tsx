"use client";

import { useActionState } from "react";
import { createJob } from "@/app/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewJobPage() {
  const [state, action, pending] = useActionState(createJob, undefined);

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>案件を登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">案件名</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" name="url" type="url" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_name">クライアント</Label>
              <Input id="client_name" name="client_name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward_amount">報酬(円)</Label>
              <Input id="reward_amount" name="reward_amount" type="number" min={0} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline_date">納期</Label>
              <Input id="deadline_date" name="deadline_date" type="date" />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive" role="alert">
                {state.error}
              </p>
            )}
            <Button type="submit" disabled={pending}>
              {pending ? "登録中…" : "登録する"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
