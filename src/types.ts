export interface Student {
  id: string; // e.g., 65001
  firstName: string;
  lastName: string;
  nickname: string;
  role: 'Student' | 'Class President' | 'Vice President';
  status: 'Active' | 'Inactive';
  address: string;
}
