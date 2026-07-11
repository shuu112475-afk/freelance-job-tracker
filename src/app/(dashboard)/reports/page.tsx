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

function monthKey(dateString: string) {
  return dateString.slice(0, 7); // "YYYY-MM"
}

function formatMonthLabel(key: string) {
  const [year, month] = key.split("-");
  return `${year}年${Number(month)}月`;
}

export default async function ReportsPage() {
  await requireUser();
  const supabase = await createClient();
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_paid", true)
    .not("paid_at", "is", null)
    .order("paid_at", { ascending: false });

  const monthlyTotals = new Map<string, number>();
  for (const job of (jobs as Job[] | null) ?? []) {
    if (!job.paid_at) continue;
    const key = monthKey(job.paid_at);
    monthlyTotals.set(
      key,
      (monthlyTotals.get(key) ?? 0) + (job.reward_amount ?? 0),
    );
  }
  const rows = Array.from(monthlyTotals.entries()).sort((a, b) =>
    b[0].localeCompare(a[0]),
  );
  const grandTotal = rows.reduce((sum, [, amount]) => sum + amount, 0);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">月別売上</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        入金済みの報酬を入金日の月ごとに集計します。
      </p>

      {error && (
        <p className="mt-6 text-sm text-destructive">
          案件の取得に失敗しました: {error.message}
        </p>
      )}

      {!error && rows.length === 0 && (
        <Card className="mt-8 items-center py-16 text-center">
          <p className="text-muted-foreground">入金済みの案件がまだありません。</p>
        </Card>
      )}

      {!error && rows.length > 0 && (
        <Card className="mt-8 [--card-spacing:0px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>月</TableHead>
                <TableHead className="text-right">売上</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(([key, amount]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">
                    {formatMonthLabel(key)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ¥{amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-semibold">合計</TableCell>
                <TableCell className="text-right font-semibold">
                  ¥{grandTotal.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
