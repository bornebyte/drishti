import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { WorkerReportForm } from "@/components/forms/worker-report-form";
import { getZones } from "@/lib/api";

export default async function WorkerPage() {
  const zonesResponse = await getZones();

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:px-6">
      <div className="space-y-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-ink">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="section-title">Worker app</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Report a safety issue</h1>
          <p className="mt-2 text-sm text-slate sm:text-base">
            Choose your language, record your complaint, and send it to the safety team. Designed to stay simple on low-cost Android phones.
          </p>
        </div>

        <WorkerReportForm zones={zonesResponse.data} />
      </div>
    </div>
  );
}
