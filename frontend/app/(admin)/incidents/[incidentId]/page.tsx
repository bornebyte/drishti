import { IncidentStatusActions } from "@/components/incident-status-actions";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getIncident, getZones } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default async function IncidentDetailPage({
  params
}: {
  params: { incidentId: string };
}) {
  const { incidentId } = params;
  const [incidentResponse, zonesResponse] = await Promise.all([getIncident(incidentId), getZones()]);
  const incident = incidentResponse.data;
  const zoneName = zonesResponse.data.find((zone) => zone.id === incident.zone_id)?.name ?? incident.zone_id;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Incident detail"
        title={incident.title}
        description="This detail view keeps the AI area intentionally stubbed so Phase 2 can swap in real analysis without redesigning the page."
      />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={incident.severity} />
            <StatusBadge value={incident.status} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="section-title">Zone</p>
              <p className="mt-2 font-medium text-ink">{zoneName}</p>
            </div>
            <div>
              <p className="section-title">Created</p>
              <p className="mt-2 font-medium text-ink">{formatDate(incident.created_at)}</p>
            </div>
            <div>
              <p className="section-title">Source</p>
              <p className="mt-2 font-medium capitalize text-ink">{incident.source.replaceAll("_", " ")}</p>
            </div>
            <div>
              <p className="section-title">Type</p>
              <p className="mt-2 font-medium capitalize text-ink">{incident.type.replaceAll("_", " ")}</p>
            </div>
          </div>
          <div>
            <p className="section-title">Description</p>
            <p className="mt-3 text-sm leading-6 text-slate">{incident.description}</p>
          </div>
          <IncidentStatusActions incident={incident} />
        </Card>

        <Card className="space-y-4">
          <div className="space-y-1">
            <p className="section-title">AI analysis</p>
            <CardTitle>Placeholder for Phase 2</CardTitle>
            <CardDescription>{incident.ai_analysis_placeholder}</CardDescription>
          </div>
          <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-white/60 p-6">
            <p className="text-sm text-slate">
              Future integrations will display PPE detections, anomaly comparisons against the zone reference image, confidence
              scores, and recommended actions here.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
