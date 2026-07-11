export type ApplicationStatus =
  | "candidate"
  | "applied"
  | "interview"
  | "contracted"
  | "rejected";

export type ProgressStatus =
  | "not_started"
  | "in_progress"
  | "in_review"
  | "done";

export interface Job {
  id: string;
  user_id: string;
  title: string;
  url: string | null;
  client_name: string | null;
  reward_amount: number | null;
  memo: string | null;
  application_status: ApplicationStatus;
  progress_status: ProgressStatus;
  deadline_date: string | null;
  delivered_at: string | null;
  delivery_url: string | null;
  payment_due_date: string | null;
  is_paid: boolean;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  candidate: "候補",
  applied: "応募中",
  interview: "面談",
  contracted: "契約",
  rejected: "不採用",
};

export const PROGRESS_STATUS_LABELS: Record<ProgressStatus, string> = {
  not_started: "未着手",
  in_progress: "作業中",
  in_review: "確認中",
  done: "完了",
};
