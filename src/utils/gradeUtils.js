export const calculateGradeAverage = (grades) => {
  if (!grades || grades.length === 0) return 0;
  const total = grades.reduce((sum, grade) => sum + grade.score, 0);
  return Math.round((total / grades.length) * 10) / 10;
};

export const getLetterGrade = (average) => {
  if (average >= 90) return "A";
  if (average >= 80) return "B";
  if (average >= 70) return "C";
  if (average >= 60) return "D";
  return "F";
};

export const getGradeColor = (average) => {
  if (average >= 90) return "text-green-600";
  if (average >= 80) return "text-blue-600";
  if (average >= 70) return "text-yellow-600";
  if (average >= 60) return "text-orange-600";
  return "text-red-600";
};

export const getGradeBadgeClass = (letterGrade) => {
  switch (letterGrade) {
    case "A": return "grade-a";
    case "B": return "grade-b";
    case "C": return "grade-c";
    case "D": return "grade-d";
    case "F": return "grade-f";
    default: return "status-badge bg-gray-100 text-gray-800";
  }
};

export const calculateAssignmentStats = (grades, totalPoints) => {
  if (!grades || grades.length === 0) return { submitted: 0, average: 0, total: 0 };
  
  const submitted = grades.length;
  const average = calculateGradeAverage(grades);
  const total = totalPoints || 100;
  
  return { submitted, average, total };
};