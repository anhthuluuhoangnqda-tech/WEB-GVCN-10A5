import { Student, GradeItem, LearningMaterial, HomeroomLog, TeacherProfile, PhysicsTopic } from '../types';

export const initialTeacherProfile: TeacherProfile = {
  name: 'Lưu Hoàng Anh Thư',
  title: 'Giáo viên Vật lí – GVCN lớp 10A5',
  homeroomClass: '10A5',
  subject: 'Vật lí THPT',
  school: 'Trường THPT Ngô Quyền - Đông Anh',
  cohort: 'Khóa 2026–2029',
  academicYear: '2026–2027',
  semester: 'Học kỳ II',
  avatarUrl: '/assets/aistudio/B_ng__i_u_khi_n_gi_o_vi_n_Ng__Quy_n_EDU_f5321c16.png',
  email: 'anhthuluuhoang.nqda@gmail.com',
  phone: '0988.xxx.xxx',
};

const studentNames = [
  'Nguyễn Minh Anh',
  'Trần Phương Thảo',
  'Lê Hoàng Nam',
  'Phạm Gia Hân',
  'Đỗ Quang Minh',
  'Vũ Bảo Ngọc',
  'Hoàng Tuấn Kiệt',
  'Đặng Thùy Dương',
  'Bùi Đức Phúc',
  'Ngô Khánh Linh',
  'Dương Quốc Anh',
  'Lý Thu Hà',
  'Chu Minh Trí',
  'Tạ Diệu Huyền',
  'Đinh Văn Thắng',
  'Phan Thanh Mai',
  'Lương Hải Đăng',
  'Võ Yến Nhi',
  'Trịnh Đình Trọng',
  'Đào Quỳnh Trang',
  'Mai Anh Dũng',
  'Hà Cẩm Tú',
  'Lâm Tuấn Hưng',
  'Bạch Phương Uyên',
  'Thái Thành Đạt',
  'Quách Bảo Trâm',
  'Cao Việt Hoàng',
  'Ân Thúy An',
  'Nghiêm Văn Long',
  'Đoàn Khánh Ngân',
  'Vương Quốc Cường',
];

export const initialStudents: Student[] = Array.from({ length: 31 }, (_, i) => {
  const index = i + 1;
  const id = `HS10A5-${index.toString().padStart(2, '0')}`;
  const gender = i % 2 === 0 ? 'Nữ' : 'Nam';
  const group = (i % 4) + 1;
  const naturalName = studentNames[i] || `Nguyễn Văn ${String.fromCharCode(65 + i)}`;

  let role = 'Học sinh';
  if (index === 1) role = 'Lớp trưởng';
  else if (index === 2) role = 'Lớp phó học tập';
  else if (index === 3) role = 'Bí thư Chi đoàn';
  else if (index === 4) role = 'Tổ trưởng tổ 1';
  else if (index === 8) role = 'Tổ trưởng tổ 2';
  else if (index === 12) role = 'Tổ trưởng tổ 3';
  else if (index === 16) role = 'Tổ trưởng tổ 4';

  return {
    id,
    name: `Học sinh mẫu ${index.toString().padStart(2, '0')} (${naturalName})`,
    gender,
    dob: `2010-${((i % 12) + 1).toString().padStart(2, '0')}-${((i % 25) + 1).toString().padStart(2, '0')}`,
    group,
    role,
    classId: '10A5',
    status: 'Đang học',
    parentName: `Phụ huynh em ${naturalName}`,
    parentPhone: `0912.${(100 + i * 23).toString().padStart(3, '0')}.${(400 + i * 17).toString().padStart(3, '0')}`,
    address: `Xã Uy Nỗ, Huyện Đông Anh, TP. Hà Nội`,
    isDemo: true,
    notes: index === 5 ? 'Cần hỗ trợ thêm về phần Động lực học & chú ý tập trung trong giờ' : 'Chăm ngoan, tích cực phát biểu',
  };
});

