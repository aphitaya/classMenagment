import { useState, useEffect } from 'react';
import type { Student } from '../types';
import { supabase } from '../lib/supabase';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching students:', error.message);
        return;
      }

      if (data) {
        // Map from DB snake_case to frontend camelCase
        const formattedData: Student[] = data.map((item: any) => ({
          id: item.id,
          firstName: item.first_name,
          lastName: item.last_name,
          nickname: item.nickname,
          role: item.role,
          status: item.status,
          address: item.address,
        }));
        setStudents(formattedData);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addStudent = async (student: Student) => {
    // Update local state immediately for fast UI
    setStudents((prev) => [...prev, student]);

    const { error } = await supabase.from('students').insert([
      {
        id: student.id,
        first_name: student.firstName,
        last_name: student.lastName,
        nickname: student.nickname,
        role: student.role,
        status: student.status,
        address: student.address,
      },
    ]);

    if (error) {
      console.error('Error adding student:', error.message);
      // Revert if error
      fetchStudents(); 
    }
  };

  const updateStudent = async (id: string, updatedData: Omit<Student, 'id'>) => {
    // Optimistic update
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, ...updatedData } : student))
    );

    const { error } = await supabase
      .from('students')
      .update({
        first_name: updatedData.firstName,
        last_name: updatedData.lastName,
        nickname: updatedData.nickname,
        role: updatedData.role,
        status: updatedData.status,
        address: updatedData.address,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating student:', error.message);
      fetchStudents();
    }
  };

  const deleteStudent = async (id: string) => {
    // Soft delete locally
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, status: 'Inactive' } : s));

    const { error } = await supabase
      .from('students')
      .update({ status: 'Inactive' })
      .eq('id', id);

    if (error) {
      console.error('Error deleting student:', error.message);
      fetchStudents();
    }
  };
  
  const hardDeleteStudent = async (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error hard deleting student:', error.message);
      fetchStudents();
    }
  };

  return {
    students,
    isLoading,
    addStudent,
    updateStudent,
    deleteStudent,
    hardDeleteStudent,
    refreshStudents: fetchStudents
  };
}
