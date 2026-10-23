import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSubjectAverage } from '../../data/initialData';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart2,
  BookOpen,
  MessageSquare,
  Send,
} from 'lucide-react';

interface StudentDetailModalProps {
  studentId: string;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ studentId, onClose }) => {
  const { students, grades, updateStudent, showToast, teacher } = useApp();
  const student = students.find((s) => s.id === studentId);
  const grade = grades[studentId];
  const avgScore = calculateSubjectAverage(grade);

  const [activeTab, setActiveTab] = useState<'info' | 'academic' | 'attendance' | 'conduct' | 'parent_comm'>('info');
  const [newParentNote, setNewParentNote] = useState('');
  const [commLogs, setCommLogs] = useState<{ date: string; content: string; teacher: string }[]>([
    {
      date: '2026-10-18',
      content: 'Trao đổi qua điện thoại với phụ huynh về tình hình chuẩn bị ôn thi giữa kỳ môn Vật lí. Phụ huynh nhất trí đôn đốc con tại nhà.',
      teacher: 'Cô Lưu Hoàng Anh Thư',
    },
    {
      date: '2026-09-28',
      content: 'Nhắn tin Zalo thông báo kết quả bài kiểm tra 15 phút (đạt 9.0 điểm). Phụ huynh rất phấn khởi và gửi lời cảm ơn cô giáo.',
      teacher: 'Cô Lưu Hoàng Anh Thư',
    },
  ]);

  if (!student) return null;

  const handleAddComm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParentNote.trim()) return;
    setCommLogs([
      {
        date: new Date().toISOString().split('T')[0],
        content: newParentNote,
        teacher: teacher.name,
      },
      ...commLogs,
    ]);
    setNewParentNote('');
    showToast('Đã lưu nội dung trao đổi phụ huynh!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#062B65] via-[#0755B8] to-[#1687E8] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-xl font-bold border border-white/20 shadow-inner">
              {student.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {student.name}
                </h3>
                <span className="text-[11px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  {student.id}
                </span>
                {student.isDemo && (
                  <span className="text-[10px] bg-amber-400 text-[#062B65] font-bold px-1.5 py-0.5 rounded">
                    DỮ LIỆU MẪU
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                Lớp {student.classId} · Tổ {student.group} · {student.role || 'Học sinh'} · Trạng thái: {student.status}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-[#0755B8] text-[#0755B8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Thông tin cá nhân</span>
          </button>

          <button
            onClick={() => setActiveTab('academic')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'academic'
                ? 'border-[#0755B8] text-[#0755B8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Kết quả học tập</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'attendance'
                ? 'border-[#0755B8] text-[#0755B8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Chuyên cần</span>
          </button>

          <button
            onClick={() => setActiveTab('conduct')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'conduct'
                ? 'border-[#0755B8] text-[#0755B8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Rèn luyện & Khen thưởng</span>
          </button>

          <button
            onClick={() => setActiveTab('parent_comm')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'parent_comm'
                ? 'border-[#0755B8] text-[#0755B8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Trao đổi phụ huynh ({commLogs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {/* TAB 1: General Info */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <h4 className="text-xs font-bold text-[#062B65] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Lý lịch học sinh</span>
                  </h4>
                  <div className="text-xs text-slate-700 space-y-1.5">
                    <div><b>Mã định danh:</b> <span className="font-mono">{student.id}</span></div>
                    <div><b>Họ và tên:</b> {student.name}</div>
                    <div><b>Ngày sinh:</b> {student.dob}</div>
                    <div><b>Giới tính:</b> {student.gender}</div>
                    <div><b>Lớp:</b> {student.classId} · Tổ: {student.group}</div>
                    <div><b>Chức vụ:</b> {student.role || 'Học sinh'}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <h4 className="text-xs font-bold text-[#062B65] uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Thông tin gia đình & Liên hệ</span>
                  </h4>
                  <div className="text-xs text-slate-700 space-y-1.5">
                    <div><b>Họ tên cha/mẹ:</b> {student.parentName}</div>
                    <div><b>Điện thoại liên hệ:</b> <span className="font-mono font-bold text-[#0755B8]">{student.parentPhone}</span></div>
                    <div><b>Địa chỉ thường trú:</b> {student.address}</div>
                    <div><b>Ghi chú của GVCN:</b> {student.notes || 'Không có ghi chú đặc biệt'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Academic */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-600">ĐTB Môn Vật lí (HKII)</span>
                  <div className="text-3xl font-bold text-[#062B65] mt-0.5">
                    {avgScore !== null ? avgScore.toFixed(1).replace('.', ',') : '8,9'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-600">Xếp loại môn:</span>
                  <div className="text-lg font-bold text-[#159A61]">
                    {avgScore && avgScore >= 8.0 ? 'Tốt (Giỏi)' : 'Khá'}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Đầu điểm</th>
                      <th className="p-3 text-center">Hệ số</th>
                      <th className="p-3 text-center">Điểm số</th>
                      <th className="p-3">Nhận xét của cô Thư</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-semibold">Đánh giá thường xuyên 1 (TX1)</td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-center font-bold text-blue-700">{grade?.tx1 ?? 8.5}</td>
                      <td className="p-3 text-slate-500">Bài kiểm tra 15 phút Cơ học</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Đánh giá thường xuyên 2 (TX2)</td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-center font-bold text-blue-700">{grade?.tx2 ?? 8.5}</td>
                      <td className="p-3 text-slate-500">Thực hành đo hệ số ma sát</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Đánh giá thường xuyên 3 (TX3)</td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-center font-bold text-blue-700">{grade?.tx3 ?? 9.0}</td>
                      <td className="p-3 text-slate-500">Vấn đáp & Thảo luận nhóm</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Đánh giá thường xuyên 4 (TX4)</td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-center font-bold text-blue-700">{grade?.tx4 ?? 8.5}</td>
                      <td className="p-3 text-slate-500">Phiếu học tập bài tập tự giải</td>
                    </tr>
                    <tr className="bg-blue-50/50">
                      <td className="p-3 font-bold text-[#062B65]">Đánh giá giữa kỳ (GK)</td>
                      <td className="p-3 text-center font-bold">2</td>
                      <td className="p-3 text-center font-bold text-[#0755B8] text-sm">{grade?.gk ?? 8.5}</td>
                      <td className="p-3 text-slate-600 font-medium">Đề kiểm tra tập trung ma trận 4 mức độ</td>
                    </tr>
                    <tr className="bg-indigo-50/50">
                      <td className="p-3 font-bold text-[#062B65]">Đánh giá cuối kỳ (CK)</td>
                      <td className="p-3 text-center font-bold">3</td>
                      <td className="p-3 text-center font-bold text-indigo-800 text-sm">{grade?.ck ?? 9.0}</td>
                      <td className="p-3 text-slate-600 font-medium">Thi học kỳ chung toàn khối 10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Attendance */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <div className="text-xl font-bold text-[#159A61]">98%</div>
                  <div className="text-xs text-slate-600 mt-0.5">Tỉ lệ có mặt</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <div className="text-xl font-bold text-[#0755B8]">1 buổi</div>
                  <div className="text-xs text-slate-600 mt-0.5">Nghỉ có phép</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <div className="text-xl font-bold text-[#F5A623]">0 buổi</div>
                  <div className="text-xs text-slate-600 mt-0.5">Nghỉ không phép / Đi muộn</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                * Học sinh chấp hành tốt quy chế thời gian học tập, không có biểu hiện vi phạm giờ giấc.
              </p>
            </div>
          )}

          {/* TAB 4: Conduct */}
          {activeTab === 'conduct' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-bold">Đánh giá rèn luyện hiện tại:</span>
                  <div className="text-lg font-bold text-[#159A61]">Mức: TỐT</div>
                </div>
                <Award className="w-8 h-8 text-amber-500" />
              </div>
              <div className="text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-[#062B65]">Nhận xét của GVCN Lưu Hoàng Anh Thư:</div>
                <p className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 leading-relaxed">
                  Em {student.name} có tinh thần trách nhiệm cao, hòa đồng với bạn bè, tích cực tham gia các hoạt động tập thể của Chi đoàn 10A5. Kính trọng thầy cô và có ý thức giữ gìn vệ sinh chung của nhà trường.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: Parent Communication */}
          {activeTab === 'parent_comm' && (
            <div className="space-y-4">
              <form onSubmit={handleAddComm} className="flex gap-2">
                <input
                  type="text"
                  value={newParentNote}
                  onChange={(e) => setNewParentNote(e.target.value)}
                  placeholder="Ghi nhanh nội dung trao đổi với phụ huynh..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#0755B8]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0755B8] hover:bg-[#062B65] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Lưu ghi chú</span>
                </button>
              </form>

              <div className="space-y-2">
                {commLogs.map((log, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#062B65]">{log.teacher}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{log.date}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{log.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Hồ sơ điện tử học sinh · Trường THPT Ngô Quyền - Đông Anh
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
