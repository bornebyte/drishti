import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { getEmployee, getZones } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default async function EmployeeDetailPage({
  params
}: {
  params: { employeeId: string };
}) {
  const { employeeId } = params;
  const [employeeResponse, zonesResponse] = await Promise.all([getEmployee(employeeId), getZones()]);
  const employee = employeeResponse.data;
  const zoneName = zonesResponse.data.find((zone) => zone.id === employee.assigned_zone_id)?.name ?? employee.assigned_zone_id;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Employee detail"
        title={employee.name}
        description="Track assigned zone, emergency details, incident history, and complaint submissions from one place."
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-ink">{employee.employee_code}</p>
              <p className="text-sm text-slate">{employee.designation}</p>
            </div>
            <StatusBadge value={employee.active ? "active" : "inactive"} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="section-title">Department</p>
              <p className="mt-2 text-sm text-ink">{employee.department}</p>
            </div>
            <div>
              <p className="section-title">Assigned zone</p>
              <p className="mt-2 text-sm text-ink">{zoneName}</p>
            </div>
            <div>
              <p className="section-title">Language</p>
              <p className="mt-2 text-sm text-ink">{employee.preferred_language}</p>
            </div>
            <div>
              <p className="section-title">Joined</p>
              <p className="mt-2 text-sm text-ink">{formatDate(employee.join_date)}</p>
            </div>
            <div>
              <p className="section-title">Phone</p>
              <p className="mt-2 text-sm text-ink">{employee.phone}</p>
            </div>
            <div>
              <p className="section-title">Emergency contact</p>
              <p className="mt-2 text-sm text-ink">{employee.emergency_contact}</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="space-y-4">
            <p className="section-title">Incident history</p>
            <div className="space-y-3">
              {employee.incidents.length ? (
                employee.incidents.map((incident) => (
                  <div key={incident.id} className="rounded-[1.2rem] border border-[var(--border)] bg-white/75 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{incident.title}</p>
                        <p className="mt-1 text-sm text-slate">{incident.description}</p>
                      </div>
                      <StatusBadge value={incident.status} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate">No incidents linked yet.</p>
              )}
            </div>
          </Card>

          <Card className="space-y-4">
            <p className="section-title">Submitted reports</p>
            <div className="space-y-3">
              {employee.reports.length ? (
                employee.reports.map((report) => (
                  <div key={report.id} className="rounded-[1.2rem] border border-[var(--border)] bg-white/75 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{report.language} complaint</p>
                        <p className="mt-1 text-sm text-slate">{report.transcript}</p>
                      </div>
                      <StatusBadge value={report.status} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate">No reports submitted yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
