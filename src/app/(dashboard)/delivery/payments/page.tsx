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
import type { Job } from "@/lib/types/job";

function PaymentRows({ jobs }: { jobs: Job[] }) {
  return (
    <TableBody>
      {jobs.map((job) => (
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
            {job.payment_due_date ?? "-"}
          </TableCell>
          <TableCell className="text-right font-medium">
            {job.reward_amount != null
              ? `¥${job.reward_amount.toLocaleString()}`
              : "-"}
          </TableCell>
          <TableCell>
            {job.is_paid ? (
              <Badge variant="outline" className="text-emerald-600">
                入金済み({job.paid_at})
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-600">
                未入金
              </Badge>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default async function PaymentsPage() {
  await requireUser();
  const supabase = await createClient();
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .order("payment_due_date", { ascending: true, nullsFirst: false });

  const unpaid = (jobs as Job[] | null)?.filter((job) => !job.is_paid) ?? [];
  const paid = (jobs as Job[] | null)?.filter((job) => job.is_paid) ?? [];

  const unpaidTotal = unpaid.reduce(
    (sum, job) => sum + (job.reward_amount ?? 0),
    0,
  );

  return (
    <div className="space-y-8">
      {error && (
        <p className="text-sm text-destructive">
          案件の取得に失敗しました: {error.message}
        </p>
      )}

      {!error && (
        <>
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                未入金
              </h2>
              <span className="text-sm font-medium">
                合計 ¥{unpaidTotal.toLocaleString()}
              </span>
            </div>
            {unpaid.length === 0 ? (
              <Card className="items-center py-12 text-center">
                <p className="text-muted-foreground">未入金の案件はありません。</p>
              </Card>
            ) : (
              <Card className="[--card-spacing:0px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>案件名</TableHead>
                      <TableHead>クライアント</TableHead>
                      <TableHead>入金予定日</TableHead>
                      <TableHead className="text-right">報酬</TableHead>
                      <TableHead>状態</TableHead>
                    </TableRow>
                  </TableHeader>
                  <PaymentRows jobs={unpaid} />
                </Table>
              </Card>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
              入金済み
            </h2>
            {paid.length === 0 ? (
              <Card className="items-center py-12 text-center">
                <p className="text-muted-foreground">入金済みの案件はありません。</p>
              </Card>
            ) : (
              <Card className="[--card-spacing:0px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>案件名</TableHead>
                      <TableHead>クライアント</TableHead>
                      <TableHead>入金予定日</TableHead>
                      <TableHead className="text-right">報酬</TableHead>
                      <TableHead>状態</TableHead>
                    </TableRow>
                  </TableHeader>
                  <PaymentRows jobs={paid} />
                </Table>
              </Card>
            )}
          </section>
        </>
      )}
    </div>
  );
}
