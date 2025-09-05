import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import GradesList from "@/components/organisms/GradesList";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { assignmentsService } from "@/services/api/assignmentsService";
import { gradesService } from "@/services/api/gradesService";
import { studentsService } from "@/services/api/studentsService";

const Grades = () => {
  const { onMobileMenuToggle } = useOutletContext();
const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  useEffect(() => {
    loadGradesData();
  }, []);

  const loadGradesData = async () => {
    try {
      setLoading(true);
      setError("");

      const [assignmentsData, gradesData, studentsData] = await Promise.all([
        assignmentsService.getAll(),
        gradesService.getAll(),
        studentsService.getAll()
      ]);

      setAssignments(assignmentsData);
      setGrades(gradesData);
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load grades data. Please try again.");
      console.error("Grades data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

const handleCreateAssignment = () => {
    setIsAssignmentModalOpen(true);
  };

  const handleAssignmentCreated = (newAssignment) => {
    setAssignments(prev => [...prev, newAssignment]);
  };

  const handleViewGrades = (assignment) => {
    // This would typically open a grade entry/viewing modal
    toast.info(`Viewing grades for "${assignment.title}" - functionality coming soon!`);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Grades"
          subtitle="Manage assignments and student grades"
          onMobileMenuToggle={onMobileMenuToggle}
          actions={[
            {
              label: "New Assignment",
              icon: "Plus",
              onClick: handleCreateAssignment
            }
          ]}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Loading type="list" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Grades"
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Error message={error} onRetry={loadGradesData} />
        </main>
      </div>
    );
  }

  if (assignments.length === 0 && !loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Grades"
          subtitle="Manage assignments and student grades"
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Empty
            title="No assignments created"
            message="Create your first assignment to start tracking student grades and performance."
            icon="GraduationCap"
            action={handleCreateAssignment}
            actionLabel="Create First Assignment"
          />
        </main>
      </div>
    );
  }

return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Grades"
        subtitle={`${assignments.length} assignments • ${grades.length} grades recorded`}
        onMobileMenuToggle={onMobileMenuToggle}
        actions={[
          {
            label: "New Assignment",
            icon: "Plus",
            onClick: handleCreateAssignment
          }
        ]}
      />

      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <GradesList
            assignments={assignments}
            grades={grades}
            students={students}
            onCreateAssignment={handleCreateAssignment}
            onViewGrades={handleViewGrades}
          />
        </div>
      </main>

      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        onAssignmentCreated={handleAssignmentCreated}
      />
    </div>
  );
};

export default Grades;