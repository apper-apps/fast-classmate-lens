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

export const calculateGradeTrend = (dataPoints) => {
  if (!dataPoints || dataPoints.length < 2) return [];
  
  // Simple linear regression for trend line
  const n = dataPoints.length;
  const sumX = dataPoints.reduce((sum, point, index) => sum + index, 0);
  const sumY = dataPoints.reduce((sum, point) => sum + point.y, 0);
  const sumXY = dataPoints.reduce((sum, point, index) => sum + (index * point.y), 0);
  const sumXX = dataPoints.reduce((sum, point, index) => sum + (index * index), 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return dataPoints.map((point, index) => ({
    x: point.x,
    y: Math.max(0, Math.min(100, slope * index + intercept))
  }));
};

export const formatChartData = (grades, assignments) => {
  if (!grades || !assignments || grades.length === 0) return { series: [], categories: [] };
  
  const sortedGrades = grades.sort((a, b) => {
const getValidDate = (dateValue) => {
      if (!dateValue || dateValue === null || dateValue === undefined) return new Date(0);
      const testDate = new Date(dateValue);
      return testDate && !isNaN(testDate.getTime()) && testDate.getTime() !== 0 ? testDate : new Date(0);
    };
    const dateA = getValidDate(a.submittedDate);
    const dateB = getValidDate(b.submittedDate);
    return dateA - dateB;
  });
  
  const dataPoints = sortedGrades.map(grade => {
    const assignment = assignments.find(a => a.Id === grade.assignmentId);
    return {
      x: grade.submittedDate,
      y: grade.score,
      assignment: assignment?.title || 'Unknown Assignment',
      category: assignment?.category || 'N/A'
    };
  });
  
  return {
    series: [{
      name: 'Grades',
      data: dataPoints
    }],
    categories: dataPoints.map(point => point.x)
  };
};

export const analyzePerformance = (grades) => {
  if (!grades || grades.length === 0) return null;
  
  const scores = grades.map(g => g.score);
  const average = calculateGradeAverage(grades);
  const trend = calculateGradeTrend(grades.map((grade, index) => ({ x: index, y: grade.score })));
  
  const isImproving = trend.length > 1 && trend[trend.length - 1].y > trend[0].y;
  const consistency = Math.max(...scores) - Math.min(...scores);
  
  return {
    average,
    trend: isImproving ? 'improving' : 'declining',
    consistency: consistency < 15 ? 'high' : consistency < 30 ? 'medium' : 'low',
    totalAssignments: grades.length
  };
};