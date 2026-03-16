import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { getZones } from "@/lib/api";

export default async function ZonesPage() {
  const zonesResponse = await getZones();
  const zones = zonesResponse.data;

  if (!zones.length) {
    return <EmptyState title="No zones created" description="Define rooms and work areas before assigning cameras and employees." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Zones"
        title="Factory areas and reference images"
        description="Every zone can hold a reference image today so anomaly detection can compare live frames in Phase 2."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {zones.map((zone) => (
          <Card key={zone.id} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-ink">{zone.name}</p>
                <p className="mt-1 text-sm text-slate">
                  {zone.factory_name} • {zone.code}
                </p>
              </div>
              <StatusBadge value={zone.status} />
            </div>
            <p className="text-sm text-slate">{zone.description}</p>
            <div className="rounded-[1.2rem] border border-dashed border-[var(--border)] bg-white/65 p-4 text-sm text-slate">
              Reference image: {zone.reference_image_media_id ? zone.reference_image_media_id : "Upload pending"}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
