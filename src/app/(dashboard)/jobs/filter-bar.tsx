"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { APPLICATION_STATUS_LABELS } from "@/lib/types/job";

const selectClassName =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function JobsFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "all";
  const deadline = searchParams.get("deadline") ?? "all";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <select
        aria-label="応募状況で絞り込み"
        className={selectClassName}
        value={status}
        onChange={(e) => updateParam("status", e.target.value)}
      >
        <option value="all">応募状況: すべて</option>
        {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        aria-label="納期で絞り込み"
        className={selectClassName}
        value={deadline}
        onChange={(e) => updateParam("deadline", e.target.value)}
      >
        <option value="all">納期: すべて</option>
        <option value="soon">7日以内</option>
        <option value="overdue">期限超過</option>
      </select>
    </div>
  );
}
