import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="flex min-h-40 items-center justify-center text-center">
      <div className="max-w-sm space-y-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </Card>
  );
}
