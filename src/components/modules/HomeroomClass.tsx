import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Award,
  BookOpen,
  Calendar,
  MessageSquare,
  Copy,
  Plus,
  CheckCircle,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';

export const HomeroomClass: React.FC = () => {
  const { teacher, students, homeroomLogs, addHomeroomLog, showToast, setSelectedStudentId, setActiveTab } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'info_cadres' | 'all_subjects' | 'diary' | 'parent_newsletter'>('info_cadres');
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');

  // Form state for new diary entry
  const [showAddLog, setShowAddLog] = useState(false);
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogWeek, setNewLogWeek] = useState(9);
  const [newLogSummary, setNewLogSummary] = useState('');
  const [newLogAttendance, setNewLogAttendance] = useState('');
  const [newLogAcademic, setNewLogAcademic] = useState('');
  const [newLogConduct, setNewLogConduct] = useState('');
  const [newLogActionItem, setNewLogActionItem] = useState('');
  const [newLogParentNotice, setNewLogParentNotice] = useState('');

  // Class Cadres
  const cadres = students.filter(
    (s) => s.role && s.role !== 'Học sinh'
  );

  // Filter students by group
  const filteredStudents = selectedGroup === 'all'
    ? students
    : students.filter((s) => s.group === selectedGroup);

  // Simulated subject summary for homeroom view
  const subjectsList = [
    { name: 'Toán học', teacher: 'Thầy Nguyễn Văn Đức', avg: 8.1, goodRate: '81%' },
    { name: 'Ngữ văn', teacher: 'Cô Trần Thị Hương', avg: 7.9, goodRate: '75%' },
    { name: 'Tiếng Anh', teacher: 'Cô Vũ Mai Phương', avg: 8.4, goodRate: '87%' },
    { name: 'Vật lí', teacher: 'Cô Lưu Hoàng Anh Thư (CN)', avg: 8.2, goodRate: '84%' },
    { name: 'Hóa học', teacher: 'Thầy Lê Quốc Tuấn', avg: 7.8, goodRate: '71%' },
    { name: 'Sinh học', teacher: 'Cô Phạm Hải Yến', avg: 8.5, goodRate: '90%' },
    { name: 'Lịch sử', teacher: 'Thầy Hoàng Văn Minh', avg: 8.3, goodRate: '85%' },
    { name: 'Địa lí', teacher: 'Cô Đỗ Thu Hà', avg: 8.6, goodRate: '92%' },
    { name: 'GD KT&PL', teacher: 'Cô Nguyễn Hồng Loan', avg: 8.7, goodRate: '94%' },
    { name: 'Tin học', teacher: 'Thầy Bùi Trọng Nghĩa', avg: 8.9, goodRate: '96%' },
  ];

  const handleCopyNewsletter = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Đã sao chép nội dung bản tin vào khay nhớ tạm! Bạn có thể dán vào nhóm Zalo phụ huynh.');
  };

  const handleSaveNewLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogTitle.trim()) return;
    addHomeroomLog({
      date: new Date().toISOString().split('T')[0],
      week: newLogWeek,
      title: newLogTitle,
      summary: newLogSummary || 'Duy trì nề nếp và học tập nghiêm túc.',
      attendanceHighlights: newLogAttendance || 'Chuyên cần ổn định.',
      academicHighlights: newLogAcademic || 'Các môn học đạt yêu cầu.',
      conductHighlights: newLogConduct || 'Nề nếp tốt.',
      actionItems: newLogActionItem ? [newLogActionItem] : ['Tiếp tục theo dõi nề nếp.'],
      parentNoticeDraft: newLogParentNotice || `Kính gửi Quý Phụ huynh lớp 10A5: Tình hình tuần ${newLogWeek} ổn định, các con học tập tốt. Trân trọng!`,
    });
    setShowAddLog(false);
    setNewLogTitle('');
    setNewLogSummary('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner of Homeroom */}
      <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#062B65] to-[#1687E8] text-white flex items-center justify-center shadow-md">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#062B65]">
                  Không gian Quản lý Chủ nhiệm: Lớp {teacher.homeroomClass}
                </h2>
                <span className="text-xs bg-blue-100 text-[#0755B8] font-bold px-2.5 py-0.5 rounded-full">
                  {teacher.cohort}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                GVCN: <span className="text-[#0755B8] font-bold">{teacher.name}</span> · Năm học: {teacher.academicYear} ({teacher.semester}) · Sĩ số hiện tại: <span className="font-bold text-[#062B65]">{students.length} học sinh</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTabLocal('diary');
                setShowAddLog(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0755B8] hover:bg-[#062B65] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Ghi nhật ký tuần</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 gap-2 sm:gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTabLocal('info_cadres')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'info_cadres'
              ? 'border-[#0755B8] text-[#0755B8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Cán bộ lớp & Phân tổ ({students.length} HS)</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('all_subjects')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'all_subjects'
              ? 'border-[#0755B8] text-[#0755B8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tổng hợp các môn học</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('diary')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'diary'
              ? 'border-[#0755B8] text-[#0755B8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Nhật ký chủ nhiệm ({homeroomLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTabLocal('parent_newsletter')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'parent_newsletter'
              ? 'border-[#0755B8] text-[#0755B8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Bản tin gửi Phụ huynh</span>
        </button>
      </div>

      {/* Tab 1: Cadres & Groups */}
      {activeTab === 'info_cadres' && (
        <div className="space-y-6">
          {/* Cadres Cards */}
          <div>
            <h3 className="text-base font-bold text-[#062B65] mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Ban Cán sự Lớp & Tổ trưởng 10A5</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cadres.map((cadre) => (
                <div
                  key={cadre.id}
                  onClick={() => {
                    setSelectedStudentId(cadre.id);
                    setActiveTab('students');
                  }}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#1687E8] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-[#0755B8] font-bold flex items-center justify-center shrink-0">
                      {cadre.name.slice(0, 1)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#1687E8] bg-blue-50 px-2 py-0.5 rounded uppercase">
                        {cadre.role}
                      </span>
                      <h4 className="font-bold text-sm text-[#062B65] mt-1 group-hover:text-[#1687E8] transition-colors">
                        {cadre.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {cadre.id} · Tổ {cadre.group}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group filtering & Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-[17px] text-[#062B65]">
                  Danh sách phân bổ học sinh theo Tổ (1-4)
                </h3>
                <p className="text-xs text-slate-500">
                  Mỗi tổ phụ trách công tác tự quản, trực nhật và học nhóm
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setSelectedGroup('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedGroup === 'all'
                      ? 'bg-white text-[#0755B8] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tất cả ({students.length})
                </button>
                {[1, 2, 3, 4].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGroup(g)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedGroup === g
                        ? 'bg-white text-[#0755B8] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tổ {g} ({students.filter((s) => s.group === g).length})
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Mã HS</th>
                    <th className="py-2.5 px-3">Họ và tên</th>
                    <th className="py-2.5 px-2 text-center">Giới tính</th>
                    <th className="py-2.5 px-2 text-center">Tổ</th>
                    <th className="py-2.5 px-3">Chức vụ</th>
                    <th className="py-2.5 px-3">Phụ huynh</th>
                    <th className="py-2.5 px-3">Số điện thoại PH</th>
                    <th className="py-2.5 px-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-xs text-slate-500">{s.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#183153]">{s.name}</td>
                      <td className="py-2.5 px-2 text-center text-xs">{s.gender}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-xs bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-700">
                          Tổ {s.group}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-xs font-bold text-[#0755B8]">
                        {s.role || 'Học sinh'}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-slate-600">{s.parentName}</td>
                      <td className="py-2.5 px-3 text-xs font-mono text-slate-600">{s.parentPhone}</td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedStudentId(s.id);
                            setActiveTab('students');
                          }}
                          className="text-xs text-blue-600 hover:underline font-semibold"
                        >
                          Hồ sơ 360°
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: All subjects summary */}
      {activeTab === 'all_subjects' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <h3 className="font-bold text-lg text-[#062B65] mb-1">
              Tổng hợp kết quả các môn học lớp 10A5
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Theo dõi chất lượng bộ môn để GVCN kịp thời phối hợp với giáo viên bộ môn
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectsList.map((sub) => (
                <div
                  key={sub.name}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#1687E8] bg-slate-50/50 hover:bg-white transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-[#062B65]">{sub.name}</h4>
                    <span className="text-sm font-bold text-[#0755B8] bg-blue-50 px-2 py-0.5 rounded">
                      ĐTB: {sub.avg}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Phụ trách: <span className="font-medium text-slate-800">{sub.teacher}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Tỉ lệ đạt Khá / Giỏi:</span>
                    <span className="font-bold text-[#159A61]">{sub.goodRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Homeroom Diary */}
      {activeTab === 'diary' && (
        <div className="space-y-6">
          {showAddLog && (
            <form
              onSubmit={handleSaveNewLog}
              className="bg-white p-5 rounded-2xl border border-blue-200 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-bold text-base text-[#062B65]">Ghi chép Nhật ký Chủ nhiệm mới</h4>
                <button
                  type="button"
                  onClick={() => setShowAddLog(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Đóng
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Tiêu đề nhật ký:</label>
                  <input
                    type="text"
                    required
                    value={newLogTitle}
                    onChange={(e) => setNewLogTitle(e.target.value)}
                    placeholder="VD: Tổng kết tuần 9 - Chuẩn bị thi thực hành..."
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Tuần học thứ:</label>
                  <input
                    type="number"
                    value={newLogWeek}
                    onChange={(e) => setNewLogWeek(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Tóm tắt tình hình chung:</label>
                <textarea
                  rows={2}
                  value={newLogSummary}
                  onChange={(e) => setNewLogSummary(e.target.value)}
                  placeholder="Nhận xét ý thức nề nếp, sự chuẩn bị bài của học sinh..."
                  className="w-full mt-1 p-2 text-xs border rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Chuyên cần:</label>
                  <input
                    type="text"
                    value={newLogAttendance}
                    onChange={(e) => setNewLogAttendance(e.target.value)}
                    placeholder="Học sinh nghỉ có phép, đi muộn..."
                    className="w-full mt-1 p-2 text-xs border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Học tập:</label>
                  <input
                    type="text"
                    value={newLogAcademic}
                    onChange={(e) => setNewLogAcademic(e.target.value)}
                    placeholder="Điểm số, bài tập, lời khen của GVBM..."
                    className="w-full mt-1 p-2 text-xs border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Rèn luyện & Nề nếp:</label>
                  <input
                    type="text"
                    value={newLogConduct}
                    onChange={(e) => setNewLogConduct(e.target.value)}
                    placeholder="Việc tốt, hoạt động phong trào..."
                    className="w-full mt-1 p-2 text-xs border rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Dự thảo bản tin Zalo gửi Phụ huynh:</label>
                <textarea
                  rows={3}
                  value={newLogParentNotice}
                  onChange={(e) => setNewLogParentNotice(e.target.value)}
                  placeholder="Nội dung trang trọng, khích lệ gửi nhóm phụ huynh..."
                  className="w-full mt-1 p-2 text-xs border rounded-lg outline-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLog(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-[#0755B8] rounded-lg font-bold"
                >
                  Lưu nhật ký chủ nhiệm
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {homeroomLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 text-[#0755B8] font-bold px-2 py-0.5 rounded">
                      Tuần {log.week}
                    </span>
                    <h4 className="font-bold text-[17px] text-[#062B65]">{log.title}</h4>
                  </div>
                  <span className="text-xs text-slate-400">Ngày ghi: {log.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {log.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl text-xs">
                  <div>
                    <span className="font-bold text-slate-600 block mb-0.5">Chuyên cần:</span>
                    <span className="text-slate-600">{log.attendanceHighlights}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600 block mb-0.5">Học tập:</span>
                    <span className="text-slate-600">{log.academicHighlights}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600 block mb-0.5">Khen thưởng / Kỷ luật:</span>
                    <span className="text-slate-600">{log.conductHighlights}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-[#062B65] block mb-1">
                    Kế hoạch & Biện pháp tuần tiếp theo:
                  </span>
                  <ul className="space-y-1">
                    {log.actionItems.map((item, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#159A61]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Parent Newsletter Draft */}
      {activeTab === 'parent_newsletter' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-[#062B65]">
                  Bản tin tuần gửi Nhóm Phụ huynh Lớp 10A5
                </h3>
                <p className="text-xs text-slate-500">
                  Nội dung chuẩn mực sư phạm, tích cực, xây dựng sự tin tưởng giữa nhà trường và gia đình
                </p>
              </div>
            </div>

            {homeroomLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0755B8]">
                    Bản tin Tuần {log.week} · {log.date}
                  </span>
                  <button
                    onClick={() => handleCopyNewsletter(log.parentNoticeDraft)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-[#0755B8] hover:bg-blue-50 text-xs font-bold shadow-sm transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép gửi Zalo PH</span>
                  </button>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                  {log.parentNoticeDraft}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