// Initial physics grades for 31 students
export const initialGrades: Record<string, GradeItem> = {
  'HS10A5-01': { studentId: 'HS10A5-01', tx1: 9.0, tx2: 8.5, tx3: 9.0, tx4: 9.0, gk: 8.5, ck: 9.0 }, // ~8.9
  'HS10A5-02': { studentId: 'HS10A5-02', tx1: 8.5, tx2: 8.5, tx3: 9.0, tx4: 8.0, gk: 8.5, ck: 8.8 }, // ~8.6
  'HS10A5-03': { studentId: 'HS10A5-03', tx1: 7.5, tx2: 8.0, tx3: 7.5, tx4: 8.0, gk: 7.5, ck: 8.0 }, // ~7.8
  'HS10A5-04': { studentId: 'HS10A5-04', tx1: 9.5, tx2: 9.0, tx3: 9.0, tx4: 9.0, gk: 9.0, ck: 9.2 }, // ~9.1
  'HS10A5-05': { studentId: 'HS10A5-05', tx1: 6.0, tx2: 6.5, tx3: 7.0, tx4: 6.5, gk: 6.5, ck: 7.0 }, // ~6.7
  'HS10A5-06': { studentId: 'HS10A5-06', tx1: 8.5, tx2: 8.0, tx3: 8.5, tx4: 8.5, gk: 8.5, ck: 8.5 },
  'HS10A5-07': { studentId: 'HS10A5-07', tx1: 8.0, tx2: 7.5, tx3: 8.0, tx4: 8.0, gk: 8.0, ck: 8.2 },
  'HS10A5-08': { studentId: 'HS10A5-08', tx1: 9.0, tx2: 9.0, tx3: 8.5, tx4: 9.0, gk: 8.5, ck: 9.0 },
  'HS10A5-09': { studentId: 'HS10A5-09', tx1: 7.0, tx2: 7.5, tx3: 7.0, tx4: 7.0, gk: 7.0, ck: 7.5 },
  'HS10A5-10': { studentId: 'HS10A5-10', tx1: 8.5, tx2: 8.5, tx3: 9.0, tx4: 8.5, gk: 8.5, ck: 8.8 },
  'HS10A5-11': { studentId: 'HS10A5-11', tx1: 8.0, tx2: 8.0, tx3: 7.5, tx4: 8.0, gk: 8.0, ck: 8.5 },
  'HS10A5-12': { studentId: 'HS10A5-12', tx1: 9.0, tx2: 9.0, tx3: 9.5, tx4: 9.0, gk: 9.0, ck: 9.5 },
  'HS10A5-13': { studentId: 'HS10A5-13', tx1: 6.5, tx2: 7.0, tx3: 6.5, tx4: 7.0, gk: 6.5, ck: 7.0 },
  'HS10A5-14': { studentId: 'HS10A5-14', tx1: 8.0, tx2: 8.5, tx3: 8.0, tx4: 8.5, gk: 8.5, ck: 8.5 },
  'HS10A5-15': { studentId: 'HS10A5-15', tx1: 7.5, tx2: 7.5, tx3: 8.0, tx4: 7.5, gk: 8.0, ck: 8.0 },
  'HS10A5-16': { studentId: 'HS10A5-16', tx1: 9.0, tx2: 8.5, tx3: 8.5, tx4: 9.0, gk: 9.0, ck: 9.0 },
  'HS10A5-17': { studentId: 'HS10A5-17', tx1: 7.0, tx2: 6.5, tx3: 7.0, tx4: 7.0, gk: 6.5, ck: 7.0 },
  'HS10A5-18': { studentId: 'HS10A5-18', tx1: 8.5, tx2: 9.0, tx3: 8.5, tx4: 8.5, gk: 8.5, ck: 9.0 },
  'HS10A5-19': { studentId: 'HS10A5-19', tx1: 8.0, tx2: 8.0, tx3: 8.0, tx4: 8.5, gk: 8.0, ck: 8.5 },
  'HS10A5-20': { studentId: 'HS10A5-20', tx1: 9.0, tx2: 9.5, tx3: 9.0, tx4: 9.0, gk: 9.0, ck: 9.2 },
  'HS10A5-21': { studentId: 'HS10A5-21', tx1: 7.5, tx2: 7.0, tx3: 7.5, tx4: 7.5, gk: 7.5, ck: 8.0 },
  'HS10A5-22': { studentId: 'HS10A5-22', tx1: 8.5, tx2: 8.5, tx3: 8.5, tx4: 9.0, gk: 8.5, ck: 8.8 },
  'HS10A5-23': { studentId: 'HS10A5-23', tx1: 6.0, tx2: 6.5, tx3: 6.0, tx4: 6.5, gk: 6.5, ck: 6.5 },
  'HS10A5-24': { studentId: 'HS10A5-24', tx1: 9.0, tx2: 9.0, tx3: 9.0, tx4: 9.5, gk: 9.0, ck: 9.0 },
  'HS10A5-25': { studentId: 'HS10A5-25', tx1: 8.0, tx2: 8.0, tx3: 7.5, tx4: 8.0, gk: 8.0, ck: 8.0 },
  'HS10A5-26': { studentId: 'HS10A5-26', tx1: 8.5, tx2: 8.5, tx3: 9.0, tx4: 8.5, gk: 8.5, ck: 8.5 },
  'HS10A5-27': { studentId: 'HS10A5-27', tx1: 7.5, tx2: 7.5, tx3: 8.0, tx4: 7.5, gk: 7.5, ck: 8.0 },
  'HS10A5-28': { studentId: 'HS10A5-28', tx1: 8.0, tx2: 8.5, tx3: 8.0, tx4: 8.5, gk: 8.0, ck: 8.2 },
  'HS10A5-29': { studentId: 'HS10A5-29', tx1: 6.5, tx2: 6.0, tx3: 6.5, tx4: 6.5, gk: 6.5, ck: 6.8 },
  'HS10A5-30': { studentId: 'HS10A5-30', tx1: 9.0, tx2: 9.0, tx3: 8.5, tx4: 9.0, gk: 9.0, ck: 9.2 },
  'HS10A5-31': { studentId: 'HS10A5-31', tx1: 8.5, tx2: 8.0, tx3: 8.5, tx4: 8.0, gk: 8.5, ck: 8.5 },
};

