import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { getReports, getZones } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default async function ReportsPage() {
  const [reportsResponse, zonesResponse] = await Promise.all([getReports(), getZones()]);
  const reports = reportsResponse.data;
  const zoneMap = new Map(zonesResponse.data.map((zone) => [zone.id, zone.name]));

  if (!reports.length) {
    return <EmptyState title="No voice reports yet" description="Worker audio complaints will appear here after submission." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Worker reports"
        title="Voice complaint intake"
        description="Original audio, transcript, translation, and structured report fields are ready, with Phase 1 placeholders until AI arrives."
      />

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-ink">{report.language} complaint</p>
                <p className="mt-1 text-sm text-slate">
                  {zoneMap.get(report.zone_id) ?? report.zone_id} • {formatDate(report.created_at)}
                </p>
              </div>
              <StatusBadge value={report.status} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.2rem] border border-[var(--border)] bg-white/75 p-4">
                <p className="section-title">Transcript</p>
                <p className="mt-2 text-sm text-slate">{report.transcript}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border)] bg-white/75 p-4">
                <p className="section-title">Translation</p>
                <p className="mt-2 text-sm text-slate">{report.translation}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border)] bg-white/75 p-4">
                <p className="section-title">Structured report</p>
                <p className="mt-2 text-sm text-slate">{report.structured_report}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
