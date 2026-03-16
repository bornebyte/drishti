import { SectionHeader } from "@/components/section-header";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Settings"
        title="Platform configuration notes"
        description="Phase 1 leaves several systems intentionally prepared rather than fully integrated so Phase 2 can plug in cleanly."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "AI services",
            body: "All Whisper, GPT-4o, YOLOv8, and Gemini entry points are stubbed in the Flask backend with explicit docstrings."
          },
          {
            title: "Storage",
            body: "R2 uploads and downloads use presigned URLs. If R2 is not configured, local-safe stub URLs keep the flow intact."
          },
          {
            title: "Database",
            body: "D1 service wiring is present. Development falls back to an in-memory store so the UI and API stay usable without cloud setup."
          },
          {
            title: "Queues",
            body: "Celery tasks enqueue audio and frame jobs, but the task bodies only log and return stub responses in this phase."
          }
        ].map((item) => (
          <Card key={item.title} className="space-y-3">
            <p className="section-title">{item.title}</p>
            <p className="text-sm leading-6 text-slate">{item.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
