"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/delivery", label: "納品済み案件" },
  { href: "/delivery/payments", label: "入金管理" },
];

export function DeliveryTabs() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex items-center gap-6 border-b text-sm">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "-mb-px border-b-2 py-2 transition-colors",
              isActive
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
