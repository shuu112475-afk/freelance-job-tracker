"use client";

import { useActionState } from "react";
import { updateJob } from "@/app/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  APPLICATION_STATUS_LABELS,
  PROGRESS_STATUS_LABELS,
  type ApplicationStatus,
  type ProgressStatus,
  type Job,
} from "@/lib/types/job";

export function JobEditForm({ job }: { job: Job }) {
  const updateJobWithId = updateJob.bind(null, job.id);
  const [state, action, pending] = useActionState(updateJobWithId, undefined);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>案件情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">案件名</Label>
                <Input id="title" name="title" defaultValue={job.title} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" name="url" type="url" defaultValue={job.url ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_name">クライアント</Label>
                <Input
                  id="client_name"
                  name="client_name"
                  defaultValue={job.client_name ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reward_amount">報酬(円)</Label>
                <Input
                  id="reward_amount"
                  name="reward_amount"
                  type="number"
                  min={0}
                  defaultValue={job.reward_amount ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline_date">納期</Label>
                <Input
                  id="deadline_date"
                  name="deadline_date"
                  type="date"
                  defaultValue={job.deadline_date ?? ""}
                />
              </div>
            </div>

            <div className="grid gap-5 border-t pt-8 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  応募・進捗
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="application_status">応募状況</Label>
                <Select
                  name="application_status"
                  defaultValue={job.application_status}
                >
                  <SelectTrigger id="application_status" className="w-full">
                    <SelectValue>
                      {(value: ApplicationStatus) =>
                        APPLICATION_STATUS_LABELS[value]
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(APPLICATION_STATUS_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="progress_status">進捗</Label>
                <Select name="progress_status" defaultValue={job.progress_status}>
                  <SelectTrigger id="progress_status" className="w-full">
                    <SelectValue>
                      {(value: ProgressStatus) =>
                        PROGRESS_STATUS_LABELS[value]
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROGRESS_STATUS_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 border-t pt-8">
              <Label htmlFor="memo">メモ</Label>
              <Textarea id="memo" name="memo" rows={4} defaultValue={job.memo ?? ""} />
            </div>

            <div className="grid gap-5 border-t pt-8 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  納品
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivered_at">納品日</Label>
                <Input
                  id="delivered_at"
                  name="delivered_at"
                  type="date"
                  defaultValue={job.delivered_at ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_url">納品先URL</Label>
                <Input
                  id="delivery_url"
                  name="delivery_url"
                  type="url"
                  defaultValue={job.delivery_url ?? ""}
                />
              </div>
            </div>

            <div className="grid gap-5 border-t pt-8 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  報酬・入金
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_due_date">入金予定日</Label>
                <Input
                  id="payment_due_date"
                  name="payment_due_date"
                  type="date"
                  defaultValue={job.payment_due_date ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paid_at">入金日(入金済みの場合)</Label>
                <Input
                  id="paid_at"
                  name="paid_at"
                  type="date"
                  defaultValue={job.paid_at ?? ""}
                />
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <input
                  id="is_paid"
                  name="is_paid"
                  type="checkbox"
                  defaultChecked={job.is_paid}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="is_paid" className="font-normal">
                  入金済み
                </Label>
              </div>
            </div>

            {state?.error && (
              <p className="text-sm text-destructive" role="alert">
                {state.error}
              </p>
            )}
            <Button type="submit" disabled={pending}>
              {pending ? "保存中…" : "保存する"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
