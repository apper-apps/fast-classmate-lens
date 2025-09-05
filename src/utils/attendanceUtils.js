import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWeekend } from "date-fns";

export const calculateAttendancePercentage = (attendanceRecords) => {
  if (!attendanceRecords || attendanceRecords.length === 0) return 0;
  
  const presentDays = attendanceRecords.filter(record => record.status === "present").length;
  return Math.round((presentDays / attendanceRecords.length) * 100);
};

export const getAttendanceStatusColor = (status) => {
  switch (status) {
    case "present": return "text-green-600";
    case "absent": return "text-red-600";
    case "late": return "text-yellow-600";
    default: return "text-gray-400";
  }
};

export const getAttendanceStatusBadge = (status) => {
  switch (status) {
    case "present": return "status-present";
    case "absent": return "status-absent";
    case "late": return "status-late";
    default: return "status-badge bg-gray-100 text-gray-400";
  }
};

export const generateWeekDays = (date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 }); // Friday
  
  return eachDayOfInterval({ start, end }).filter(day => !isWeekend(day));
};

export const formatAttendanceDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export const getTodayAttendanceStats = (students, attendanceRecords) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const todayAttendance = attendanceRecords.filter(record => record.date === today);
  
  const present = todayAttendance.filter(record => record.status === "present").length;
  const absent = todayAttendance.filter(record => record.status === "absent").length;
  const late = todayAttendance.filter(record => record.status === "late").length;
  const total = students.length;
  
  return { present, absent, late, total, percentage: Math.round((present / total) * 100) };
};