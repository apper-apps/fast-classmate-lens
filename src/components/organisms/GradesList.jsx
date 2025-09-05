import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import GradeBadge from "@/components/molecules/GradeBadge";
import { calculateAssignmentStats } from "@/utils/gradeUtils";

const GradesList = ({ 
  assignments = [], 
  grades = [], 
  students = [],
  onCreateAssignment,
  onViewGrades
}) => {
  const [sortField, setSortField] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("desc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

const sortedAssignments = [...assignments].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

if (sortField === "dueDate") {
      // Handle date sorting with proper validation
      aValue = aValue && aValue !== null && aValue !== undefined ? new Date(aValue) : null;
      bValue = bValue && bValue !== null && bValue !== undefined ? new Date(bValue) : null;
      aValue = aValue && !isNaN(aValue.getTime()) ? aValue : new Date(0);
      bValue = bValue && !isNaN(bValue.getTime()) ? bValue : new Date(0);
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getAssignmentGrades = (assignmentId) => {
    return grades.filter(grade => grade.assignmentId === assignmentId);
  };

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ApperIcon name="GraduationCap" size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No assignments yet</h3>
          <p className="text-slate-600 mb-6">Create your first assignment to start tracking grades.</p>
          <Button onClick={onCreateAssignment}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Assignment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="GraduationCap" size={20} className="text-primary" />
            <span>Assignments & Grades</span>
          </CardTitle>
          <Button onClick={onCreateAssignment}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            <span className="hidden sm:inline">New Assignment</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th 
                  className="text-left py-3 px-4 font-medium text-slate-700 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Assignment</span>
                    <ApperIcon 
                      name={sortField === "title" && sortDirection === "asc" ? "ChevronUp" : "ChevronDown"} 
                      size={12}
                      className={cn(
                        "opacity-50",
                        sortField === "title" && "opacity-100"
                      )}
                    />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium text-slate-700 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    <ApperIcon 
                      name={sortField === "category" && sortDirection === "asc" ? "ChevronUp" : "ChevronDown"} 
                      size={12}
                      className={cn(
                        "opacity-50",
                        sortField === "category" && "opacity-100"
                      )}
                    />
                  </div>
                </th>
                <th 
                  className="text-center py-3 px-4 font-medium text-slate-700 cursor-pointer hover:text-slate-900"
                  onClick={() => handleSort("dueDate")}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Due Date</span>
                    <ApperIcon 
                      name={sortField === "dueDate" && sortDirection === "asc" ? "ChevronUp" : "ChevronDown"} 
                      size={12}
                      className={cn(
                        "opacity-50",
                        sortField === "dueDate" && "opacity-100"
                      )}
                    />
                  </div>
                </th>
                <th className="text-center py-3 px-4 font-medium text-slate-700">
                  Points
                </th>
                <th className="text-center py-3 px-4 font-medium text-slate-700">
                  Submissions
                </th>
                <th className="text-center py-3 px-4 font-medium text-slate-700">
                  Average
                </th>
                <th className="text-center py-3 px-4 font-medium text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedAssignments.map(assignment => {
                const assignmentGrades = getAssignmentGrades(assignment.Id);
                const stats = calculateAssignmentStats(assignmentGrades, assignment.totalPoints);
                
                return (
                  <tr key={assignment.Id} className="hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-slate-900">{assignment.title}</p>
                        {assignment.description && (
                          <p className="text-sm text-slate-500 mt-1 truncate max-w-xs">
                            {assignment.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {assignment.category}
                      </span>
                    </td>
<td className="py-4 px-4 text-center text-sm text-slate-900">
                      {(() => {
if (!assignment.due_date_c || assignment.due_date_c === null || assignment.due_date_c === undefined) return "No Due Date";
                        const dueDate = new Date(assignment.due_date_c);
                        return dueDate && !isNaN(dueDate.getTime()) && dueDate.getTime() !== 0 
                          ? format(dueDate, "MMM dd, yyyy") 
                          : "No Due Date";
                      })()}
                    </td>
                    <td className="py-4 px-4 text-center text-sm font-medium text-slate-900">
                      {assignment.totalPoints}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm text-slate-600">
                        {stats.submitted} / {students.length}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {stats.submitted > 0 ? (
                        <GradeBadge average={stats.average} />
                      ) : (
                        <span className="text-sm text-slate-500">No grades</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewGrades && onViewGrades(assignment)}
                      >
                        <ApperIcon name="Eye" size={16} className="mr-1" />
                        <span className="hidden sm:inline">View Grades</span>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradesList;