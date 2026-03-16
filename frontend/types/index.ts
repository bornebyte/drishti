export type Severity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "open" | "acknowledged" | "resolved" | "false_positive";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  } | null;
}

export interface Zone {
  id: string;
  name: string;
  code: string;
  description: string;
  factory_name: string;
  status: string;
  reference_image_media_id?: string | null;
}

export interface Camera {
  id: string;
  name: string;
  kind: "rtsp" | "hls" | "phone";
  zone_id: string;
  stream_url?: string | null;
  status: "online" | "offline";
  last_heartbeat_at?: string | null;
  assigned_worker_id?: string | null;
}

export interface Employee {
  id: string;
  employee_code: string;
  name: string;
  department: string;
  designation: string;
  assigned_zone_id: string;
  phone: string;
  emergency_contact: string;
  preferred_language: string;
  join_date: string;
  active: boolean;
}

export interface Incident {
  id: string;
  type: string;
  severity: Severity;
  status: IncidentStatus;
  zone_id: string;
  camera_id?: string | null;
  employee_id?: string | null;
  title: string;
  description: string;
  ai_description: string;
  source: string;
  resolution_notes: string;
  created_at: string;
}

export interface VoiceReport {
  id: string;
  employee_id?: string | null;
  zone_id: string;
  language: string;
  audio_media_id?: string | null;
  transcript: string;
  translation: string;
  structured_report: string;
  status: string;
  celery_job_id?: string | null;
  created_at: string;
}

export interface Alert {
  id: string;
  incident_id: string;
  title: string;
  message: string;
  severity: Severity;
  read: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  media_type: "image" | "video" | "audio";
  zone_id?: string | null;
  camera_id?: string | null;
  content_type: string;
  size_bytes: number;
  storage_key: string;
  uploaded: boolean;
  url?: string;
}

export interface DashboardSummary {
  stats: {
    incidents_total: number;
    open_incidents: number;
    reports_total: number;
    alerts_unread: number;
    cameras_online: number;
    zones_total: number;
    avg_resolution_hours: number;
  };
  analytics: {
    incidents_over_time: Array<{ label: string; count: number }>;
    severity_breakdown: Array<{ name: string; value: number }>;
    language_trends: Array<{ name: string; value: number }>;
  };
  offline_cameras: Camera[];
}

export interface AlertPreferences {
  id: string;
  admin_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  minimum_severity: Severity | "medium";
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  entity: string;
  entity_id: string;
  changes: Record<string, unknown>;
  created_at: string;
}
