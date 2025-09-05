import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  async getByStudentId(studentId) {
    await delay(200);
    const studentAttendance = attendance.filter(a => a.studentId === parseInt(studentId));
    return [...studentAttendance];
  },

  async getByDate(date) {
    await delay(200);
    const dayAttendance = attendance.filter(a => a.date === date);
    return [...dayAttendance];
  },

  async getById(id) {
    await delay(200);
    const record = attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async create(attendanceData) {
    await delay(400);
    const newId = Math.max(...attendance.map(a => a.Id), 0) + 1;
    const newRecord = {
      Id: newId,
      ...attendanceData
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay(400);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance[index] = { ...attendance[index], ...attendanceData };
    return { ...attendance[index] };
  },

  async delete(id) {
    await delay(300);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    const deletedRecord = attendance.splice(index, 1)[0];
    return { ...deletedRecord };
  },

  async markAttendance(studentId, date, status, notes = "") {
    await delay(400);
    const existingRecordIndex = attendance.findIndex(a => 
      a.studentId === parseInt(studentId) && a.date === date
    );

    if (existingRecordIndex !== -1) {
      attendance[existingRecordIndex] = {
        ...attendance[existingRecordIndex],
        status,
        notes
      };
      return { ...attendance[existingRecordIndex] };
    } else {
      return await this.create({
        studentId: parseInt(studentId),
        date,
        status,
        notes
      });
    }
  },

  async getDateRange(startDate, endDate) {
    await delay(250);
    const filtered = attendance.filter(record => {
      const recordDate = new Date(record.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return recordDate >= start && recordDate <= end;
    });
    return [...filtered];
  }
};