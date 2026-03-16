"use client";

import { useState, useTransition } from "react";

import { StatusBadge } from "@/components/status-badge";
import { Switch } from "@/components/ui/switch";
import { clientMutation } from "@/lib/api";
import { severityOptions } from "@/lib/constants";
import type { AlertPreferences } from "@/types";

export function AlertPreferencesForm({ initialPreferences }: { initialPreferences: AlertPreferences }) {
  const [isPending, startTransition] = useTransition();
  const [preferences, setPreferences] = useState(initialPreferences);
  const [message, setMessage] = useState("");
  const channelFields: Array<{ key: "email_enabled" | "sms_enabled" | "push_enabled"; label: string }> = [
    { key: "email_enabled", label: "Email alerts" },
    { key: "sms_enabled", label: "SMS alerts" },
    { key: "push_enabled", label: "Dashboard push alerts" }
  ];

  function updateField<Key extends keyof AlertPreferences>(key: Key, value: AlertPreferences[Key]) {
    const previous = preferences;
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    startTransition(async () => {
      const response = await clientMutation("patch", "/alerts/preferences", next, next);
      if (!response.success) {
        setPreferences(previous);
        setMessage("Could not save preferences. Previous settings restored.");
        return;
      }
      setMessage("Alert preferences updated.");
    });
  }

  return (
    <div className="space-y-4">
      {channelFields.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between rounded-[1.2rem] border border-[var(--border)] bg-white/70 p-4">
          <div>
            <p className="font-medium text-ink">{label}</p>
            <p className="text-sm text-slate">Used for high and critical safety events based on your threshold.</p>
          </div>
          <Switch checked={preferences[key]} onCheckedChange={(value) => updateField(key, value)} />
        </div>
      ))}

      <div className="rounded-[1.2rem] border border-[var(--border)] bg-white/70 p-4">
        <p className="font-medium text-ink">Minimum severity</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {severityOptions.map((severity) => (
            <button
              key={severity}
              type="button"
              onClick={() => updateField("minimum_severity", severity)}
              className={preferences.minimum_severity === severity ? "" : "opacity-70"}
            >
              <StatusBadge value={severity} />
            </button>
          ))}
        </div>
      </div>

      {message ? <p className="text-sm text-slate">{isPending ? "Saving..." : message}</p> : null}
    </div>
  );
}
