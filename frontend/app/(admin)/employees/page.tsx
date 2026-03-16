import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { getEmployees, getZones } from "@/lib/api";

export default async function EmployeesPage() {
  const [employeesResponse, zonesResponse] = await Promise.all([getEmployees(), getZones()]);
  const employees = employeesResponse.data;
  const zoneMap = new Map(zonesResponse.data.map((zone) => [zone.id, zone.name]));

  if (!employees.length) {
    return <EmptyState title="No employees yet" description="Add workers and supervisors to link incidents and voice reports." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Employees"
        title="People and assignments"
        description="Maintain complete worker records with preferred language, emergency details, and linked safety history."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {employees.map((employee) => (
          <Card key={employee.id} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/employees/${employee.id}`} className="text-xl font-semibold text-ink">
                  {employee.name}
                </Link>
                <p className="mt-1 text-sm text-slate">
                  {employee.employee_code} • {employee.designation}
                </p>
              </div>
              <StatusBadge value={employee.active ? "active" : "inactive"} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="section-title">Department</p>
                <p className="mt-1 text-sm text-ink">{employee.department}</p>
              </div>
              <div>
                <p className="section-title">Zone</p>
                <p className="mt-1 text-sm text-ink">{zoneMap.get(employee.assigned_zone_id) ?? employee.assigned_zone_id}</p>
              </div>
              <div>
                <p className="section-title">Preferred language</p>
                <p className="mt-1 text-sm text-ink">{employee.preferred_language}</p>
              </div>
              <div>
                <p className="section-title">Phone</p>
                <p className="mt-1 text-sm text-ink">{employee.phone}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
