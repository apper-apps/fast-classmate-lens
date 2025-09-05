import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradesService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getByStudentId(studentId) {
await delay(200);
    const studentGrades = grades.filter(g => g.studentId === parseInt(studentId));
    return [...studentGrades];
  },

  async getByStudentIdWithFilter(studentId, filters = {}) {
    await delay(200);
    let studentGrades = grades.filter(g => g.studentId === parseInt(studentId));
    
    if (filters.startDate) {
      studentGrades = studentGrades.filter(g => g.submittedDate >= filters.startDate);
    }
    
    if (filters.endDate) {
      studentGrades = studentGrades.filter(g => g.submittedDate <= filters.endDate);
    }
    
    if (filters.assignmentId) {
      studentGrades = studentGrades.filter(g => g.assignmentId === parseInt(filters.assignmentId));
    }
    
    return [...studentGrades];
  },

  async getByAssignmentId(assignmentId) {
    await delay(200);
    const assignmentGrades = grades.filter(g => g.assignmentId === parseInt(assignmentId));
    return [...assignmentGrades];
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  async create(gradeData) {
    await delay(400);
    const newId = Math.max(...grades.map(g => g.Id), 0) + 1;
    const newGrade = {
      Id: newId,
      ...gradeData,
      submittedDate: gradeData.submittedDate || new Date().toISOString().split("T")[0]
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(400);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades[index] = { ...grades[index], ...gradeData };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    const deletedGrade = grades.splice(index, 1)[0];
    return { ...deletedGrade };
  },

  async upsertGrade(studentId, assignmentId, score, comments = "") {
    await delay(400);
    const existingGradeIndex = grades.findIndex(g => 
      g.studentId === parseInt(studentId) && g.assignmentId === parseInt(assignmentId)
    );

    if (existingGradeIndex !== -1) {
      grades[existingGradeIndex] = {
        ...grades[existingGradeIndex],
        score: parseFloat(score),
        comments,
        submittedDate: new Date().toISOString().split("T")[0]
      };
      return { ...grades[existingGradeIndex] };
    } else {
      return await this.create({
        studentId: parseInt(studentId),
        assignmentId: parseInt(assignmentId),
        score: parseFloat(score),
        comments
      });
    }
  }
};