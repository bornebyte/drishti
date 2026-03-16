import { Badge } from "@/components/ui/badge";

export function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3 md:space-y-4">
      <Badge className="bg-amber-100 text-amber-800">{eyebrow}</Badge>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h1>
        <p className="max-w-2xl text-sm text-slate md:text-base">{description}</p>
      </div>
    </div>
  );
}
