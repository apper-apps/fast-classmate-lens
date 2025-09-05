import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentsService } from "@/services/api/studentsService";
import { gradesService } from "@/services/api/gradesService";
import { attendanceService } from "@/services/api/attendanceService";

const Students = () => {
  const { onMobileMenuToggle } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  // Sorting states
  const [sortField, setSortField] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    loadStudentsData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery, sortField, sortDirection]);

  const loadStudentsData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsData, gradesData, attendanceData] = await Promise.all([
        studentsService.getAll(),
        gradesService.getAll(),
        attendanceService.getAll()
      ]);

      setStudents(studentsData);
      setGrades(gradesData);
      setAttendance(attendanceData);
    } catch (err) {
      setError("Failed to load students data. Please try again.");
      console.error("Students data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.gradeLevel.toString().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "name":
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case "gradeAverage":
          const aGrades = grades.filter(g => g.studentId === a.Id);
          const bGrades = grades.filter(g => g.studentId === b.Id);
          aValue = aGrades.length > 0 ? aGrades.reduce((sum, g) => sum + g.score, 0) / aGrades.length : 0;
          bValue = bGrades.length > 0 ? bGrades.reduce((sum, g) => sum + g.score, 0) / bGrades.length : 0;
          break;
        case "attendance":
          const aAttendance = attendance.filter(att => att.studentId === a.Id);
          const bAttendance = attendance.filter(att => att.studentId === b.Id);
          const aPresent = aAttendance.filter(att => att.status === "present").length;
          const bPresent = bAttendance.filter(att => att.status === "present").length;
          aValue = aAttendance.length > 0 ? (aPresent / aAttendance.length) * 100 : 0;
          bValue = bAttendance.length > 0 ? (bPresent / bAttendance.length) * 100 : 0;
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredStudents(filtered);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      return;
    }

    try {
      await studentsService.delete(studentId);
      await loadStudentsData(); // Reload to ensure consistency
      toast.success("Student deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete student. Please try again.");
    }
  };

  const handleSaveStudent = async (studentData) => {
    try {
      if (modalMode === "edit") {
        await studentsService.update(selectedStudent.Id, studentData);
      } else {
        await studentsService.create(studentData);
      }
      await loadStudentsData(); // Reload to ensure consistency
    } catch (error) {
      throw error; // Let modal handle the error
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Students"
          subtitle="Manage your class roster and student information"
          onMobileMenuToggle={onMobileMenuToggle}
          showSearch={true}
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          actions={[
            {
              label: "Add Student",
              icon: "UserPlus",
              onClick: handleAddStudent
            }
          ]}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Loading type="table" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Students"
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Error message={error} onRetry={loadStudentsData} />
        </main>
      </div>
    );
  }

  if (students.length === 0 && !loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Students"
          subtitle="Manage your class roster and student information"
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Empty
            title="No students enrolled"
            message="Start building your class by adding your first student."
            icon="Users"
            action={handleAddStudent}
            actionLabel="Add First Student"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Students"
        subtitle={`Managing ${students.length} students`}
        onMobileMenuToggle={onMobileMenuToggle}
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        actions={[
          {
            label: "Add Student",
            icon: "UserPlus",
            onClick: handleAddStudent
          }
        ]}
      />

      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <StudentTable
            students={filteredStudents}
            grades={grades}
            attendance={attendance}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onView={handleViewStudent}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>
      </main>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        onSave={handleSaveStudent}
        mode={modalMode}
      />
    </div>
  );
};

export default Students;