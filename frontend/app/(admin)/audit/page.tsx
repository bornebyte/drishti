import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { Card } from "@/components/ui/card";
import { getAuditLogs } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default async function AuditPage() {
  const auditResponse = await getAuditLogs();
  const logs = auditResponse.data;

  if (!logs.length) {
    return <EmptyState title="No audit logs yet" description="Admin actions will be recorded here with actor, entity, and changed fields." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Audit trail"
        title="Administrative activity"
        description="Every meaningful admin change should leave a clear trail showing who changed what and when."
      />

      <div className="grid gap-4">
        {logs.map((log) => (
          <Card key={log.id} className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold capitalize text-ink">
                  {log.action} {log.entity.replaceAll("_", " ")}
                </p>
                <p className="mt-1 text-sm text-slate">
                  Actor: {log.actor_id} • Record: {log.entity_id}
                </p>
              </div>
              <p className="text-sm text-slate">{formatDate(log.created_at)}</p>
            </div>
            <pre className="overflow-auto rounded-[1.2rem] bg-white/70 p-4 text-xs text-slate">
              {JSON.stringify(log.changes, null, 2)}
            </pre>
          </Card>
        ))}
      </div>
    </div>
  );
}
