import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/dal";
import { JobEditForm } from "./edit-form";
import type { Job } from "@/lib/types/job";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const supabase = await createClient();
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">案件詳細</h1>
      <JobEditForm job={job as Job} />
    </div>
  );
}
