"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const severityColors = ["#d8a35d", "#f0b45c", "#ef6f45", "#c3482f"];

export function DashboardCharts({
  incidentsOverTime,
  severityBreakdown,
  languageTrends
}: {
  incidentsOverTime: Array<{ label: string; count: number }>;
  severityBreakdown: Array<{ name: string; value: number }>;
  languageTrends: Array<{ name: string; value: number }>;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="space-y-4">
        <div className="space-y-1">
          <p className="section-title">Incident volume</p>
          <CardTitle>Daily trend</CardTitle>
          <CardDescription>Track daily incident load before we add longer-range aggregations in Phase 2.</CardDescription>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incidentsOverTime}>
              <CartesianGrid stroke="rgba(23, 33, 29, 0.08)" vertical={false} />
              <XAxis dataKey="label" stroke="#5e6d66" />
              <YAxis stroke="#5e6d66" />
              <Tooltip />
              <Bar dataKey="count" fill="#204f3c" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-5">
        <Card className="space-y-4">
          <div className="space-y-1">
            <p className="section-title">Severity mix</p>
            <CardTitle>Incident breakdown</CardTitle>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityBreakdown}
                  innerRadius={48}
                  outerRadius={82}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {severityBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={severityColors[index % severityColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="space-y-1">
            <p className="section-title">Language usage</p>
            <CardTitle>Worker report languages</CardTitle>
          </div>
          <div className="space-y-3">
            {languageTrends.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-slate">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-black/5">
                  <div
                    className="h-2 rounded-full bg-ember"
                    style={{ width: `${Math.min(item.value * 12, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