// Calculate TT22 average score
export function calculateSubjectAverage(item?: GradeItem): number | null {
  if (!item) return null;
  const regularScores = [item.tx1, item.tx2, item.tx3, item.tx4].filter(
    (s): s is number => typeof s === 'number' && !isNaN(s)
  );
  if (regularScores.length === 0 || typeof item.gk !== 'number' || typeof item.ck !== 'number') {
    return null;
  }
  const regularSum = regularScores.reduce((acc, cur) => acc + cur, 0);
  const totalWeight = regularScores.length + 2 + 3; // N + 5
  const weightedSum = regularSum + 2 * item.gk + 3 * item.ck;
  return Number((weightedSum / totalWeight).toFixed(1));
}

export const initialPhysicsTopics: PhysicsTopic[] = [
  {
    id: 'TOPIC-01',
    name: 'Cơ học',
    gradeLevel: 10,
    description: 'Chuyển động thẳng đều, biến đổi đều, Định luật Newton, Công & Năng lượng',
    averageScore: 7.8,
    weakPoints: ['Phân tích lực ma sát trên mặt phẳng nghiêng', 'Định luật III Newton khi va chạm'],
  },
  {
    id: 'TOPIC-02',
    name: 'Nhiệt học',
    gradeLevel: 10,
    description: 'Mô hình động học phân tử, Định luật I & II nhiệt động lực học',
    averageScore: 8.4,
    weakPoints: ['Tính công và độ biến thiên nội năng trong các chu trình biến đổi khí'],
  },
  {
    id: 'TOPIC-03',
    name: 'Điện học',
    gradeLevel: 10,
    description: 'Điện trường, thế điện, tụ điện và dòng điện không đổi',
    averageScore: 8.1,
    weakPoints: ['Mạch cầu điện trở, tính toán điện tích tụ điện nối tiếp'],
  },
  {
    id: 'TOPIC-04',
    name: 'Quang học',
    gradeLevel: 10,
    description: 'Khúc xạ ánh sáng, phản xạ toàn phần, lăng kính và thấu kính',
    averageScore: 7.6,
    weakPoints: ['Vẽ đường đi của tia sáng qua thấu kính phân kỳ, bài toán ghép thấu kính'],
  },
  {
    id: 'TOPIC-05',
    name: 'Vật lí hiện đại',
    gradeLevel: 10,
    description: 'Lượng tử ánh sáng, quang điện ngoài, cấu trúc hạt nhân nguyên tử',
    averageScore: 8.9,
    weakPoints: ['Phương trình Einstein về hiện tượng quang điện'],
  },
  {
    id: 'TOPIC-06',
    name: 'Tổng hợp',
    gradeLevel: 10,
    description: 'Ôn tập học kỳ và đề thi tổng hợp định dạng mới',
    averageScore: 8.2,
    weakPoints: ['Kỹ năng đọc đồ thị biến thiên động năng - thế năng'],
  },
];

