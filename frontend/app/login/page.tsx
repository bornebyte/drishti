import { Shield } from "lucide-react";

import { LoginForm } from "@/components/forms/login-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 md:px-6 md:py-10">
      <div className="grid w-full gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2.4rem] p-6 md:p-10">
          <Badge className="bg-amber-100 text-amber-700">Production foundation</Badge>
          <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-tight text-ink md:text-6xl">
            Factory safety monitoring built for real Indian shop floors.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate md:text-lg">
            CCTV and phone cameras, worker voice complaints in regional languages, incidents, alerts, media, analytics,
            audit logs, and clean Phase 2 seams for AI.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Realtime alerts", "WebSocket push for high and critical incidents"],
              ["Voice intake", "Mobile-first worker complaint flow with placeholders"],
              ["Soft deletes", "Nothing disappears silently from admin records"]
            ].map(([title, text]) => (
              <Card key={title} className="rounded-[1.6rem] border bg-white/70 p-5">
                <Shield className="h-5 w-5 text-ember" />
                <p className="mt-4 font-medium text-ink">{title}</p>
                <p className="mt-2 text-sm text-slate">{text}</p>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2.4rem] p-6 md:p-10">
          <Badge className="bg-moss/10 text-moss">Admin access</Badge>
          <CardTitle className="mt-3 text-3xl">Sign in</CardTitle>
          <CardDescription className="mt-2 text-sm">
            Use the seeded local account for development or connect the Flask backend.
          </CardDescription>
          <div className="mt-8">
            <LoginForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
