import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <Card className="card-hover page-enter space-y-3">
      <p className="section-title">{label}</p>
      <CardTitle className="text-3xl">{value}</CardTitle>
      <CardDescription>{detail}</CardDescription>
    </Card>
  );
}
