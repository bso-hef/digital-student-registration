export interface QuickStats {
  totalStudents: number;
  totalClasses: number;
  unassignedStudents: number;
  activeClasses: number;
}

export interface StudentStatusBreakdown {
  imported: number;
  invited: number;
  onboarded: number;
  other: number;
}

export interface GradeDistribution {
  grade: string;
  count: number;
}

export interface RegistrationTrendItem {
  date: string;
  count: number;
}

export interface DashboardStats {
  quickStats: QuickStats;
  studentStatusBreakdown: StudentStatusBreakdown;
  gradeDistribution: GradeDistribution[];
  registrationTrend: RegistrationTrendItem[];
  timestamp: string;
}

export interface SystemInfo {
  hostname: string;
  platform: string;
  arch: string;
  cpus: number;
  loadavg: number[];
  freemem: string;
  totalmem: string;
}

export interface MongoCheckInfo {
  status: "up" | "down";
  info?: {
    code: number;
    [key: string]: unknown;
  };
  error?: string;
}

export interface HealthReport {
  status: "up" | "down";
  checks: {
    mongo: MongoCheckInfo;
  };
  meta: {
    service: string;
    version: string;
    now: string;
    uptimeSec: number;
    node: string;
    system: SystemInfo;
  };
}

export interface DashboardLayout {
  quickStats: string[];
  charts: string[];
}

export interface DashboardState {
  stats: DashboardStats | null;
  health: HealthReport | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  layout: DashboardLayout;
}
