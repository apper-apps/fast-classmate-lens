import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import GradeBadge from "@/components/molecules/GradeBadge";
import TableHeader from "@/components/molecules/TableHeader";
import { calculateGradeAverage, getLetterGrade } from "@/utils/gradeUtils";
import { calculateAttendancePercentage } from "@/utils/attendanceUtils";

const StudentTable = ({ 
  students = [], 
  grades = [], 
  attendance = [],
  onEdit, 
  onDelete,
  onView,
  sortField,
  sortDirection,
  onSort
}) => {
  const getStudentStats = (studentId) => {
    const studentGrades = grades.filter(grade => grade.studentId === studentId);
    const studentAttendance = attendance.filter(record => record.studentId === studentId);
    
    const gradeAverage = calculateGradeAverage(studentGrades);
    const attendancePercentage = calculateAttendancePercentage(studentAttendance);
    
    return { gradeAverage, attendancePercentage };
  };

  const handleSort = (field) => {
    if (onSort) {
      const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
      onSort(field, newDirection);
    }
  };

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-slate-200">
        <div className="p-8 text-center">
          <ApperIcon name="Users" size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No students found</h3>
          <p className="text-slate-600">Start by adding your first student to the class.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <TableHeader
                title="Student"
                sortable
                onSort={() => handleSort("name")}
                sortDirection={sortField === "name" ? sortDirection : null}
              />
              <TableHeader
                title="Grade Level"
                sortable
                onSort={() => handleSort("gradeLevel")}
                sortDirection={sortField === "gradeLevel" ? sortDirection : null}
              />
              <TableHeader
                title="Status"
                sortable
                onSort={() => handleSort("status")}
                sortDirection={sortField === "status" ? sortDirection : null}
              />
              <TableHeader
                title="Grade Average"
                sortable
                onSort={() => handleSort("gradeAverage")}
                sortDirection={sortField === "gradeAverage" ? sortDirection : null}
              />
              <TableHeader
                title="Attendance"
                sortable
                onSort={() => handleSort("attendance")}
                sortDirection={sortField === "attendance" ? sortDirection : null}
              />
              <TableHeader title="Actions" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {students.map((student) => {
              const { gradeAverage, attendancePercentage } = getStudentStats(student.Id);
              
              return (
                <tr 
                  key={student.Id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onView && onView(student)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {student.firstName?.[0]}{student.lastName?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-slate-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    Grade {student.gradeLevel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {gradeAverage > 0 ? (
                      <GradeBadge average={gradeAverage} />
                    ) : (
                      <span className="text-sm text-slate-500">No grades</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">
                          {attendancePercentage}%
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                          <div 
                            className={cn(
                              "h-1.5 rounded-full",
                              attendancePercentage >= 90 ? "bg-success" :
                              attendancePercentage >= 75 ? "bg-warning" : "bg-error"
                            )}
                            style={{ width: `${attendancePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView && onView(student);
                        }}
                      >
                        <ApperIcon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit && onEdit(student);
                        }}
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete && onDelete(student.Id);
                        }}
                        className="text-error hover:text-error hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;