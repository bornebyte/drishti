import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { IncidentStatusActions } from "@/components/incident-status-actions";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { getIncidents, getZones } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default async function IncidentsPage() {
  const [incidentsResponse, zonesResponse] = await Promise.all([getIncidents(), getZones()]);
  const incidents = incidentsResponse.data;
  const zoneMap = new Map(zonesResponse.data.map((zone) => [zone.id, zone.name]));

  if (!incidents.length) {
    return <EmptyState title="No incidents yet" description="AI detections, manual flags, and worker reports will appear here." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Incidents"
        title="Safety incident queue"
        description="Review AI stubs, manual flags, and worker-linked incidents with optimistic status changes and safe rollback."
      />

      <div className="grid gap-4">
        {incidents.map((incident) => (
          <Card key={incident.id} className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={incident.severity} />
                  <StatusBadge value={incident.status} />
                </div>
                <div>
                  <Link href={`/incidents/${incident.id}`} className="text-xl font-semibold text-ink">
                    {incident.title}
                  </Link>
                  <p className="mt-1 max-w-3xl text-sm text-slate">{incident.description}</p>
                </div>
              </div>
              <div className="text-sm text-slate">
                <p>{formatDate(incident.created_at)}</p>
                <p>{zoneMap.get(incident.zone_id) ?? incident.zone_id}</p>
                <p>Source: {incident.source.replaceAll("_", " ")}</p>
              </div>
            </div>
            <IncidentStatusActions incident={incident} />
          </Card>
        ))}
      </div>
    </div>
  );
}
