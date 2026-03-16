"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  AudioWaveform,
  ClipboardList,
  Bell,
  Camera,
  ChartColumn,
  LayoutDashboard,
  ShieldAlert,
  Users,
  Warehouse
} from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/incidents", label: "Incidents", icon: ShieldAlert },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/cameras", label: "Cameras", icon: Camera },
  { href: "/zones", label: "Zones", icon: Warehouse },
  { href: "/reports", label: "Voice Reports", icon: AudioWaveform },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/media", label: "Media", icon: ChartColumn },
  { href: "/audit", label: "Audit", icon: ClipboardList },
  { href: "/settings", label: "Settings", icon: AlertTriangle }
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition duration-200",
              active
                ? "border-transparent bg-ink text-sand shadow-lg shadow-black/10"
                : "border-[var(--border)] bg-white/50 text-ink hover:-translate-y-0.5 hover:bg-white/85"
            )}
          >
            <Icon className="h-4 w-4 transition group-hover:scale-105" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
