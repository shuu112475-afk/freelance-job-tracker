import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/dal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Job } from "@/lib/types/job";

function currentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export default async function DashboardPage() {
  const user = await getUser();
  const supabase = await createClient();
  const { data } = await supabase.from("jobs").select("*");
  const jobs = (data as Job[] | null) ?? [];

  const inProgressCount = jobs.filter(
    (job) => job.progress_status !== "done",
  ).length;

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = jobs
    .filter((job) => job.deadline_date && job.deadline_date >= today)
    .sort((a, b) => (a.deadline_date! < b.deadline_date! ? -1 : 1))[0];

  const unpaidTotal = jobs
    .filter((job) => !job.is_paid)
    .reduce((sum, job) => sum + (job.reward_amount ?? 0), 0);

  const monthKey = currentMonthKey();
  const monthlyRevenue = jobs
    .filter((job) => job.is_paid && job.paid_at?.startsWith(monthKey))
    .reduce((sum, job) => sum + (job.reward_amount ?? 0), 0);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">ダッシュボード</h1>
      <p className="mt-3 text-muted-foreground">ようこそ、{user?.email} さん。</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              進行中案件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {inProgressCount}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                件
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              直近納期
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming ? (
              <>
                <p className="text-lg font-semibold tracking-tight">
                  {upcoming.deadline_date}
                </p>
                <Link
                  href={`/jobs/${upcoming.id}`}
                  className="mt-1 line-clamp-1 block text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  {upcoming.title}
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">登録なし</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              未入金
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              ¥{unpaidTotal.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              当月売上
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              ¥{monthlyRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
