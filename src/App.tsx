import { useState } from 'react';
import { useStudents } from './hooks/useStudents';
import type { Student } from './types';
import StudentModal from './components/StudentModal';
import ConfirmModal from './components/ConfirmModal';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  GraduationCap,
  MapPin
} from 'lucide-react';

function App() {
  const { students, isLoading, addStudent, updateStudent, deleteStudent } = useStudents();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  const filteredStudents = students.filter(student => {
    const searchString = `${student.firstName} ${student.lastName} ${student.nickname} ${student.id}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase()) && student.status === 'Active';
  });

  const handleAddClick = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingStudentId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSaveStudent = (data: Omit<Student, 'id'>) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, data);
    } else {
      // Generate a simple ID for demo
      const newId = (students.length > 0 
        ? Math.max(...students.map(s => parseInt(s.id))) + 1 
        : 65001).toString();
      addStudent({ ...data, id: newId });
    }
  };

  const handleConfirmDelete = () => {
    if (deletingStudentId) {
      deleteStudent(deletingStudentId);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-blue-500/30 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ระบบจัดการสมาชิกในชั้นเรียน</h1>
              <p className="text-sm text-slate-500">จัดการข้อมูลและรายชื่อนักเรียนทั้งหมด</p>
            </div>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
          >
            <UserPlus size={18} />
            เพิ่มนักเรียน
          </button>
        </header>

        {/* Tools Section */}
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, นามสกุล, ชื่อเล่น หรือ รหัสนักเรียน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
            />
          </div>
          <div className="text-sm font-medium text-slate-500">
            จำนวนนักเรียน: <span className="text-slate-800">{filteredStudents.length}</span> คน
          </div>
        </div>

        {/* Student List Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
              <div key={student.id} className="glass-card rounded-2xl p-6 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg border-2 border-white shadow-sm">
                      {student.firstName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg leading-tight">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-slate-500">น้อง{student.nickname}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-lg">
                    รหัส {student.id}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>{student.role === 'Student' ? 'นักเรียน' : student.role === 'Class President' ? 'หัวหน้าห้อง' : 'รองหัวหน้าห้อง'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{student.address || '-'}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    onClick={() => handleEditClick(student)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="แก้ไขข้อมูล"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(student.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="ลบข้อมูล"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400">
              <Users className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">ไม่พบข้อมูลนักเรียน</p>
              <p className="text-sm">ลองค้นหาด้วยคำอื่น หรือเพิ่มนักเรียนใหม่</p>
            </div>
            )}
          </div>
        )}
      </div>

      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        student={editingStudent}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="ยืนยันการลบข้อมูล"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนักเรียนคนนี้? การดำเนินการนี้ไม่สามารถเรียกคืนได้"
      />
    </div>
  );
}

export default App;
