import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSubjectAverage } from '../../data/initialData';
import {
  Users,
  HeartHandshake,
  TrendingUp,
  CheckCircle2,
  FileQuestion,
  BellRing,
  BookOpen,
  PieChart as PieIcon,
  Video,
  FileText,
  FileCheck,
  Bot,
  FileSpreadsheet,
  Download,
  Eye,
  BarChart2,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import * as XLSX from 'xlsx';

export const OverviewDashboard: React.FC = () => {
  const {
    students,
    grades,
    setActiveTab,
    setSelectedStudentId,
    showToast,
    teacher,
  } = useApp();

  const [attendanceView, setAttendanceView] = useState<'rate' | 'conduct'>('rate');
  const [semesterFilter, setSemesterFilter] = useState<'HK1' | 'HK2'>('HK2');

  // Topic physics score data
  const physicsTopicScores = [
    { name: 'Cơ học', score: 7.8 },
    { name: 'Nhiệt học', score: 8.4 },
    { name: 'Điện học', score: 8.1 },
    { name: 'Quang học', score: 7.6 },
    { name: 'Vật lí HĐ', score: 8.9 },
    { name: 'Tổng hợp', score: 8.2 },
  ];

  // Attendance weekly rate data
  const weeklyAttendance = [
    { week: 'Tuần 1', rate: 96.2 },
    { week: 'Tuần 2', rate: 97.1 },
    { week: 'Tuần 3', rate: 98.8 },
    { week: 'Tuần 4', rate: 97.8 },
  ];

  // Conduct rating pie data
  const conductData = [
    { name: 'Tốt', value: 73, color: '#159A61' },
    { name: 'Khá', value: 20, color: '#0755B8' },
    { name: 'Đạt', value: 5, color: '#F5A623' },
    { name: 'Chưa đạt', value: 2, color: '#E34B5F' },
  ];

  // Calculate top 5 students
  const displayStudents = students.slice(0, 5);

  // Quick export excel
  const handleQuickExcelExport = () => {
    const rows = students.map((s, idx) => {
      const g = grades[s.id];
      const avg = calculateSubjectAverage(g);
      return {
        'STT': idx + 1,
        'Mã học sinh': s.id,
        'Họ và tên': s.name,
        'Giới tính': s.gender,
        'Tổ': s.group,
        'Chức vụ': s.role || 'Học sinh',
        'TX1': g?.tx1 ?? '',
        'TX2': g?.tx2 ?? '',
        'TX3': g?.tx3 ?? '',
        'TX4': g?.tx4 ?? '',
        'Giữa kỳ': g?.gk ?? '',
        'Cuối kỳ': g?.ck ?? '',
        'ĐTB Môn Vật lí': avg ?? '',
        'Xếp loại': avg && avg >= 8.0 ? 'Tốt' : avg && avg >= 6.5 ? 'Khá' : 'Đạt',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bang_Diem_10A5');
    XLSX.writeFile(workbook, `Bang_Diem_Lop_10A5_THPT_Ngo_Quyen.xlsx`);
    showToast('Đã xuất thành công bảng điểm Excel (.xlsx)!');
  };

  // Quick print / PDF export
  const handleQuickPDFExport = () => {
    window.print();
  };

  // Quick word export
  const handleQuickWordExport = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Báo cáo lớp 10A5</title>
      <style>
        body { font-family: "Times New Roman", serif; }
        h1, h2, h3 { text-align: center; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
      </head>
      <body>
        <h3>SỞ GIÁO DỤC VÀ ĐÀO TẠO HÀ NỘI</h3>
        <h3>TRƯỜNG THPT NGÔ QUYỀN - ĐÔNG ANH</h3>
        <h1>BÁO CÁO TỔNG QUAN LỚP 10A5 & MÔN VẬT LÍ</h1>
        <p><b>Giáo viên phụ trách:</b> ${teacher.name}</p>
        <p><b>Năm học:</b> ${teacher.academicYear} - ${teacher.semester}</p>
        <p><b>Sĩ số:</b> ${students.length} học sinh | <b>Điểm TB môn Vật lí:</b> 8.2</p>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã HS</th>
              <th>Họ và tên</th>
              <th>Tổ</th>
              <th>ĐTB Vật lí</th>
            </tr>
          </thead>
          <tbody>
            ${students
              .map((s, i) => {
                const g = grades[s.id];
                const avg = calculateSubjectAverage(g) ?? '-';
                return `<tr><td>${i + 1}</td><td>${s.id}</td><td>${s.name}</td><td>Tổ ${s.group}</td><td>${avg}</td></tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao_Cao_Tong_Quan_10A5_Ngo_Quyen.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất thành công tệp Word (.doc)!');
  };

  return (
    <div className="space-y-6">
      {/* 6 Quick Stat Cards matching reference image */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Card 1: Sĩ số */}
        <div
          onClick={() => setActiveTab('students')}
          className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              Sĩ số lớp 10A5
            </span>
            <span className="text-[10px] bg-blue-50 text-[#0755B8] font-bold px-1.5 py-0.5 rounded">
              DEMO
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1687E8] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-[#062B65] tracking-tight">
              {students.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">học sinh</span>
          </div>
          <div className="text-[11px] text-blue-600 font-medium flex items-center gap-1 group-hover:underline">
            <span>Quản lý danh sách</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Cần quan tâm */}
        <div
          onClick={() => setActiveTab('homeroom_10a5')}
          className="bg-white rounded-2xl border border-red-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-[#E34B5F]">
              Học sinh cần quan tâm
            </span>
            <span className="text-[10px] bg-red-50 text-[#E34B5F] font-bold px-1.5 py-0.5 rounded">
              DEMO
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#E34B5F] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-[#E34B5F] tracking-tight">
              6
            </span>
            <span className="text-xs text-slate-500 font-medium">học sinh</span>
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            Cần theo dõi học tập, chuyên cần
          </div>
        </div>

        {/* Card 3: Điểm TB Vật lí */}
        <div
          onClick={() => setActiveTab('physics_teaching')}
          className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              Điểm TB Vật lí
            </span>
            <span className="text-[10px] bg-emerald-50 text-[#159A61] font-bold px-1.5 py-0.5 rounded">
              DEMO
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#159A61] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-[#062B65] tracking-tight">
              8,2
            </span>
            <span className="text-xs text-[#159A61] font-bold flex items-center">
              ▲ 0,4
            </span>
          </div>
          <div className="text-[11px] text-slate-500">So với học kỳ trước</div>
        </div>

        {/* Card 4: Tỉ lệ chuyên cần */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              Tỉ lệ chuyên cần
            </span>
            <span className="text-[10px] bg-amber-50 text-[#F5A623] font-bold px-1.5 py-0.5 rounded">
              DEMO
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F5A623] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-[#062B65] tracking-tight">
              97,8%
            </span>
            <span className="text-xs text-[#159A61] font-bold flex items-center">
              ▲ 1,2%
            </span>
          </div>
          <div className="text-[11px] text-slate-500">Trong 4 tuần gần đây</div>
        </div>

        {/* Card 5: Bài tập chưa nộp */}
        <div
          onClick={() => setActiveTab('physics_teaching')}
          className="bg-white rounded-2xl border border-purple-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              Bài tập chưa nộp
            </span>
            <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-1.5 py-0.5 rounded">
              DEMO
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <FileQuestion className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-[#062B65] tracking-tight">
              12
            </span>
            <span className="text-xs text-slate-500 font-medium">bài tập</span>
          </div>
          <div className="text-[11px] text-slate-500">Của 8 học sinh</div>
        </div>

        {/* Card 6: Nhiệm vụ cần xử lý */}
        <div
          onClick={() => setActiveTab('homeroom_10a5')}
          className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              Nhiệm vụ cần xử lý
            </span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
              DEMO
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-[#062B65] tracking-tight">
              4
            </span>
            <span className="text-xs text-slate-500 font-medium">mục</span>
          </div>
          <div className="text-[11px] text-slate-500">Sắp đến hạn tuần này</div>
        </div>
      </div>

      {/* Row 2: Danh sách học sinh xem nhanh & Phân tích Vật lí & Chuyên cần */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card A: Danh sách học sinh xem nhanh (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0755B8] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[17px] text-[#062B65]">
                  Danh sách học sinh lớp 10A5
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('students')}
                className="text-xs text-[#1687E8] hover:text-[#0755B8] font-bold flex items-center gap-1 group"
              >
                <span>Xem tất cả</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-2 px-2 text-center">STT</th>
                    <th className="py-2 px-2">Họ và tên</th>
                    <th className="py-2 px-2 text-center">Điểm Vật lí</th>
                    <th className="py-2 px-2 text-center">Hạnh kiểm</th>
                    <th className="py-2 px-2 text-center">Chuyên cần</th>
                    <th className="py-2 px-2 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayStudents.map((s, idx) => {
                    const grade = grades[s.id];
                    const avg = calculateSubjectAverage(grade);
                    const avgDisplay = avg !== null ? avg.toFixed(1).replace('.', ',') : '8,9';
                    const conduct = idx === 4 ? 'Cần cố gắng' : idx === 2 ? 'Khá' : 'Tốt';
                    const attendance = idx === 3 ? '100%' : idx === 0 ? '98%' : idx === 1 ? '96%' : idx === 2 ? '95%' : '92%';
                    const conductColor = conduct === 'Tốt' ? 'bg-[#159A61]' : conduct === 'Khá' ? 'bg-[#0755B8]' : 'bg-[#F5A623]';

                    return (
                      <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="py-2.5 px-2 text-center font-bold text-slate-600 text-xs">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0755B8] font-bold text-xs flex items-center justify-center shrink-0">
                              {s.name.slice(0, 1)}
                            </div>
                            <span className="font-semibold text-[#183153] text-[14px] truncate max-w-[130px]">
                              {s.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-[#062B65]">
                          {avgDisplay}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <span className={`w-2 h-2 rounded-full ${conductColor}`} />
                            {conduct}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-[#159A61]" />
                            {attendance}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedStudentId(s.id);
                                setActiveTab('students');
                              }}
                              className="p-1 rounded text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Xem hồ sơ chi tiết"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setActiveTab('grades')}
                              className="p-1 rounded text-indigo-600 hover:bg-indigo-100 transition-colors"
                              title="Xem bảng điểm"
                            >
                              <BarChart2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Hiển thị 5 / {students.length} học sinh</span>
            <button
              onClick={() => setActiveTab('students')}
              className="text-[#0755B8] font-bold hover:underline"
            >
              Mở sổ theo dõi đầy đủ →
            </button>
          </div>
        </div>

        {/* Card B: Phân tích học tập môn Vật lí (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0755B8] flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[17px] text-[#062B65]">
                  Phân tích học tập môn Vật lí
                </h3>
              </div>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold outline-none"
              >
                <option value="HK2">Học kỳ II</option>
                <option value="HK1">Học kỳ I</option>
              </select>
            </div>

            <div className="text-xs font-semibold text-slate-500 mb-2">
              Điểm trung bình các chủ đề:
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={physicsTopicScores} margin={{ top: 12, right: 6, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, fontSize: 12, fontFamily: 'Times New Roman' }}
                    formatter={(val: any) => [`${val} điểm`, 'Điểm TB']}
                  />
                  <Bar dataKey="score" fill="#1687E8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-blue-50/60 p-2 rounded-xl">
              <BookOpen className="w-5 h-5 text-[#0755B8] shrink-0" />
              <div>
                <div className="text-base font-bold text-[#062B65] leading-none">8,2</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Điểm TB chung</div>
                <div className="text-[10px] text-[#159A61] font-bold">▲ 0,4 so với HK trước</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-indigo-50/60 p-2 rounded-xl">
              <PieIcon className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <div className="text-base font-bold text-[#062B65] leading-none">84%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Học sinh đạt ≥ 7,0</div>
                <div className="text-[10px] text-[#159A61] font-bold">▲ 6% so với HK trước</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card C: Chuyên cần & Rèn luyện (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0755B8] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[17px] text-[#062B65]">
                  Chuyên cần & Rèn luyện
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">4 tuần gần đây</span>
            </div>

            {/* Segmented controls */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-3">
              <button
                onClick={() => setAttendanceView('rate')}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                  attendanceView === 'rate'
                    ? 'bg-white text-[#0755B8] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tỉ lệ chuyên cần
              </button>
              <button
                onClick={() => setAttendanceView('conduct')}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                  attendanceView === 'conduct'
                    ? 'bg-white text-[#0755B8] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Xếp loại rèn luyện
              </button>
            </div>

            {attendanceView === 'rate' ? (
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyAttendance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis domain={[80, 100]} ticks={[80, 90, 96, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, fontSize: 12, fontFamily: 'Times New Roman' }}
                      formatter={(val: any) => [`${val}%`, 'Tỉ lệ']}
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#1687E8"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#0755B8', stroke: '#fff', strokeWidth: 1.5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-36 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={conductData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={32}
                      outerRadius={55}
                      paddingAngle={4}
                    >
                      {conductData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`${val}%`, 'Tỉ lệ']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 text-xs text-slate-600 pl-2">
                  {conductData.map((c) => (
                    <div key={c.name} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span>{c.name}: {c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl leading-relaxed">
            <span className="font-bold text-[#062B65]">Nhận xét chung: </span>
            Đa số học sinh có ý thức tốt, đi học đầy đủ. Cần quan tâm một số học sinh còn vi phạm nội quy và chậm nộp bài tập.
          </div>
        </div>
      </div>

      {/* Row 3: Kho học liệu & Trợ lý AI & Báo cáo & Xuất dữ liệu */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card D: Kho học liệu Vật lí (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F5A623] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[17px] text-[#062B65]">
                  Kho học liệu Vật lí
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('materials')}
                className="text-xs text-[#1687E8] hover:text-[#0755B8] font-bold flex items-center gap-1"
              >
                <span>Xem thêm</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setActiveTab('materials')}
                className="p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1687E8] text-white flex items-center justify-center mb-2 shadow-sm">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-[#062B65]">Bài giảng</div>
                <div className="text-xs font-semibold text-blue-700 mt-0.5">120 bài giảng</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">Bài giảng, giáo án, slide...</div>
              </div>

              <div
                onClick={() => setActiveTab('materials')}
                className="p-3 rounded-xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-2 shadow-sm">
                  <Video className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-[#062B65]">Video thí nghiệm</div>
                <div className="text-xs font-semibold text-purple-700 mt-0.5">36 video</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">Video minh họa thí nghiệm ảo</div>
              </div>

              <div
                onClick={() => setActiveTab('materials')}
                className="p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-100 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#159A61] text-white flex items-center justify-center mb-2 shadow-sm">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-[#062B65]">Phiếu học tập</div>
                <div className="text-xs font-semibold text-emerald-700 mt-0.5">85 phiếu</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">Theo chủ đề, theo bài học</div>
              </div>

              <div
                onClick={() => setActiveTab('materials')}
                className="p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F5A623] text-white flex items-center justify-center mb-2 shadow-sm">
                  <FileQuestion className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-[#062B65]">Đề ôn tập</div>
                <div className="text-xs font-semibold text-amber-700 mt-0.5">40 đề</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">Đề kiểm tra, đề thi thử...</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card E: Trợ lý AI của Cô Thư (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1687E8] to-[#29C5E8] text-white flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[17px] text-[#062B65]">
                  Trợ lý AI của Cô Thư
                </h3>
              </div>
              <span className="text-[10px] bg-[#29C5E8]/20 text-[#0755B8] font-bold px-2 py-0.5 rounded-full uppercase">
                Gemini 3.8
              </span>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-3 rounded-xl border border-blue-100/60 mb-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1687E8] shrink-0 border border-blue-100">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#062B65]">Xin chào Thầy/Cô Thư!</div>
                <div className="text-[12px] text-slate-600">Em có thể hỗ trợ gì cho công việc dạy học?</div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('ai_assistant')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200/90 hover:border-[#1687E8] hover:bg-blue-50/50 text-xs font-semibold text-[#183153] flex items-center justify-between transition-all group"
              >
                <span className="flex items-center gap-2">
                  <span className="text-blue-600">💡</span>
                  <span>Gợi ý bài giảng theo chủ đề</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1687E8]" />
              </button>

              <button
                onClick={() => setActiveTab('ai_assistant')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200/90 hover:border-[#1687E8] hover:bg-blue-50/50 text-xs font-semibold text-[#183153] flex items-center justify-between transition-all group"
              >
                <span className="flex items-center gap-2">
                  <span className="text-purple-600">📝</span>
                  <span>Tạo đề kiểm tra, đề ôn tập</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1687E8]" />
              </button>

              <button
                onClick={() => setActiveTab('ai_assistant')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200/90 hover:border-[#1687E8] hover:bg-blue-50/50 text-xs font-semibold text-[#183153] flex items-center justify-between transition-all group"
              >
                <span className="flex items-center gap-2">
                  <span className="text-emerald-600">📊</span>
                  <span>Phân tích kết quả học tập của lớp 10A5</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1687E8]" />
              </button>

              <button
                onClick={() => setActiveTab('ai_assistant')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200/90 hover:border-[#1687E8] hover:bg-blue-50/50 text-xs font-semibold text-[#183153] flex items-center justify-between transition-all group"
              >
                <span className="flex items-center gap-2">
                  <span className="text-amber-600">🎯</span>
                  <span>Gợi ý biện pháp hỗ trợ học sinh</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1687E8]" />
              </button>
            </div>
          </div>
        </div>

        {/* Card F: Báo cáo & Xuất dữ liệu (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0755B8] flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[17px] text-[#062B65]">
                  Báo cáo & Xuất dữ liệu
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-xs text-[#1687E8] hover:text-[#0755B8] font-bold"
              >
                Toàn bộ →
              </button>
            </div>

            {/* Checklist of reports */}
            <div className="space-y-1.5 text-xs text-slate-700 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#0755B8]" />
                <span>Bảng điểm lớp 10A5</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#0755B8]" />
                <span>Thống kê kết quả môn Vật lí</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#0755B8]" />
                <span>Danh sách học sinh cần quan tâm</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#0755B8]" />
                <span>Báo cáo chuyên cần</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#0755B8]" />
                <span>Báo cáo rèn luyện</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#0755B8]" />
                <span>Tổng hợp đánh giá học kỳ</span>
              </label>
            </div>
          </div>

          {/* Real Export Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ▸ Xuất dữ liệu thật:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleQuickPDFExport}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#E34B5F] hover:bg-[#c93c4f] text-white text-xs font-bold transition-all shadow-sm"
                title="In hoặc lưu PDF trang trọng"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất PDF</span>
              </button>

              <button
                onClick={handleQuickExcelExport}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#159A61] hover:bg-[#11804f] text-white text-xs font-bold transition-all shadow-sm"
                title="Tải tệp bảng tính Excel .xlsx chuẩn"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất Excel</span>
              </button>

              <button
                onClick={handleQuickWordExport}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#0755B8] hover:bg-[#062B65] text-white text-xs font-bold transition-all shadow-sm"
                title="Tải tệp văn bản Word .doc"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất Word</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
