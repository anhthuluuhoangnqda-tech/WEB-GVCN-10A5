export type TabId =
  | 'overview'
  | 'physics_teaching'
  | 'homeroom_10a5'
  | 'students'
  | 'grades'
  | 'attendance'
  | 'materials'
  | 'ai_assistant'
  | 'reports'
  | 'settings';

export interface Student {
  id: string; // e.g. "HS10A5-01"
  name: string; // e.g. "Học sinh mẫu 01 - Nguyễn Minh Anh"
  gender: 'Nam' | 'Nữ';
  dob: string; // "2010-04-15"
  group: number; // 1 | 2 | 3 | 4
  role?: string; // "Lớp trưởng", "Tổ trưởng tổ 1", "Bí thư", "Học sinh"
  classId: string; // "10A5"
  status: 'Đang học' | 'Nghỉ học' | 'Chuyển trường';
  parentName: string;
  parentPhone: string;
  address: string;
  avatar?: string;
  isDemo: boolean;
  notes?: string;
}

export interface PhysicsTopic {
  id: string;
  name: string;
  gradeLevel: 10 | 11 | 12;
  description: string;
  averageScore: number;
  weakPoints: string[];
}

export interface GradeItem {
  studentId: string;
  tx1?: number; // Đánh giá thường xuyên 1
  tx2?: number; // Đánh giá thường xuyên 2
  tx3?: number; // Đánh giá thường xuyên 3
  tx4?: number; // Đánh giá thường xuyên 4
  gk?: number;  // Giữa kỳ (hệ số 2)
  ck?: number;  // Cuối kỳ (hệ số 3)
}

export interface SubjectGrade {
  subjectId: string;
  subjectName: string;
  teacherName: string;
  averageHK1?: number;
  averageHK2?: number;
}

export interface AttendanceRecord {
  id: string;
  date: string; // "YYYY-MM-DD"
  session: 'Sáng' | 'Chiều';
  classId: string;
  studentId: string;
  status: 'present' | 'excused' | 'unexcused' | 'late'; // Có mặt, Có phép, Không phép, Đi muộn
  note?: string;
}

export interface ConductRecord {
  id: string;
  studentId: string;
  date: string;
  type: 'positive' | 'warning' | 'violation' | 'resolved';
  category: 'Ý thức' | 'Học tập' | 'Nề nếp' | 'Phong trào';
  content: string;
  points: number; // + or -
}

export interface LearningMaterial {
  id: string;
  title: string;
  gradeLevel: 10 | 11 | 12;
  topic: string;
  category:
    | 'Bài giảng'
    | 'Giáo án'
    | 'Slide PowerPoint'
    | 'Video thí nghiệm'
    | 'Mô phỏng Vật lí'
    | 'Phiếu học tập'
    | 'Đề kiểm tra'
    | 'Đề ôn tập'
    | 'Đáp án & Hướng dẫn chấm';
  description: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'mp4' | 'sim' | 'link';
  fileSize?: string;
  url: string;
  dateAdded: string;
  downloadCount: number;
}

export interface HomeroomLog {
  id: string;
  date: string;
  week: number;
  title: string;
  summary: string;
  attendanceHighlights: string;
  academicHighlights: string;
  conductHighlights: string;
  actionItems: string[];
  parentNoticeDraft: string;
}

export interface TeacherProfile {
  name: string;
  title: string;
  homeroomClass: string;
  subject: string;
  school: string;
  cohort: string;
  academicYear: string;
  semester: 'Học kỳ I' | 'Học kỳ II';
  avatarUrl: string;
  email: string;
  phone: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isOfflineMode?: boolean;
}
