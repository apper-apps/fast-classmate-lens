import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { format, addWeeks, subWeeks } from "date-fns";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { studentsService } from "@/services/api/studentsService";
import { attendanceService } from "@/services/api/attendanceService";

const Attendance = () => {
  const { onMobileMenuToggle } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsData, attendanceData] = await Promise.all([
        studentsService.getAll(),
        attendanceService.getAll()
      ]);

      setStudents(studentsData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load attendance data. Please try again.");
      console.error("Attendance data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAttendance = async (studentId, date, status) => {
    try {
      const updatedRecord = await attendanceService.markAttendance(studentId, date, status);
      
      // Update local state
      setAttendance(prev => {
        const existingIndex = prev.findIndex(record => 
          record.studentId === studentId && record.date === date
        );
        
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = updatedRecord;
          return updated;
        } else {
          return [...prev, updatedRecord];
        }
      });
    } catch (error) {
      throw error; // Let the grid handle the error
    }
  };

  const handlePreviousWeek = () => {
    setSelectedDate(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => addWeeks(prev, 1));
  };

  const handleTodayAttendance = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const todayRecords = attendance.filter(record => record.date === today);
    
    if (todayRecords.length === 0) {
      toast.info("No attendance recorded for today yet. Use the grid below to mark attendance.");
    } else {
      const present = todayRecords.filter(r => r.status === "present").length;
      const total = students.length;
      toast.success(`Today: ${present}/${total} students present`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Attendance"
          subtitle="Track daily student attendance"
          onMobileMenuToggle={onMobileMenuToggle}
          actions={[
            {
              label: "Quick Mark",
              icon: "CheckCircle",
              onClick: handleTodayAttendance
            }
          ]}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Loading />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Attendance"
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Error message={error} onRetry={loadAttendanceData} />
        </main>
      </div>
    );
  }

  if (students.length === 0 && !loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Attendance"
          subtitle="Track daily student attendance"
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Empty
            title="No students enrolled"
            message="Add students to your class to start tracking attendance."
            icon="Calendar"
            action={() => {/* Navigate to students page */}}
            actionLabel="Go to Students"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Attendance"
        subtitle={`Week of ${format(selectedDate, "MMM dd, yyyy")}`}
        onMobileMenuToggle={onMobileMenuToggle}
        actions={[
          {
            label: "Today's Status",
            icon: "CheckCircle",
            variant: "outline",
            onClick: handleTodayAttendance
          }
        ]}
      />

      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200">
            <Button
              variant="outline"
              onClick={handlePreviousWeek}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ChevronLeft" size={16} />
              <span>Previous Week</span>
            </Button>
            
            <div className="text-center">
              <h3 className="font-semibold text-slate-900">
                {format(selectedDate, "MMMM yyyy")}
              </h3>
              <p className="text-sm text-slate-500">
                Week of {format(selectedDate, "MMM dd")}
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={handleNextWeek}
              className="flex items-center space-x-2"
            >
              <span>Next Week</span>
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>

          {/* Attendance Grid */}
          <AttendanceGrid
            students={students}
            attendance={attendance}
            onUpdateAttendance={handleUpdateAttendance}
            selectedDate={selectedDate}
          />
        </div>
      </main>
    </div>
  );
};

export default Attendance;