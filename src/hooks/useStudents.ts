import { useState, useEffect } from 'react';
import type { Student } from '../types';

const STORAGE_KEY = 'class-manager-students';

const initialStudents: Student[] = [
  {
    id: '65001',
    firstName: 'Somchai',
    lastName: 'Jaidee',
    nickname: 'Chai',
    role: 'Class President',
    status: 'Active',
    address: '123 Sukhumvit Rd, Bangkok',
  },
  {
    id: '65002',
    firstName: 'Suda',
    lastName: 'Maneerat',
    nickname: 'Da',
    role: 'Student',
    status: 'Active',
    address: '45/1 Phayathai, Bangkok',
  },
];

export function useStudents() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse students from local storage');
      }
    }
    return initialStudents;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const addStudent = (student: Student) => {
    setStudents((prev) => [...prev, student]);
  };

  const updateStudent = (id: string, updatedData: Omit<Student, 'id'>) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, ...updatedData } : student))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, status: 'Inactive' } : s)); // Soft delete for safety, but could be hard delete
  };
  
  const hardDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    hardDeleteStudent,
  };
}
