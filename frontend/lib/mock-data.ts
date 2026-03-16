import type {
  Alert,
  AlertPreferences,
  AuditLog,
  Camera,
  DashboardSummary,
  Employee,
  Incident,
  MediaItem,
  VoiceReport,
  Zone
} from "@/types";

export const mockZones: Zone[] = [
  {
    id: "zone_1",
    name: "Assembly Line A",
    code: "ALA",
    description: "Primary assembly floor",
    factory_name: "Jaipur Unit",
    status: "active"
  },
  {
    id: "zone_2",
    name: "Chemical Storage",
    code: "CHEM",
    description: "Restricted hazardous storage room",
    factory_name: "Jaipur Unit",
    status: "active"
  }
];

export const mockCameras: Camera[] = [
  {
    id: "camera_1",
    name: "Line A North CCTV",
    kind: "rtsp",
    zone_id: "zone_1",
    stream_url: "rtsp://example.com/live/1",
    status: "online",
    last_heartbeat_at: "2026-03-16T11:45:00.000Z"
  },
  {
    id: "camera_2",
    name: "Storage Door Phone Cam",
    kind: "phone",
    zone_id: "zone_2",
    status: "offline",
    last_heartbeat_at: "2026-03-16T11:10:00.000Z",
    assigned_worker_id: "employee_1"
  }
];

export const mockEmployees: Employee[] = [
  {
    id: "employee_1",
    employee_code: "EMP-001",
    name: "Ravi Kumar",
    department: "Assembly",
    designation: "Machine Operator",
    assigned_zone_id: "zone_1",
    phone: "+91 9876543210",
    emergency_contact: "+91 9812341234",
    preferred_language: "हिन्दी",
    join_date: "2024-07-01",
    active: true
  },
  {
    id: "employee_2",
    employee_code: "EMP-014",
    name: "Meena Nair",
    department: "Safety",
    designation: "Shift Supervisor",
    assigned_zone_id: "zone_2",
    phone: "+91 9810011001",
    emergency_contact: "+91 9810011002",
    preferred_language: "മലയാളം",
    join_date: "2023-11-12",
    active: true
  }
];

export const mockIncidents: Incident[] = [
  {
    id: "incident_1",
    type: "ppe_violation",
    severity: "high",
    status: "open",
    zone_id: "zone_1",
    camera_id: "camera_1",
    employee_id: "employee_1",
    title: "Missing helmet detected",
    description: "Worker appears without helmet near the conveyor.",
    ai_description: "AI analysis pending — will be available after Phase 2 integration.",
    source: "ai_detection",
    resolution_notes: "",
    created_at: "2026-03-16T11:42:00.000Z"
  },
  {
    id: "incident_2",
    type: "zone_anomaly",
    severity: "critical",
    status: "acknowledged",
    zone_id: "zone_2",
    camera_id: "camera_2",
    title: "Blocked emergency aisle",
    description: "Material drums partially obstruct emergency exit path.",
    ai_description: "AI analysis pending — will be available after Phase 2 integration.",
    source: "manual_flag",
    resolution_notes: "Supervisor informed.",
    created_at: "2026-03-16T09:15:00.000Z"
  }
];

export const mockReports: VoiceReport[] = [
  {
    id: "report_1",
    employee_id: "employee_1",
    zone_id: "zone_2",
    language: "हिन्दी",
    transcript: "Processing...",
    translation: "Processing...",
    structured_report: "Processing...",
    status: "processing",
    celery_job_id: "job_report_1",
    created_at: "2026-03-16T10:30:00.000Z"
  }
];

export const mockAlerts: Alert[] = [
  {
    id: "alert_1",
    incident_id: "incident_1",
    title: "High severity incident",
    message: "Missing helmet detected in Assembly Line A.",
    severity: "high",
    read: false,
    created_at: "2026-03-16T11:43:00.000Z"
  },
  {
    id: "alert_2",
    incident_id: "incident_2",
    title: "Critical zone alert",
    message: "Blocked emergency aisle in Chemical Storage.",
    severity: "critical",
    read: true,
    created_at: "2026-03-16T09:16:00.000Z"
  }
];

export const mockMedia: MediaItem[] = [
  {
    id: "media_1",
    filename: "helmet-check.jpg",
    media_type: "image",
    zone_id: "zone_1",
    camera_id: "camera_1",
    content_type: "image/jpeg",
    size_bytes: 182940,
    storage_key: "image/media_1/helmet-check.jpg",
    uploaded: true,
    url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
  },
  {
    id: "media_2",
    filename: "worker-report.m4a",
    media_type: "audio",
    zone_id: "zone_2",
    content_type: "audio/mp4",
    size_bytes: 842112,
    storage_key: "audio/media_2/worker-report.m4a",
    uploaded: true
  }
];

export const mockAlertPreferences: AlertPreferences = {
  id: "pref_1",
  admin_id: "admin_1",
  email_enabled: true,
  sms_enabled: false,
  push_enabled: true,
  minimum_severity: "medium"
};

export const mockAuditLogs: AuditLog[] = [
  {
    id: "audit_1",
    actor_id: "admin_1",
    action: "create",
    entity: "incident",
    entity_id: "incident_2",
    changes: { severity: "critical", status: "acknowledged" },
    created_at: "2026-03-16T09:16:00.000Z"
  },
  {
    id: "audit_2",
    actor_id: "admin_1",
    action: "update",
    entity: "alert_preferences",
    entity_id: "pref_1",
    changes: { push_enabled: true, minimum_severity: "medium" },
    created_at: "2026-03-16T08:55:00.000Z"
  }
];

export const mockDashboard: DashboardSummary = {
  stats: {
    incidents_total: mockIncidents.length,
    open_incidents: mockIncidents.filter((item) => item.status === "open").length,
    reports_total: mockReports.length,
    alerts_unread: mockAlerts.filter((item) => !item.read).length,
    cameras_online: mockCameras.filter((item) => item.status === "online").length,
    zones_total: mockZones.length,
    avg_resolution_hours: 4.6
  },
  analytics: {
    incidents_over_time: [
      { label: "Mon", count: 2 },
      { label: "Tue", count: 4 },
      { label: "Wed", count: 3 },
      { label: "Thu", count: 5 },
      { label: "Fri", count: 2 }
    ],
    severity_breakdown: [
      { name: "Low", value: 4 },
      { name: "Medium", value: 3 },
      { name: "High", value: 2 },
      { name: "Critical", value: 1 }
    ],
    language_trends: [
      { name: "हिन्दी", value: 7 },
      { name: "தமிழ்", value: 2 },
      { name: "తెలుగు", value: 1 }
    ]
  },
  offline_cameras: mockCameras.filter((camera) => camera.status === "offline")
};
