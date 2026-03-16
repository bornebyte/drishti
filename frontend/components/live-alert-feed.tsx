"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { StatusBadge } from "@/components/status-badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Alert } from "@/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5000";

export function LiveAlertFeed({ initialAlerts }: { initialAlerts: Alert[] }) {
  const [alerts, setAlerts] = useState(initialAlerts);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket", "polling"]
    });

    socket.on("alert:new", (alert: Alert) => {
      setAlerts((current) => [alert, ...current].slice(0, 5));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <p className="section-title">Realtime alerts</p>
        <CardTitle>Socket feed</CardTitle>
        <CardDescription>High and critical incidents appear here instantly via WebSocket when the backend is online.</CardDescription>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="card-hover rounded-[1.2rem] border border-[var(--border)] bg-white/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-medium text-ink">{alert.title}</p>
                <p className="text-sm text-slate">{alert.message}</p>
              </div>
              <StatusBadge value={alert.severity} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
