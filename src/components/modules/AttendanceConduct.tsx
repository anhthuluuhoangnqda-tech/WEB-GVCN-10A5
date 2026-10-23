import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
  Award,
  Filter,
  Save,
} from 'lucide-react';

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'excused' | 'unexcused' | 'late';
  note?: string;
}

interface ConductEntry {
  id: string;
  studentId: string;
  date: string;
  category: 'Khen ngợi' | 'Nhắc nhở' | 'Vi phạm';
  content: string;
  points: number;
}

export const AttendanceConduct: React.FC = () => {
  const { students, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'attendance' | 'conduct'>('attendance');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSession, setSelectedSession] = useState<'Sáng' | 'Chiều'>('Sáng');

  // Attendance state for today's session
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>(() => {
    const map: Record<string, AttendanceRecord> = {};
    students.forEach((s, idx) => {
      // Seed realistic initial attendance
      if (idx === 4) {
        map[s.id] = { studentId: s.id, status: 'excused', note: 'Phụ huynh xin phép nghỉ ốm' };
      } else if (idx === 8) {
        map[s.id] = { studentId: s.id, status: 'late', note: 'Muộn 10 phút' };
      } else {
        map[s.id] = { studentId: s.id, status: 'present' };
      }
    });
    return map;
  });

  // Conduct entries
  const [conductLogs, setConductLogs] = useState<ConductEntry[]>([
    {
      id: 'CD-01',
      studentId: 'HS10A5-01',
      date: '2026-10-22',
      category: 'Khen ngợi',
      content: 'Chủ động hỗ trợ tổ trưởng đôn đốc bài tập Vật lí và giữ trật tự 15 phút đầu giờ.',
      points: 5,
    },
    {
      id: 'CD-02',
      studentId: 'HS10A5-04',
      date: '2026-10-21',
      category: 'Khen ngợi',
      content: 'Phát biểu đóng góp xây dựng bài học xuất sắc trong tiết Vật lí con lắc lò xo.',
      points: 5,
    },
    {
      id: 'CD-03',
      studentId: 'HS10A5-05',
      date: '2026-10-18',
      category: 'Nhắc nhở',
      content: 'Còn quên mang theo phiếu học tập Vật lí số 3.',
      points: -2,
    },
    {
      id: 'CD-04',
      studentId: 'HS10A5-09',
      date: '2026-10-15',
      category: 'Nhắc nhở',
      content: 'Nói chuyện riêng trong giờ sinh hoạt lớp, đã nhắc nhở rút kinh nghiệm.',
      points: -2,
    },
  ]);

  const [showAddConduct, setShowAddConduct] = useState(false);
  const [newConductStudentId, setNewConductStudentId] = useState(students[0]?.id || '');
  const [newConductCategory, setNewConductCategory] = useState<'Khen ngợi' | 'Nhắc nhở' | 'Vi phạm'>('Khen ngợi');
  const [newConductContent, setNewConductContent] = useState('');

  // Mark all present
  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceRecord> = {};
    students.forEach((s) => {
      updated[s.id] = { studentId: s.id, status: 'present' };
    });
    setAttendanceMap(updated);
    showToast('Đã đánh dấu toàn bộ lớp 10A5 CÓ MẶT!');
  };

  const handleSetStatus = (studentId: string, status: 'present' | 'excused' | 'unexcused' | 'late') => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { studentId }),
        status,
      },
    }));
  };

  const handleSaveAttendance = () => {
    showToast(`Đã lưu kết quả điểm danh ngày ${selectedDate} (${selectedSession})!`);
  };

  const handleCreateConduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConductContent.trim()) return;
    const points = newConductCategory === 'Khen ngợi' ? 5 : newConductCategory === 'Nhắc nhở' ? -2 : -5;
    const newEntry: ConductEntry = {
      id: `CD-${Date.now().toString().slice(-4)}`,
      studentId: newConductStudentId,
      date: new Date().toISOString().split('T')[0],
      category: newConductCategory,
      content: newConductContent,
      points,
    };
    setConductLogs([newEntry, ...conductLogs]);
    setNewConductContent('');
    setShowAddConduct(false);
    showToast('Đã thêm ghi nhận rèn luyện học sinh!');
  };

  // Stats calculation
  const total = students.length || 1;
  const presentCount = Object.values(attendanceMap).filter((a) => a.status === 'present').length;
  const excusedCount = Object.values(attendanceMap).filter((a) => a.status === 'excused').length;
  const unexcusedCount = Object.values(attendanceMap).filter((a) => a.status === 'unexcused').length;
  const lateCount = Object.values(attendanceMap).filter((a) => a.status === 'late').length;
  const attendanceRate = Math.round(((presentCount + lateCount) / total) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#062B65] to-[#1687E8] text-white flex items-center justify-center shadow-md">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#062B65]">
              Phân hệ: Chuyên cần & Rèn luyện (Lớp 10A5)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Sổ điểm danh buổi học và theo dõi ý thức kỷ luật, xếp loại hạnh kiểm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'attendance' ? (
            <>
              <button
                onClick={handleMarkAllPresent}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-[#159A61] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Cả lớp có mặt</span>
              </button>
              <button
                onClick={handleSaveAttendance}
                className="px-4 py-2 rounded-xl bg-[#0755B8] hover:bg-[#062B65] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Lưu điểm danh</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAddConduct(true)}
              className="px-4 py-2 rounded-xl bg-[#0755B8] hover:bg-[#062B65] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Ghi nhận rèn luyện</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 gap-2 sm:gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'border-[#0755B8] text-[#0755B8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4" />
          <span>Điểm danh học sinh ({students.length} HS)</span>
        </button>

        <button
          onClick={() => setActiveTab('conduct')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'conduct'
              ? 'border-[#0755B8] text-[#0755B8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Nhật ký rèn luyện & Hạnh kiểm ({conductLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: Attendance */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm text-center">
              <span className="text-xs text-slate-500 font-semibold">Tỉ lệ chuyên cần</span>
              <div className="text-2xl font-bold text-[#062B65] mt-1">{attendanceRate}%</div>
              <div className="text-[10px] text-[#159A61] font-bold">Hôm nay</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm text-center">
              <span className="text-xs text-slate-500 font-semibold">Có mặt</span>
              <div className="text-2xl font-bold text-[#159A61] mt-1">{presentCount} HS</div>
              <div className="text-[10px] text-slate-400">Đúng giờ</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm text-center">
              <span className="text-xs text-slate-500 font-semibold">Nghỉ có phép</span>
              <div className="text-2xl font-bold text-[#0755B8] mt-1">{excusedCount} HS</div>
              <div className="text-[10px] text-slate-400">Có đơn PH</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm text-center">
              <span className="text-xs text-slate-500 font-semibold">Đi muộn</span>
              <div className="text-2xl font-bold text-[#F5A623] mt-1">{lateCount} HS</div>
              <div className="text-[10px] text-slate-400">Đã vào lớp</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm text-center">
              <span className="text-xs text-slate-500 font-semibold">Không phép</span>
              <div className="text-2xl font-bold text-[#E34B5F] mt-1">{unexcusedCount} HS</div>
              <div className="text-[10px] text-slate-400">Cần liên hệ PH</div>
            </div>
          </div>

          {/* Date & Session Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Ngày điểm danh:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Buổi:</span>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value as any)}
                  className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl outline-none"
                >
                  <option value="Sáng">Buổi Sáng (Tiết 1 - 5)</option>
                  <option value="Chiều">Buổi Chiều (Tiết 6 - 9)</option>
                </select>
              </div>
            </div>

            <span className="text-xs text-slate-500">
              Nhấp chọn trực tiếp trạng thái của học sinh: Có mặt · Có phép · Đi muộn · Không phép
            </span>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                  <tr>
                    <th className="py-3 px-3 text-center">STT</th>
                    <th className="py-3 px-3">Mã HS</th>
                    <th className="py-3 px-4">Họ và tên</th>
                    <th className="py-3 px-2 text-center">Tổ</th>
                    <th className="py-3 px-4 text-center">Trạng thái điểm danh</th>
                    <th className="py-3 px-4">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((s, idx) => {
                    const record = attendanceMap[s.id] || { studentId: s.id, status: 'present' };

                    return (
                      <tr key={s.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2.5 px-3 text-center text-xs font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-xs text-slate-600">{s.id}</td>
                        <td className="py-2.5 px-4 font-semibold text-[#183153]">{s.name}</td>
                        <td className="py-2.5 px-2 text-center text-xs text-slate-500">Tổ {s.group}</td>
                        <td className="py-2.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            <button
                              onClick={() => handleSetStatus(s.id, 'present')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                                record.status === 'present'
                                  ? 'bg-[#159A61] text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Có mặt
                            </button>
                            <button
                              onClick={() => handleSetStatus(s.id, 'excused')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                                record.status === 'excused'
                                  ? 'bg-[#0755B8] text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Có phép
                            </button>
                            <button
                              onClick={() => handleSetStatus(s.id, 'late')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                                record.status === 'late'
                                  ? 'bg-[#F5A623] text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Đi muộn
                            </button>
                            <button
                              onClick={() => handleSetStatus(s.id, 'unexcused')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                                record.status === 'unexcused'
                                  ? 'bg-[#E34B5F] text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Không phép
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-xs text-slate-500">
                          {record.note || (record.status === 'present' ? 'Bình thường' : 'Chưa có ghi chú')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Conduct */}
      {activeTab === 'conduct' && (
        <div className="space-y-6">
          {showAddConduct && (
            <form
              onSubmit={handleCreateConduct}
              className="bg-white p-5 rounded-2xl border border-blue-200 shadow-md space-y-4"
            >
              <h4 className="font-bold text-sm text-[#062B65]">Ghi chép hành vi rèn luyện</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Học sinh:</label>
                  <select
                    value={newConductStudentId}
                    onChange={(e) => setNewConductStudentId(e.target.value)}
                    className="w-full mt-1 p-2 text-xs border rounded-lg outline-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Phân loại:</label>
                  <select
                    value={newConductCategory}
                    onChange={(e) => setNewConductCategory(e.target.value as any)}
                    className="w-full mt-1 p-2 text-xs border rounded-lg outline-none"
                  >
                    <option value="Khen ngợi">Khen ngợi (+5 điểm)</option>
                    <option value="Nhắc nhở">Nhắc nhở (-2 điểm)</option>
                    <option value="Vi phạm">Vi phạm (-5 điểm)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Nội dung sự việc:</label>
                  <input
                    type="text"
                    required
                    value={newConductContent}
                    onChange={(e) => setNewConductContent(e.target.value)}
                    placeholder="Mô tả hành vi, việc tốt hoặc vi phạm..."
                    className="w-full mt-1 p-2 text-xs border rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddConduct(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-[#0755B8] rounded-lg font-bold"
                >
                  Lưu vào sổ rèn luyện
                </button>
              </div>
            </form>
          )}

          {/* Conduct list */}
          <div className="space-y-3">
            {conductLogs.map((entry) => {
              const student = students.find((s) => s.id === entry.studentId);
              const isPositive = entry.category === 'Khen ngợi';

              return (
                <div
                  key={entry.id}
                  className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isPositive
                            ? 'bg-emerald-100 text-[#159A61]'
                            : entry.category === 'Nhắc nhở'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-[#E34B5F]'
                        }`}
                      >
                        {entry.category} ({entry.points > 0 ? `+${entry.points}` : entry.points} đ)
                      </span>
                      <span className="text-sm font-bold text-[#062B65]">
                        {student ? student.name : entry.studentId}
                      </span>
                      <span className="text-xs text-slate-400">· {entry.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {entry.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
