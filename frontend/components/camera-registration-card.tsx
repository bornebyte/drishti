"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clientMutation } from "@/lib/api";
import type { Zone } from "@/types";

type RegistrationResponse = {
  token: string;
  qr_code: string;
  connect_url: string;
};

const fallbackQr =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNDAiIGhlaWdodD0iMjQwIiB2aWV3Qm94PSIwIDAgMjQwIDI0MCI+PHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIyNDAiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzE3MjExZCIvPjxyZWN0IHg9IjE2MCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzE3MjExZCIvPjxyZWN0IHg9IjIwIiB5PSIxNjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzE3MjExZCIvPjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlZjZmNDUiLz48dGV4dCB4PSIxMjAiIHk9IjE0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzE3MjExZCI+UGhvbmUgY2FtPC90ZXh0Pjwvc3ZnPg==";

export function CameraRegistrationCard({ zones }: { zones: Zone[] }) {
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "");
  const [registration, setRegistration] = useState<RegistrationResponse | null>(null);

  async function handleGenerate() {
    const response = await clientMutation("post", "/cameras/mobile-registration", { zone_id: zoneId }, {
      token: "stub-token",
      qr_code: fallbackQr,
      connect_url: "drishti://camera-register?token=stub-token"
    });
    setRegistration(response.data);
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <p className="section-title">Phone cameras</p>
        <CardTitle>Generate mobile camera token</CardTitle>
        <CardDescription>Workers scan this QR to turn a low-cost Android phone into a zone camera.</CardDescription>
      </div>
      <Select value={zoneId} onValueChange={setZoneId}>
        <SelectTrigger>
          <SelectValue placeholder="Select zone" />
        </SelectTrigger>
        <SelectContent>
          {zones.map((zone) => (
            <SelectItem key={zone.id} value={zone.id}>
              {zone.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleGenerate} className="w-full">
        <QrCode className="mr-2 h-4 w-4" />
        Generate token and QR
      </Button>
      {registration ? (
        <div className="rounded-[1.4rem] border border-[var(--border)] bg-white/80 p-4 text-center">
          <img src={registration.qr_code} alt="Camera registration QR" className="mx-auto h-48 w-48 rounded-2xl border border-[var(--border)] bg-white p-3" />
          <p className="mt-3 break-all text-xs text-slate">{registration.connect_url}</p>
        </div>
      ) : null}
    </Card>
  );
}
