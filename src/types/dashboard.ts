export interface VisitData {
  date: string;
  time: string;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  purpose: string;
  language: string;
  contact: string;
}

export interface VisitorData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoPath: string;
  registeredAt: Date;
  type: 'employee' | 'visitor';
  visitHistory: VisitData[];
}

export interface EmployeeStat {
  name: string;
  visits: number;
  department: string;
}

export interface StatsData {
  totalVisitors: number;
  peakHour: string;
  employeeFrequencies: EmployeeStat[];
}
export interface DashboardStats {
  totalVisitors: number;
  activeVisitors: number;
  peakHour: string;
  averageDuration: number;
  topEmployee: string;
  topDepartment: string;
}

export interface HourlyStats {
  hour: string;
  visitors: number;
}

export interface EmployeeStats {
  name: string;
  visits: number;
  department: string;
}

export interface DepartmentStats {
  name: string;
  visitors: number;
  percentage: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}
