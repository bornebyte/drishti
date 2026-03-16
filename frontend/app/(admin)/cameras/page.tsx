import { CameraRegistrationCard } from "@/components/camera-registration-card";
import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { getCameras, getZones } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default async function CamerasPage() {
  const [camerasResponse, zonesResponse] = await Promise.all([getCameras(), getZones()]);
  const cameras = camerasResponse.data;
  const zones = zonesResponse.data;
  const zoneMap = new Map(zones.map((zone) => [zone.id, zone.name]));

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Cameras"
        title="Feed monitoring"
        description="Manage CCTV streams and worker phone cameras, assign them to zones, and keep an eye on heartbeat health."
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4">
          {cameras.length ? (
            cameras.map((camera) => (
              <Card key={camera.id} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-ink">{camera.name}</p>
                    <p className="mt-1 text-sm text-slate">
                      {camera.kind.toUpperCase()} • {zoneMap.get(camera.zone_id) ?? camera.zone_id}
                    </p>
                  </div>
                  <StatusBadge value={camera.status} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="section-title">Last heartbeat</p>
                    <p className="mt-1 text-sm text-ink">{formatDate(camera.last_heartbeat_at)}</p>
                  </div>
                  <div>
                    <p className="section-title">Assigned worker</p>
                    <p className="mt-1 text-sm text-ink">{camera.assigned_worker_id ?? "Unassigned"}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState title="No cameras configured" description="Add RTSP/HLS cameras or connect a phone camera using QR." />
          )}
        </div>

        <CameraRegistrationCard zones={zones} />
      </div>
    </div>
  );
}
