import { AlertPreferencesForm } from "@/components/alert-preferences-form";
import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { getAlertPreferences, getAlerts } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default async function AlertsPage() {
  const [alertsResponse, preferencesResponse] = await Promise.all([getAlerts(), getAlertPreferences()]);
  const alerts = alertsResponse.data;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Alerts"
        title="Realtime notifications"
        description="High and critical incidents push to the dashboard immediately, with per-admin notification channel controls."
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div className="space-y-1">
            <p className="section-title">Alert history</p>
            <h2 className="text-xl font-semibold text-ink">Recent notifications</h2>
          </div>
          <div className="space-y-3">
            {alerts.length ? (
              alerts.map((alert) => (
                <div key={alert.id} className="rounded-[1.2rem] border border-[var(--border)] bg-white/75 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink">{alert.title}</p>
                      <p className="mt-1 text-sm text-slate">{alert.message}</p>
                      <p className="mt-2 text-xs text-slate">{formatDate(alert.created_at)}</p>
                    </div>
                    <div className="flex gap-2">
                      <StatusBadge value={alert.severity} />
                      <StatusBadge value={alert.read ? "read" : "unread"} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No alerts yet" description="New incidents will generate notifications once they cross the severity threshold." />
            )}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="space-y-1">
            <p className="section-title">Preferences</p>
            <h2 className="text-xl font-semibold text-ink">Channel controls</h2>
          </div>
          <AlertPreferencesForm initialPreferences={preferencesResponse.data} />
        </Card>
      </div>
    </div>
  );
}
