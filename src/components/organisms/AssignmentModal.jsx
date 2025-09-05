import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import FormField from '@/components/molecules/FormField';
import { assignmentsService } from '@/services/api/assignmentsService';

const AssignmentModal = ({ isOpen, onClose, onAssignmentCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalPoints: '',
    type: 'homework'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignmentTypes = [
    { value: 'homework', label: 'Homework' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'exam', label: 'Exam' },
    { value: 'project', label: 'Project' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'lab', label: 'Lab Work' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Assignment title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Assignment description is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    if (!formData.totalPoints || formData.totalPoints <= 0) {
      newErrors.totalPoints = 'Total points must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const assignmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        totalPoints: parseInt(formData.totalPoints),
        type: formData.type,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      const newAssignment = await assignmentsService.create(assignmentData);
      
      toast.success(`Assignment "${newAssignment.title}" created successfully!`);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        totalPoints: '',
        type: 'homework'
      });
      setErrors({});
      
      // Notify parent component and close modal
      onAssignmentCreated(newAssignment);
      onClose();
      
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to create assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    // Reset form when closing
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      totalPoints: '',
      type: 'homework'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
          <Card className="border-0 shadow-none">
            <CardHeader className="border-b border-slate-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Plus" size={20} className="text-primary" />
                  <span>Create New Assignment</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="hover:bg-slate-100"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  label="Assignment Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={errors.title}
                  placeholder="e.g., Chapter 5 Math Quiz"
                  disabled={isSubmitting}
                />
                
                <FormField
                  label="Description"
                  name="description"
                  type="textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={errors.description}
                  placeholder="Provide detailed instructions for the assignment..."
                  disabled={isSubmitting}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    error={errors.dueDate}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    disabled={isSubmitting}
                  />
                  
                  <FormField
                    label="Total Points"
                    name="totalPoints"
                    type="number"
                    value={formData.totalPoints}
                    onChange={handleInputChange}
                    error={errors.totalPoints}
                    placeholder="100"
                    min="1"
                    disabled={isSubmitting}
                  />
                </div>
                
                <FormField
                  label="Assignment Type"
                  name="type"
                  type="select"
                  value={formData.type}
                  onChange={handleInputChange}
                  options={assignmentTypes}
                  disabled={isSubmitting}
                />
                
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none"
                  >
                    {isSubmitting ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Plus" size={16} className="mr-2" />
                        Create Assignment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;