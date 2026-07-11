"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/dal";
import type { ApplicationStatus, ProgressStatus } from "@/lib/types/job";

export type JobFormState = { error: string } | undefined;

function toNullableString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value === "" ? null : value;
}

function toNullableInt(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (value === "") return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function createJob(
  _prevState: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return { error: "案件名を入力してください。" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      user_id: user.id,
      title,
      url: toNullableString(formData, "url"),
      client_name: toNullableString(formData, "client_name"),
      reward_amount: toNullableInt(formData, "reward_amount"),
      deadline_date: toNullableString(formData, "deadline_date"),
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/jobs");
  redirect(`/jobs/${data.id}`);
}

export async function updateJob(
  jobId: string,
  _prevState: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  await requireUser();
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return { error: "案件名を入力してください。" };
  }

  const isPaid = formData.get("is_paid") === "on";

  const supabase = await createClient();
  const { error } = await supabase
    .from("jobs")
    .update({
      title,
      url: toNullableString(formData, "url"),
      client_name: toNullableString(formData, "client_name"),
      reward_amount: toNullableInt(formData, "reward_amount"),
      memo: toNullableString(formData, "memo"),
      application_status: formData.get(
        "application_status",
      ) as ApplicationStatus,
      progress_status: formData.get("progress_status") as ProgressStatus,
      deadline_date: toNullableString(formData, "deadline_date"),
      delivered_at: toNullableString(formData, "delivered_at"),
      delivery_url: toNullableString(formData, "delivery_url"),
      payment_due_date: toNullableString(formData, "payment_due_date"),
      is_paid: isPaid,
      paid_at: isPaid ? (toNullableString(formData, "paid_at") ?? new Date().toISOString().slice(0, 10)) : null,
    })
    .eq("id", jobId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  redirect(`/jobs/${jobId}`);
}
