"use client";

import { startTransition, useOptimistic, useState } from "react";

import { Button } from "@/components/ui/button";
import { clientMutation } from "@/lib/api";
import type { Incident } from "@/types";

const actions = [
  { label: "Acknowledge", status: "acknowledged" },
  { label: "Resolve", status: "resolved" },
  { label: "False positive", status: "false_positive" }
] as const;

export function IncidentStatusActions({ incident }: { incident: Incident }) {
  const [optimisticIncident, setOptimisticIncident] = useOptimistic(incident, (state, status: Incident["status"]) => ({
    ...state,
    status
  }));
  const [message, setMessage] = useState("");

  async function updateStatus(status: Incident["status"]) {
    const previousStatus = optimisticIncident.status;
    startTransition(() => setOptimisticIncident(status));
    const response = await clientMutation(
      "patch",
      `/incidents/${incident.id}`,
      { status },
      { ...incident, status }
    );
    if (!response.success) {
      startTransition(() => setOptimisticIncident(previousStatus));
      setMessage("Could not update incident. UI rolled back safely.");
      return;
    }
    setMessage(`Incident marked ${status.replaceAll("_", " ")}.`);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.status}
            size="sm"
            variant={optimisticIncident.status === action.status ? "accent" : "outline"}
            onClick={() => updateStatus(action.status)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      {message ? <p className="text-sm text-slate">{message}</p> : null}
    </div>
  );
}
