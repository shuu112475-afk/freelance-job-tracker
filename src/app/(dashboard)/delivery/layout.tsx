import { DeliveryTabs } from "./tabs";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">納品・報酬管理</h1>
      <DeliveryTabs />
      <div className="mt-8">{children}</div>
    </div>
  );
}
