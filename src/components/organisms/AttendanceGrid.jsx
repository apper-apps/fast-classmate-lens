import React, { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";

const AttendanceGrid = ({ 
  students = [], 
  attendance = [], 
  onUpdateAttendance,
  selectedDate = new Date()
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const getAttendanceStatus = (studentId, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const record = attendance.find(r => 
      r.studentId === studentId && r.date === dateStr
    );
    return record?.status || "unmarked";
  };

  const handleStatusChange = async (studentId, date, status) => {
    setIsUpdating(true);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      await onUpdateAttendance(studentId, dateStr, status);
      toast.success("Attendance updated successfully!");
    } catch (error) {
      toast.error("Failed to update attendance");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present": return "bg-success text-white";
      case "absent": return "bg-error text-white";
      case "late": return "bg-warning text-white";
      default: return "bg-slate-200 text-slate-600 hover:bg-slate-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present": return "Check";
      case "absent": return "X";
      case "late": return "Clock";
      default: return "Minus";
    }
  };

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ApperIcon name="Calendar" size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No students found</h3>
          <p className="text-slate-600">Add students to start tracking attendance.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="Calendar" size={20} className="text-primary" />
          <span>Weekly Attendance</span>
        </CardTitle>
        <p className="text-sm text-slate-600">
          Week of {format(weekStart, "MMM dd, yyyy")}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700 min-w-[200px]">
                  Student
                </th>
                {weekDays.map(day => (
                  <th key={day.toISOString()} className="text-center py-3 px-2 font-medium text-slate-700 min-w-[120px]">
                    <div className="text-sm">
                      {format(day, "EEE")}
                    </div>
                    <div className="text-xs text-slate-500">
                      {format(day, "MMM dd")}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map(student => (
                <tr key={student.Id} className="hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Grade {student.gradeLevel}
                        </p>
                      </div>
                    </div>
                  </td>
                  {weekDays.map(day => {
                    const status = getAttendanceStatus(student.Id, day);
                    return (
                      <td key={day.toISOString()} className="py-4 px-2 text-center">
                        <div className="flex space-x-1 justify-center">
                          {["present", "late", "absent"].map(statusOption => (
                            <button
                              key={statusOption}
                              onClick={() => handleStatusChange(student.Id, day, statusOption)}
                              disabled={isUpdating}
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50",
                                status === statusOption 
                                  ? getStatusColor(statusOption)
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-400"
                              )}
                              title={statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                            >
                              <ApperIcon 
                                name={getStatusIcon(statusOption)} 
                                size={12}
                              />
                            </button>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-success"></div>
            <span className="text-sm text-slate-600">Present</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-warning"></div>
            <span className="text-sm text-slate-600">Late</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-error"></div>
            <span className="text-sm text-slate-600">Absent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-slate-200"></div>
            <span className="text-sm text-slate-600">Unmarked</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceGrid;