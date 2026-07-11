import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/dal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  APPLICATION_STATUS_LABELS,
  PROGRESS_STATUS_LABELS,
  type Job,
} from "@/lib/types/job";

export default async function JobsPage() {
  await requireUser();
  const supabase = await createClient();
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .order("deadline_date", { ascending: true, nullsFirst: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">案件一覧</h1>
        <Button render={<Link href="/jobs/new">案件を登録</Link>} />
      </div>

      {error && (
        <p className="mt-4 text-sm text-destructive">
          案件の取得に失敗しました: {error.message}
        </p>
      )}

      {!error && jobs && jobs.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          登録されている案件がありません。「案件を登録」から追加してください。
        </p>
      )}

      {!error && jobs && jobs.length > 0 && (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>案件名</TableHead>
              <TableHead>クライアント</TableHead>
              <TableHead>応募状況</TableHead>
              <TableHead>進捗</TableHead>
              <TableHead>納期</TableHead>
              <TableHead className="text-right">報酬</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(jobs as Job[]).map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell>{job.client_name ?? "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {APPLICATION_STATUS_LABELS[job.application_status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {PROGRESS_STATUS_LABELS[job.progress_status]}
                  </Badge>
                </TableCell>
                <TableCell>{job.deadline_date ?? "-"}</TableCell>
                <TableCell className="text-right">
                  {job.reward_amount != null
                    ? `¥${job.reward_amount.toLocaleString()}`
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
