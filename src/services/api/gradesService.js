const tableName = 'grade_c';

export const gradesService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "comments_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } }
        ],
        orderBy: [
          { fieldName: "submitted_date_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error("Error fetching grades:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
      } else {
        console.error("Error fetching grades:", error);
      }
      throw error;
    }
  },

  async getByStudentId(studentId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "comments_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } }
        ],
        where: [
          {
            FieldName: "student_id_c",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          }
        ],
        orderBy: [
          { fieldName: "submitted_date_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error("Error fetching student grades:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching student grades:", error?.response?.data?.message);
      } else {
        console.error("Error fetching student grades:", error);
      }
      throw error;
    }
  },

  async getByStudentIdWithFilter(studentId, filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const whereConditions = [
        {
          FieldName: "student_id_c",
          Operator: "EqualTo",
          Values: [parseInt(studentId)]
        }
      ];

      if (filters.startDate) {
        whereConditions.push({
          FieldName: "submitted_date_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.startDate]
        });
      }

      if (filters.endDate) {
        whereConditions.push({
          FieldName: "submitted_date_c",
          Operator: "LessThanOrEqualTo", 
          Values: [filters.endDate]
        });
      }

      if (filters.assignmentId) {
        whereConditions.push({
          FieldName: "assignment_id_c",
          Operator: "EqualTo",
          Values: [parseInt(filters.assignmentId)]
        });
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "comments_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } }
        ],
        where: whereConditions,
        orderBy: [
          { fieldName: "submitted_date_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error("Error fetching filtered student grades:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching filtered student grades:", error?.response?.data?.message);
      } else {
        console.error("Error fetching filtered student grades:", error);
      }
      throw error;
    }
  },

  async getByAssignmentId(assignmentId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "comments_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } }
        ],
        where: [
          {
            FieldName: "assignment_id_c",
            Operator: "EqualTo",
            Values: [parseInt(assignmentId)]
          }
        ],
        orderBy: [
          { fieldName: "submitted_date_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);

      if (!response.success) {
        console.error("Error fetching assignment grades:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignment grades:", error?.response?.data?.message);
      } else {
        console.error("Error fetching assignment grades:", error);
      }
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "comments_c" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "assignment_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Grade not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching grade with ID ${id}:`, error);
      }
      throw error;
    }
  },

  async create(gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Grade - ${gradeData.score_c || gradeData.score}`,
          score_c: parseFloat(gradeData.score_c || gradeData.score),
          submitted_date_c: gradeData.submitted_date_c || gradeData.submittedDate || new Date().toISOString().split("T")[0],
          comments_c: gradeData.comments_c || gradeData.comments || "",
          student_id_c: parseInt(gradeData.student_id_c || gradeData.studentId),
          assignment_id_c: parseInt(gradeData.assignment_id_c || gradeData.assignmentId),
          Tags: gradeData.Tags || ""
        }]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error("Error creating grade:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create grade ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error("Error creating grade:", error);
      }
      throw error;
    }
  },

  async update(id, gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Grade - ${gradeData.score_c || gradeData.score}`,
          score_c: parseFloat(gradeData.score_c || gradeData.score),
          submitted_date_c: gradeData.submitted_date_c || gradeData.submittedDate,
          comments_c: gradeData.comments_c || gradeData.comments || "",
          student_id_c: parseInt(gradeData.student_id_c || gradeData.studentId),
          assignment_id_c: parseInt(gradeData.assignment_id_c || gradeData.assignmentId),
          Tags: gradeData.Tags || ""
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error("Error updating grade:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update grade ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
      } else {
        console.error("Error updating grade:", error);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        console.error("Error deleting grade:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete grade ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return response.results.filter(result => result.success).length > 0;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error("Error deleting grade:", error);
      }
      throw error;
    }
  },

  async upsertGrade(studentId, assignmentId, score, comments = "") {
    try {
      // First check if record exists
      const existingGrades = await this.getByStudentId(studentId);
      const existingGrade = existingGrades.find(grade => {
        const gradeAssignmentId = grade.assignment_id_c?.Id || grade.assignment_id_c;
        return gradeAssignmentId === parseInt(assignmentId);
      });

      if (existingGrade) {
        // Update existing record
        return await this.update(existingGrade.Id, {
          score_c: parseFloat(score),
          comments_c: comments,
          submitted_date_c: new Date().toISOString().split("T")[0],
          student_id_c: parseInt(studentId),
          assignment_id_c: parseInt(assignmentId)
        });
      } else {
        // Create new record
        return await this.create({
          score_c: parseFloat(score),
          comments_c: comments,
          student_id_c: parseInt(studentId),
          assignment_id_c: parseInt(assignmentId)
        });
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error upserting grade:", error?.response?.data?.message);
      } else {
        console.error("Error upserting grade:", error);
      }
      throw error;
    }
  }
};