export const initialLearningMaterials: LearningMaterial[] = [
  {
    id: 'MAT-01',
    title: 'Chuyên đề: Ba định luật Newton & Ứng dụng thực tế đời sống',
    gradeLevel: 10,
    topic: 'Cơ học',
    category: 'Bài giảng',
    description: 'Slide bài giảng chuẩn kiến thức GDPT 2018, tích hợp video giải thích quán tính xe hơi',
    fileType: 'pptx',
    fileSize: '14.8 MB',
    url: '#',
    dateAdded: '2026-10-15',
    downloadCount: 48,
  },
  {
    id: 'MAT-02',
    title: 'Kế hoạch bài dạy (Giáo án 5512) Bài 18: Lực ma sát',
    gradeLevel: 10,
    topic: 'Cơ học',
    category: 'Giáo án',
    description: 'Giáo án soạn theo chuẩn Công văn 5512/BGDĐT, phân hóa năng lực học sinh 10A5',
    fileType: 'docx',
    fileSize: '1.2 MB',
    url: '#',
    dateAdded: '2026-10-12',
    downloadCount: 32,
  },
  {
    id: 'MAT-03',
    title: 'Mô phỏng PhET: Định luật II Newton và Ma sát mặt phẳng ngang',
    gradeLevel: 10,
    topic: 'Cơ học',
    category: 'Mô phỏng Vật lí',
    description: 'Thí nghiệm ảo trực quan hóa lực kéo, lực cản và gia tốc thời gian thực',
    fileType: 'sim',
    fileSize: 'Web Link',
    url: 'https://phet.colorado.edu',
    dateAdded: '2026-10-10',
    downloadCount: 95,
  },
  {
    id: 'MAT-04',
    title: 'Video thí nghiệm: Sự rơi tự do trong ống Newton hút chân không',
    gradeLevel: 10,
    topic: 'Cơ học',
    category: 'Video thí nghiệm',
    description: 'Thí nghiệm thả rơi đồng xu và lông vũ chứng minh gia tốc g độc lập với khối lượng',
    fileType: 'mp4',
    fileSize: '28.5 MB',
    url: '#',
    dateAdded: '2026-10-08',
    downloadCount: 88,
  },
  {
    id: 'MAT-05',
    title: 'Phiếu học tập: Định luật bảo toàn cơ năng & Va chạm mềm',
    gradeLevel: 10,
    topic: 'Cơ học',
    category: 'Phiếu học tập',
    description: 'Hệ thống câu hỏi gợi mở, bài tập tình huống thực tế cho các nhóm tổ 1, 2, 3, 4',
    fileType: 'pdf',
    fileSize: '850 KB',
    url: '#',
    dateAdded: '2026-10-05',
    downloadCount: 65,
  },
  {
    id: 'MAT-06',
    title: 'Đề kiểm tra giữa kỳ II Vật lí 10 (Ma trận 4 mức độ BGD)',
    gradeLevel: 10,
    topic: 'Tổng hợp',
    category: 'Đề kiểm tra',
    description: 'Đề gồm 18 câu trắc nghiệm nhiều phương án, 4 câu đúng/sai, 6 câu trả lời ngắn',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    url: '#',
    dateAdded: '2026-10-01',
    downloadCount: 110,
  },
  {
    id: 'MAT-07',
    title: 'Bộ đề ôn tập học sinh giỏi Vật lí 10 cấp Cụm Đông Anh',
    gradeLevel: 10,
    topic: 'Tổng hợp',
    category: 'Đề ôn tập',
    description: 'Tuyển chọn 20 bài toán Cơ học & Nhiệt học nâng cao dành cho đội tuyển',
    fileType: 'pdf',
    fileSize: '3.2 MB',
    url: '#',
    dateAdded: '2026-09-25',
    downloadCount: 42,
  },
  {
    id: 'MAT-08',
    title: 'Đáp án chi tiết và thang điểm chấm Đề kiểm tra định kỳ lần 2',
    gradeLevel: 10,
    topic: 'Tổng hợp',
    category: 'Đáp án & Hướng dẫn chấm',
    description: 'Hướng dẫn các bước biến đổi công thức và phân bổ điểm chi tiết đến 0.25đ',
    fileType: 'pdf',
    fileSize: '720 KB',
    url: '#',
    dateAdded: '2026-09-20',
    downloadCount: 76,
  },
];

