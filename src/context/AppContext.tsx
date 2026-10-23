import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TabId,
  Student,
  GradeItem,
  LearningMaterial,
  HomeroomLog,
  TeacherProfile,
} from '../types';
import {
  initialTeacherProfile,
  initialStudents,
  initialGrades,
  initialLearningMaterials,
  initialHomeroomLogs,
} from '../data/initialData';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

interface AppContextType {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  teacher: TeacherProfile;
  updateTeacher: (profile: Partial<TeacherProfile>) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'isDemo'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  clearSampleData: () => void;
  resetSampleData: () => void;
  grades: Record<string, GradeItem>;
  updateGradeItem: (studentId: string, item: Partial<GradeItem>) => void;
  isGradeLocked: boolean;
  setIsGradeLocked: (locked: boolean) => void;
  materials: LearningMaterial[];
  addMaterial: (material: Omit<LearningMaterial, 'id' | 'dateAdded' | 'downloadCount'>) => void;
  deleteMaterial: (id: string) => void;
  homeroomLogs: HomeroomLog[];
  addHomeroomLog: (log: Omit<HomeroomLog, 'id'>) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  quickToast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Teacher Profile
  const [teacher, setTeacher] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem('nq_teacher_profile');
    return saved ? JSON.parse(saved) : initialTeacherProfile;
  });

  // Students
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('nq_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  // Grades
  const [grades, setGrades] = useState<Record<string, GradeItem>>(() => {
    const saved = localStorage.getItem('nq_grades');
    return saved ? JSON.parse(saved) : initialGrades;
  });

  const [isGradeLocked, setIsGradeLocked] = useState<boolean>(false);

  // Materials
  const [materials, setMaterials] = useState<LearningMaterial[]>(() => {
    const saved = localStorage.getItem('nq_materials');
    return saved ? JSON.parse(saved) : initialLearningMaterials;
  });

  // Homeroom logs
  const [homeroomLogs, setHomeroomLogs] = useState<HomeroomLog[]>(() => {
    const saved = localStorage.getItem('nq_homeroom_logs');
    return saved ? JSON.parse(saved) : initialHomeroomLogs;
  });

  // Search & Modals
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickToast, setQuickToast] = useState<string | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Lịch nộp đề kiểm tra giữa kỳ II',
      message: 'Tổ Vật lí THPT Ngô Quyền hoàn thành nộp ma trận và đề kiểm tra trước ngày 25.',
      date: 'Hôm nay 08:30',
      read: false,
      type: 'warning',
    },
    {
      id: 'notif-2',
      title: 'Họp giao ban GVCN Khối 10',
      message: 'Thời gian 14h00 chiều Thứ Sáu tại phòng Hội đồng sư phạm.',
      date: 'Hôm qua 16:15',
      read: false,
      type: 'info',
    },
    {
      id: 'notif-3',
      title: 'Khen thưởng học sinh tiến bộ',
      message: 'Em Nguyễn Minh Anh và Phạm Gia Hân đạt điểm 10 thực hành Vật lí.',
      date: '20/10/2026',
      read: false,
      type: 'success',
    },
  ]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('nq_teacher_profile', JSON.stringify(teacher));
  }, [teacher]);

  useEffect(() => {
    localStorage.setItem('nq_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('nq_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('nq_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('nq_homeroom_logs', JSON.stringify(homeroomLogs));
  }, [homeroomLogs]);

  const showToast = (msg: string) => {
    setQuickToast(msg);
    setTimeout(() => {
      setQuickToast(null);
    }, 3500);
  };

  const updateTeacher = (profile: Partial<TeacherProfile>) => {
    setTeacher((prev) => ({ ...prev, ...profile }));
    showToast('Đã cập nhật thông tin giáo viên!');
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'isDemo'>) => {
    const newCount = students.length + 1;
    const newId = `HS10A5-${newCount.toString().padStart(2, '0')}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
      isDemo: false,
    };
    setStudents((prev) => [newStudent, ...prev]);
    // Initialize default grade item
    setGrades((prev) => ({
      ...prev,
      [newId]: { studentId: newId, tx1: 8.0, tx2: 8.0, tx3: 8.0, tx4: 8.0, gk: 8.0, ck: 8.0 },
    }));
    showToast(`Đã thêm học sinh: ${studentData.name} (${newId})`);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast(`Đã cập nhật thông tin học sinh ${id}`);
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast(`Đã xóa học sinh ${id} khỏi danh sách`);
  };

  const clearSampleData = () => {
    setStudents([]);
    setGrades({});
    showToast('Đã xóa toàn bộ dữ liệu học sinh mẫu. Hệ thống sẵn sàng nhập dữ liệu thực!');
  };

  const resetSampleData = () => {
    setStudents(initialStudents);
    setGrades(initialGrades);
    setMaterials(initialLearningMaterials);
    setHomeroomLogs(initialHomeroomLogs);
    showToast('Đã khôi phục dữ liệu mẫu chuẩn (31 học sinh lớp 10A5).');
  };

  const updateGradeItem = (studentId: string, item: Partial<GradeItem>) => {
    if (isGradeLocked) {
      showToast('Bảng điểm đang bị KHÓA. Vui lòng mở khóa để chỉnh sửa.');
      return;
    }
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { studentId }),
        ...item,
      },
    }));
  };

  const addMaterial = (matData: Omit<LearningMaterial, 'id' | 'dateAdded' | 'downloadCount'>) => {
    const newId = `MAT-${Date.now().toString().slice(-4)}`;
    const newMat: LearningMaterial = {
      ...matData,
      id: newId,
      dateAdded: new Date().toISOString().split('T')[0],
      downloadCount: 0,
    };
    setMaterials((prev) => [newMat, ...prev]);
    showToast(`Đã thêm học liệu mới: ${matData.title}`);
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    showToast('Đã xóa tài liệu học liệu.');
  };

  const addHomeroomLog = (logData: Omit<HomeroomLog, 'id'>) => {
    const newId = `LOG-${Date.now().toString().slice(-4)}`;
    const newLog: HomeroomLog = {
      ...logData,
      id: newId,
    };
    setHomeroomLogs((prev) => [newLog, ...prev]);
    showToast('Đã lưu nhật ký chủ nhiệm mới!');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        teacher,
        updateTeacher,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        clearSampleData,
        resetSampleData,
        grades,
        updateGradeItem,
        isGradeLocked,
        setIsGradeLocked,
        materials,
        addMaterial,
        deleteMaterial,
        homeroomLogs,
        addHomeroomLog,
        selectedStudentId,
        setSelectedStudentId,
        searchQuery,
        setSearchQuery,
        notifications,
        markNotificationRead,
        quickToast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
