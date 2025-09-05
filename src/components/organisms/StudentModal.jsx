import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

const StudentModal = ({ 
  isOpen, 
  onClose, 
  student = null, 
  onSave,
  mode = "add" // "add", "edit", "view"
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gradeLevel: 9,
    status: "active"
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (student && (mode === "edit" || mode === "view")) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        gradeLevel: student.gradeLevel || 9,
        status: student.status || "active"
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        gradeLevel: 9,
        status: "active"
      });
    }
    setErrors({});
  }, [student, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.gradeLevel || formData.gradeLevel < 1 || formData.gradeLevel > 12) {
      newErrors.gradeLevel = "Please select a valid grade level";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSaving(true);

    try {
      const studentData = {
        ...formData,
        gradeLevel: parseInt(formData.gradeLevel),
        enrollmentDate: student?.enrollmentDate || new Date().toISOString().split("T")[0]
      };

      if (mode === "edit") {
        await onSave({ ...studentData, Id: student.Id });
        toast.success("Student updated successfully!");
      } else {
        await onSave(studentData);
        toast.success("Student added successfully!");
      }

      onClose();
    } catch (error) {
      toast.error("Failed to save student. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case "edit": return "Edit Student";
      case "view": return "Student Details";
      default: return "Add New Student";
    }
  };

  const gradeOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Grade ${i + 1}`
  }));

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <Card className="w-full max-w-lg pointer-events-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <ApperIcon name="User" size={20} className="text-primary" />
                    <span>{getModalTitle()}</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                      disabled={mode === "view"}
                      placeholder="Enter first name"
                    />

                    <FormField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                      disabled={mode === "view"}
                      placeholder="Enter last name"
                    />
                  </div>

                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    disabled={mode === "view"}
                    placeholder="Enter email address"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Grade Level"
                      name="gradeLevel"
                      type="select"
                      value={formData.gradeLevel}
                      onChange={handleChange}
                      error={errors.gradeLevel}
                      disabled={mode === "view"}
                      options={gradeOptions}
                    />

                    <FormField
                      label="Status"
                      name="status"
                      type="select"
                      value={formData.status}
                      onChange={handleChange}
                      error={errors.status}
                      disabled={mode === "view"}
                      options={statusOptions}
                    />
                  </div>

                  {mode !== "view" && (
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="btn-pulse"
                      >
                        {isSaving && (
                          <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        )}
                        {mode === "edit" ? "Update Student" : "Add Student"}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StudentModal;