export const initialHomeroomLogs: HomeroomLog[] = [
  {
    id: 'LOG-W08',
    date: '2026-10-23',
    week: 8,
    title: 'Tổng kết tuần 8: Nề nếp chuyên cần & Chuẩn bị kiểm tra giữa kỳ',
    summary: 'Lớp 10A5 duy trì nề nếp học tập tốt, tỉ lệ chuyên cần đạt 97.8%. Đa số học sinh tích cực trong các giờ học Vật lí và Toán.',
    attendanceHighlights: '1 học sinh nghỉ ốm có phép (HS10A5-05), 1 lượt đi muộn do hỏng xe.',
    academicHighlights: 'Điểm kiểm tra 15 phút Vật lí tiến bộ rõ rệt; môn Tiếng Anh và Ngữ văn được giáo viên bộ môn khen ngợi.',
    conductHighlights: 'Tổ 1 và Tổ 3 đạt xếp loại Xuất sắc tuần; sinh hoạt 15 phút đầu giờ nghiêm túc.',
    actionItems: [
      'Nhắc nhở học sinh ôn tập chuẩn bị thi giữa kì.',
      'Liên hệ phụ huynh em Đỗ Quang Minh để động viên rèn luyện bài tập cơ học.',
      'Tổ chức chuyên đề phương pháp học Vật lí hiệu quả vào tiết sinh hoạt thứ 7.',
    ],
    parentNoticeDraft: `Kính gửi Quý Phụ huynh lớp 10A5 - Trường THPT Ngô Quyền - Đông Anh:
Cô Lưu Hoàng Anh Thư - GVCN xin gửi tới Quý PH thông tin tổng kết tuần 8:
- Chuyên cần toàn lớp: 97.8% (Tuyên dương tinh thần đi học đúng giờ của các con).
- Học tập: Các con đang tập trung ôn tập chuẩn bị kiểm tra giữa kỳ II. Đề nghị PH đôn đốc các con tự giác ôn bài tại nhà.
- Hoạt động: Lớp đạt giải Nhì phong trào Vệ sinh - Kỷ luật tuần này.
Kính chúc Quý Phụ huynh và gia đình một cuối tuần bình an, nhiều niềm vui!`,
  },
  {
    id: 'LOG-W07',
    date: '2026-10-16',
    week: 7,
    title: 'Tổng kết tuần 7: Phong trào thi đua hoa điểm tốt',
    summary: 'Toàn lớp đạt 35 điểm 9 và điểm 10 trong tuần. Các tổ trưởng hoàn thành tốt nhiệm vụ đôn đốc bài tập.',
    attendanceHighlights: 'Chuyên cần đạt 98.8%, không có học sinh bỏ tiết.',
    academicHighlights: 'Hoàn thành bài thực hành Vật lí đo hệ số ma sát đạt điểm tối đa.',
    conductHighlights: 'Lớp nề nếp, đồng phục chỉnh tề, vệ sinh lớp sạch sẽ.',
    actionItems: ['Duy trì phong trào học tập đôi bạn cùng tiến.', 'Chuẩn bị kế hoạch trải nghiệm thực tế.'],
    parentNoticeDraft: `Kính gửi Quý Phụ huynh lớp 10A5:
Tuần 7 vừa qua lớp chúng ta đã có một tuần học tập rất sôi nổi với 35 hoa điểm tốt! Cô Thư xin cảm ơn sự đồng hành sát sao của Quý Phụ huynh. Chúc các gia đình một tuần mới an lành!`,
  },
];
