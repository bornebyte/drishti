import Link from "next/link";
import { ArrowUpRight, Smartphone } from "lucide-react";

import { SidebarNav } from "@/components/sidebar-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1500px] gap-4 px-3 py-3 md:gap-6 md:px-6 md:py-4">
      <aside className="glass-panel hidden w-72 shrink-0 rounded-[2rem] p-5 md:flex md:flex-col md:justify-between">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="section-title">Drishti Safety OS</p>
            <div>
              <h2 className="text-2xl font-semibold text-ink">Factory Monitoring</h2>
              <p className="text-sm text-slate">Admin command center for incidents, cameras, alerts, and worker reports.</p>
            </div>
          </div>
          <SidebarNav />
        </div>

        <Card className="space-y-3 border-0 bg-ink text-sand shadow-none">
          <p className="text-xs uppercase tracking-[0.2em] text-sand/70">Field Flow</p>
          <CardDescription className="text-sand/85">
            Workers can submit complaints from the mobile app in their own language.
          </CardDescription>
          <Link href="/worker" className="inline-flex items-center gap-2 text-sm font-medium text-brass">
            Open worker app
            <Smartphone className="h-4 w-4" />
          </Link>
        </Card>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="glass-panel mb-4 flex flex-col gap-4 rounded-[2rem] p-4 md:mb-6 md:flex-row md:items-center md:justify-between md:p-5">
          <div>
            <p className="section-title">Phase 1</p>
            <h1 className="text-xl font-semibold text-ink md:text-2xl">Safety Operations Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Badge className="bg-white/80 text-slate">admin@drishti.local</Badge>
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-2">
                Switch user
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </header>

        <Card className="mb-4 grid gap-3 md:hidden">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Quick navigation</CardTitle>
            <Badge className="bg-amber-100 text-amber-700">Mobile</Badge>
          </div>
          <SidebarNav />
        </Card>

        {children}
      </main>
    </div>
  );
}
