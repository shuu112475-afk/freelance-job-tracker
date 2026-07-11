import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/dal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  type ApplicationStatus,
  type Job,
} from "@/lib/types/job";

const STATUS_ORDER: ApplicationStatus[] = [
  "candidate",
  "applied",
  "interview",
  "contracted",
  "rejected",
];

export default async function ApplicationsPage() {
  await requireUser();
  const supabase = await createClient();
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .order("deadline_date", { ascending: true, nullsFirst: false });

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">応募状況一覧</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        案件を応募状況ごとに確認できます。ステータスの変更は案件詳細から行えます。
      </p>

      {error && (
        <p className="mt-6 text-sm text-destructive">
          案件の取得に失敗しました: {error.message}
        </p>
      )}

      {!error && jobs && jobs.length === 0 && (
        <Card className="mt-8 items-center py-16 text-center">
          <p className="text-muted-foreground">登録されている案件がありません。</p>
        </Card>
      )}

      {!error && jobs && jobs.length > 0 && (
        <div className="mt-8 space-y-8">
          {STATUS_ORDER.map((status) => {
            const jobsInStatus = (jobs as Job[]).filter(
              (job) => job.application_status === status,
            );
            if (jobsInStatus.length === 0) return null;

            return (
              <section key={status}>
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                    {APPLICATION_STATUS_LABELS[status]}
                  </h2>
                  <Badge variant="outline">{jobsInStatus.length}</Badge>
                </div>
                <Card className="[--card-spacing:0px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>案件名</TableHead>
                        <TableHead>クライアント</TableHead>
                        <TableHead>納期</TableHead>
                        <TableHead className="text-right">報酬</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobsInStatus.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell>
                            <Link
                              href={`/jobs/${job.id}`}
                              className="font-medium underline-offset-4 hover:underline"
                            >
                              {job.title}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {job.client_name ?? "-"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {job.deadline_date ?? "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {job.reward_amount != null
                              ? `¥${job.reward_amount.toLocaleString()}`
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
