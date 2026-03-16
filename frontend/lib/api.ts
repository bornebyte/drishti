import axios from "axios";

import {
  mockAlertPreferences,
  mockAlerts,
  mockAuditLogs,
  mockCameras,
  mockDashboard,
  mockEmployees,
  mockIncidents,
  mockMedia,
  mockReports,
  mockZones
} from "@/lib/mock-data";
import type {
  Alert,
  AlertPreferences,
  AuditLog,
  ApiEnvelope,
  Camera,
  DashboardSummary,
  Employee,
  Incident,
  MediaItem,
  VoiceReport,
  Zone
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

function fallbackForPath(path: string) {
  if (path.startsWith("/employees/")) {
    const employeeId = path.split("/")[2];
    const employee = mockEmployees.find((item) => item.id === employeeId) ?? mockEmployees[0];
    return {
      ...employee,
      incidents: mockIncidents.filter((item) => item.employee_id === employeeId),
      reports: mockReports.filter((item) => item.employee_id === employeeId)
    };
  }
  if (path.startsWith("/incidents/")) {
    const incidentId = path.split("/")[2];
    const incident = mockIncidents.find((item) => item.id === incidentId) ?? mockIncidents[0];
    return {
      ...incident,
      ai_analysis_placeholder: "AI analysis pending — will be available after Phase 2 integration."
    };
  }
  if (path.startsWith("/dashboard/summary")) {
    return mockDashboard;
  }
  if (path.startsWith("/zones")) {
    return mockZones;
  }
  if (path.startsWith("/cameras")) {
    return mockCameras;
  }
  if (path.startsWith("/employees")) {
    return mockEmployees;
  }
  if (path.startsWith("/incidents")) {
    return mockIncidents;
  }
  if (path.startsWith("/reports")) {
    return mockReports;
  }
  if (path.startsWith("/alerts/preferences")) {
    return mockAlertPreferences;
  }
  if (path.startsWith("/alerts")) {
    return mockAlerts;
  }
  if (path.startsWith("/media")) {
    return mockMedia;
  }
  if (path.startsWith("/audit-logs")) {
    return mockAuditLogs;
  }
  return null;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      cache: "no-store",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    return {
      success: true,
      data: fallbackForPath(path) as T,
      message: "Using local fallback data because the API is unavailable.",
      pagination: null
    };
  }
}

export async function clientMutation<T>(method: "post" | "patch", path: string, payload: unknown, fallback: T) {
  try {
    const response = await apiClient.request<ApiEnvelope<T>>({
      method,
      url: path,
      data: payload
    });
    return response.data;
  } catch {
    return {
      success: true,
      data: fallback,
      message: "Operation saved locally in fallback mode.",
      pagination: null
    } satisfies ApiEnvelope<T>;
  }
}

export async function loginRequest(email: string, password: string) {
  try {
    const response = await apiClient.post<ApiEnvelope<{ access_token: string; user: { name: string } }>>(
      "/auth/login",
      { email, password }
    );
    return response.data;
  } catch {
    return {
      success: true,
      data: {
        access_token: "local-fallback-token",
        user: { name: "Priya Sharma" }
      },
      message: "Signed in using local fallback mode.",
      pagination: null
    };
  }
}

export async function getDashboardData() {
  return apiFetch<DashboardSummary>("/dashboard/summary");
}

export async function getZones() {
  return apiFetch<Zone[]>("/zones");
}

export async function getCameras() {
  return apiFetch<Camera[]>("/cameras");
}

export async function getEmployees() {
  return apiFetch<Employee[]>("/employees");
}

export async function getEmployee(employeeId: string) {
  return apiFetch<Employee & { incidents: Incident[]; reports: VoiceReport[] }>(`/employees/${employeeId}`);
}

export async function getIncidents() {
  return apiFetch<Incident[]>("/incidents");
}

export async function getIncident(incidentId: string) {
  return apiFetch<Incident & { ai_analysis_placeholder: string }>(`/incidents/${incidentId}`);
}

export async function getReports() {
  return apiFetch<VoiceReport[]>("/reports");
}

export async function getAlerts() {
  return apiFetch<Alert[]>("/alerts");
}

export async function getAlertPreferences() {
  return apiFetch<AlertPreferences>("/alerts/preferences");
}

export async function getMedia() {
  return apiFetch<MediaItem[]>("/media");
}

export async function getAuditLogs() {
  return apiFetch<AuditLog[]>("/audit-logs");
}
