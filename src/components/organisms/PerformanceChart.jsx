import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { format, parseISO, isAfter, isBefore, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { gradesService } from '@/services/api/gradesService';
import { assignmentsService } from '@/services/api/assignmentsService';
import { calculateGradeTrend, formatChartData } from '@/utils/gradeUtils';

const PerformanceChart = ({ studentId, className }) => {
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState('all');
  const [chartData, setChartData] = useState({ series: [], options: {} });

  const periodOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'last60', label: 'Last 60 Days' },
    { value: 'last90', label: 'Last 90 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' }
  ];

  useEffect(() => {
    fetchData();
  }, [studentId]);

  useEffect(() => {
    if (grades.length > 0 && assignments.length > 0) {
      updateChartData();
    }
  }, [grades, assignments, selectedPeriod, selectedAssignment]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [gradesData, assignmentsData] = await Promise.all([
        gradesService.getByStudentId(studentId),
        assignmentsService.getAll()
      ]);
      
      setGrades(gradesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError('Failed to load performance data');
      console.error('Error fetching performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterGradesByPeriod = (gradesData) => {
    if (selectedPeriod === 'all') return gradesData;
    
    const now = new Date();
    let startDate, endDate;
    
    switch (selectedPeriod) {
      case 'last30':
        startDate = subMonths(now, 1);
        endDate = now;
        break;
      case 'last60':
        startDate = subMonths(now, 2);
        endDate = now;
        break;
      case 'last90':
        startDate = subMonths(now, 3);
        endDate = now;
        break;
      case 'thisMonth':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'lastMonth':
        startDate = startOfMonth(subMonths(now, 1));
        endDate = endOfMonth(subMonths(now, 1));
        break;
      default:
        return gradesData;
    }
    
return gradesData.filter(grade => {
      if (!grade.submittedDate || typeof grade.submittedDate !== 'string') {
        return false;
      }
      try {
        const gradeDate = parseISO(grade.submittedDate);
        return !isNaN(gradeDate.getTime()) && isAfter(gradeDate, startDate) && isBefore(gradeDate, endDate);
      } catch (error) {
        return false;
      }
    });
  };

  const filterGradesByAssignment = (gradesData) => {
    if (selectedAssignment === 'all') return gradesData;
    return gradesData.filter(grade => grade.assignmentId === parseInt(selectedAssignment));
  };

  const updateChartData = () => {
    let filteredGrades = filterGradesByPeriod(grades);
    filteredGrades = filterGradesByAssignment(filteredGrades);
    
    if (filteredGrades.length === 0) {
      setChartData({ series: [], options: {} });
      return;
    }
    
// Sort grades by submission date
    const sortedGrades = filteredGrades.sort((a, b) => {
      const dateA = a.submittedDate && !isNaN(new Date(a.submittedDate).getTime()) ? new Date(a.submittedDate) : new Date(0);
      const dateB = b.submittedDate && !isNaN(new Date(b.submittedDate).getTime()) ? new Date(b.submittedDate) : new Date(0);
      return dateA - dateB;
    });
    
    // Create data points for the chart
const dataPoints = sortedGrades.map(grade => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      let formattedDate = 'Invalid Date';
      
      if (grade.submittedDate && typeof grade.submittedDate === 'string') {
        try {
          const parsedDate = parseISO(grade.submittedDate);
if (parsedDate && !isNaN(parsedDate.getTime()) && parsedDate.getTime() !== 0) {
            formattedDate = format(parsedDate, 'MMM dd');
          }
        } catch (error) {
          formattedDate = 'Invalid Date';
        }
      }
      
      return {
        x: formattedDate,
        y: grade.score,
        assignment: assignment?.title || 'Unknown Assignment',
        category: assignment?.category || 'N/A'
      };
    });
    
    // Calculate trend line
    const trendData = calculateGradeTrend(dataPoints);
    
    const series = [
      {
        name: 'Grades',
        data: dataPoints.map(point => ({ x: point.x, y: point.y })),
        type: 'scatter'
      },
      {
        name: 'Trend',
        data: trendData,
        type: 'line'
      }
    ];
    
    const options = {
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: ['#2563EB', '#10B981'],
      stroke: {
        curve: 'smooth',
        width: [0, 3]
      },
      markers: {
        size: [6, 0],
        hover: {
          sizeOffset: 2
        }
      },
      xaxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          formatter: (val) => `${val}%`,
          style: {
            fontSize: '12px'
          }
        }
      },
      tooltip: {
        shared: false,
        intersect: true,
        y: {
          formatter: (val, { seriesIndex, dataPointIndex }) => {
            if (seriesIndex === 0 && dataPoints[dataPointIndex]) {
              const point = dataPoints[dataPointIndex];
              return `<div>
                <strong>${val}%</strong><br/>
                <span style="color: #64748B">${point.assignment}</span><br/>
                <span style="color: #64748B; font-size: 11px">${point.category}</span>
              </div>`;
            }
            return `${val}%`;
          }
        }
      },
      grid: {
        borderColor: '#E2E8F0',
        strokeDashArray: 3
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      }
    };
    
    setChartData({ series, options });
  };

  const assignmentOptions = [
    { value: 'all', label: 'All Assignments' },
    ...assignments.map(assignment => ({
      value: assignment.Id.toString(),
      label: assignment.title
    }))
  ];

  const getPerformanceStats = () => {
    let filteredGrades = filterGradesByPeriod(grades);
    filteredGrades = filterGradesByAssignment(filteredGrades);
    
    if (filteredGrades.length === 0) return null;
    
    const scores = filteredGrades.map(g => g.score);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const trend = calculateGradeTrend(filteredGrades.map((grade, index) => ({
      x: index,
      y: grade.score
    })));
    
    const trendDirection = trend.length > 1 && trend[trend.length - 1].y > trend[0].y ? 'up' : 'down';
    
    return { average, highest, lowest, total: filteredGrades.length, trend: trendDirection };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchData} />;

  const stats = getPerformanceStats();

  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="TrendingUp" size={20} className="text-primary" />
              <span>Performance Chart</span>
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                options={periodOptions}
                className="min-w-[140px]"
              />
              <Select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                options={assignmentOptions}
                className="min-w-[140px]"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{Math.round(stats.average)}%</div>
                <div className="text-sm text-slate-600">Average</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.highest}%</div>
                <div className="text-sm text-slate-600">Highest</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.lowest}%</div>
                <div className="text-sm text-slate-600">Lowest</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
                <div className="text-sm text-slate-600">Assignments</div>
              </div>
            </div>
          )}
          
          {chartData.series.length > 0 ? (
            <div className="w-full">
              <Chart
                options={chartData.options}
                series={chartData.series}
                height={350}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <ApperIcon name="BarChart3" size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceChart;