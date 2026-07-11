import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/dal";
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

export default async function DeliveredJobsPage() {
  await requireUser();
  const supabase = await createClient();
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .not("delivered_at", "is", null)
    .order("delivered_at", { ascending: false });

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        納品日が登録されている案件を新しい順に表示します。
      </p>

      {error && (
        <p className="mt-6 text-sm text-destructive">
          案件の取得に失敗しました: {error.message}
        </p>
      )}

      {!error && jobs && jobs.length === 0 && (
        <Card className="mt-8 items-center py-16 text-center">
          <p className="text-muted-foreground">
            納品済みの案件はまだありません。
          </p>
        </Card>
      )}

      {!error && jobs && jobs.length > 0 && (
        <Card className="mt-6 [--card-spacing:0px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>案件名</TableHead>
                <TableHead>クライアント</TableHead>
                <TableHead>納品日</TableHead>
                <TableHead>納品先URL</TableHead>
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
                  <TableCell className="text-muted-foreground">
                    {job.client_name ?? "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.delivered_at}
                  </TableCell>
                  <TableCell>
                    {job.delivery_url ? (
                      <a
                        href={job.delivery_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        リンク
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
