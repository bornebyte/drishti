import { DashboardCharts } from "@/components/charts/dashboard-charts";
import { LiveAlertFeed } from "@/components/live-alert-feed";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getAlerts, getDashboardData, getIncidents, getReports } from "@/lib/api";

export default async function DashboardPage() {
  const [dashboardResponse, alertsResponse, incidentsResponse, reportsResponse] = await Promise.all([
    getDashboardData(),
    getAlerts(),
    getIncidents(),
    getReports()
  ]);

  const dashboard = dashboardResponse.data;
  const alerts = alertsResponse.data.slice(0, 5);
  const incidents = incidentsResponse.data.slice(0, 4);
  const reports = reportsResponse.data.slice(0, 3);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Control room"
        title="Safety overview"
        description="A single command view for incidents, alerts, camera health, worker voice complaints, and Phase 1 analytics."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Incidents" value={dashboard.stats.incidents_total} detail={`${dashboard.stats.open_incidents} still open`} />
        <StatCard label="Reports" value={dashboard.stats.reports_total} detail="Worker submissions awaiting Phase 2 processing" />
        <StatCard label="Alerts" value={dashboard.stats.alerts_unread} detail="Unread high priority notifications" />
        <StatCard label="Resolution" value={`${dashboard.stats.avg_resolution_hours}h`} detail="Average time to close an incident" />
      </div>

      <DashboardCharts
        incidentsOverTime={dashboard.analytics.incidents_over_time}
        severityBreakdown={dashboard.analytics.severity_breakdown}
        languageTrends={dashboard.analytics.language_trends}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <Card className="space-y-4">
          <div className="space-y-1">
            <p className="section-title">Recent incidents</p>
            <CardTitle>Shift highlights</CardTitle>
            <CardDescription>Use this list for fast triage before opening the full incident queue.</CardDescription>
          </div>
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div key={incident.id} className="rounded-[1.2rem] border border-[var(--border)] bg-white/75 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium text-ink">{incident.title}</p>
                    <p className="text-sm text-slate">{incident.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge value={incident.severity} />
                    <StatusBadge value={incident.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <LiveAlertFeed initialAlerts={alerts} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="space-y-4">
          <div className="space-y-1">
            <p className="section-title">Offline cameras</p>
            <CardTitle>Heartbeat watch</CardTitle>
          </div>
          <div className="space-y-3">
            {dashboard.offline_cameras.length ? (
              dashboard.offline_cameras.map((camera) => (
                <div key={camera.id} className="rounded-[1.2rem] border border-[var(--border)] bg-white/75 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink">{camera.name}</p>
                      <p className="text-sm text-slate">Zone: {camera.zone_id}</p>
                    </div>
                    <StatusBadge value={camera.status} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate">All camera heartbeats are healthy right now.</p>
            )}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="space-y-1">
            <p className="section-title">Voice reports</p>
            <CardTitle>Latest worker submissions</CardTitle>
          </div>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-[1.2rem] border border-[var(--border)] bg-white/75 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{report.language} complaint</p>
                    <p className="text-sm text-slate">Transcript: {report.transcript}</p>
                  </div>
                  <StatusBadge value={report.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
