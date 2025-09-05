import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import { studentsService } from "@/services/api/studentsService";
import { gradesService } from "@/services/api/gradesService";
import { attendanceService } from "@/services/api/attendanceService";
import { assignmentsService } from "@/services/api/assignmentsService";
import { calculateGradeAverage } from "@/utils/gradeUtils";
import { calculateAttendancePercentage, getTodayAttendanceStats } from "@/utils/attendanceUtils";
import { format } from "date-fns";

const Dashboard = () => {
  const { onMobileMenuToggle } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentsService.getAll(),
        gradesService.getAll(),
        attendanceService.getAll(),
        assignmentsService.getAll()
      ]);

      setStudents(studentsData);
      setGrades(gradesData);
      setAttendance(attendanceData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening in your classroom."
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Loading type="cards" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard"
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Error message={error} onRetry={loadDashboardData} />
        </main>
      </div>
    );
  }

  // Calculate dashboard statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  const totalAssignments = assignments.length;
  const classGradeAverage = calculateGradeAverage(grades);
  
  const todayStats = getTodayAttendanceStats(students, attendance);
  
  // Recent activity - latest grades and attendance
  const recentGrades = grades
    .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
    .slice(0, 5);

  const recentAttendance = attendance
    .filter(record => record.status !== "present")
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown";
  };

  const getAssignmentName = (assignmentId) => {
    const assignment = assignments.find(a => a.Id === assignmentId);
    return assignment ? assignment.title : "Unknown Assignment";
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening in your classroom."
        onMobileMenuToggle={onMobileMenuToggle}
      />
      
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value={totalStudents}
              subtitle={`${activeStudents} active`}
              icon="Users"
              color="primary"
            />
            
            <StatCard
              title="Today's Attendance"
              value={`${todayStats.percentage}%`}
              subtitle={`${todayStats.present}/${todayStats.total} present`}
              icon="Calendar"
              color="success"
            />
            
            <StatCard
              title="Class Average"
              value={`${classGradeAverage}%`}
              subtitle="All assignments"
              icon="TrendingUp"
              color="secondary"
            />
            
            <StatCard
              title="Assignments"
              value={totalAssignments}
              subtitle="This semester"
              icon="BookOpen"
              color="warning"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Grades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Award" size={20} className="text-primary" />
                  <span>Recent Grades</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentGrades.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="GraduationCap" size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-500">No grades recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentGrades.map((grade) => (
                      <div key={grade.Id} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 text-sm">
                            {getStudentName(grade.studentId)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {getAssignmentName(grade.assignmentId)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-900">
                            {grade.score}%
                          </span>
                          <span className={`w-2 h-2 rounded-full ${
                            grade.score >= 90 ? "bg-success" :
                            grade.score >= 80 ? "bg-blue-500" :
                            grade.score >= 70 ? "bg-warning" : "bg-error"
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attendance Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="AlertTriangle" size={20} className="text-warning" />
                  <span>Attendance Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentAttendance.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="Check" size={32} className="mx-auto text-green-300 mb-2" />
                    <p className="text-slate-500">All students present recently!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAttendance.map((record) => (
                      <div key={record.Id} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 text-sm">
                            {getStudentName(record.studentId)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(record.date), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusBadge status={record.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Zap" size={20} className="text-accent" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-gradient-to-r from-primary/10 to-blue-50 rounded-lg hover:from-primary/20 hover:to-blue-100 transition-all duration-200 text-left group">
                  <ApperIcon name="UserPlus" size={24} className="text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-slate-900 text-sm">Add Student</p>
                  <p className="text-xs text-slate-500">Enroll new student</p>
                </button>
                
                <button className="p-4 bg-gradient-to-r from-success/10 to-green-50 rounded-lg hover:from-success/20 hover:to-green-100 transition-all duration-200 text-left group">
                  <ApperIcon name="Calendar" size={24} className="text-success mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-slate-900 text-sm">Take Attendance</p>
                  <p className="text-xs text-slate-500">Mark today's attendance</p>
                </button>
                
                <button className="p-4 bg-gradient-to-r from-secondary/10 to-purple-50 rounded-lg hover:from-secondary/20 hover:to-purple-100 transition-all duration-200 text-left group">
                  <ApperIcon name="Plus" size={24} className="text-secondary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-slate-900 text-sm">New Assignment</p>
                  <p className="text-xs text-slate-500">Create assignment</p>
                </button>
                
                <button className="p-4 bg-gradient-to-r from-warning/10 to-amber-50 rounded-lg hover:from-warning/20 hover:to-amber-100 transition-all duration-200 text-left group">
                  <ApperIcon name="BarChart3" size={24} className="text-warning mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-slate-900 text-sm">Grade Book</p>
                  <p className="text-xs text-slate-500">Enter grades</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;