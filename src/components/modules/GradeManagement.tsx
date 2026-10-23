import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSubjectAverage } from '../../data/initialData';
import {
  BarChart3,
  Lock,
  Unlock,
  Save,
  Download,
  AlertCircle,
  CheckCircle2,
  Filter,
  Calculator,
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const GradeManagement: React.FC = () => {
  const {
    students,
    grades,
    updateGradeItem,
    isGradeLocked,
    setIsGradeLocked,
    showToast,
    teacher,
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('Vật lí');
  const [selectedSemester, setSelectedSemester] = useState<'HK1' | 'HK2'>('HK2');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Filter students
  const displayStudents = filterGroup === 'all'
    ? students
    : students.filter((s) => s.group.toString() === filterGroup);

  const handleScoreChange = (
    studentId: string,
    field: 'tx1' | 'tx2' | 'tx3' | 'tx4' | 'gk' | 'ck',
    valueStr: string
  ) => {
    if (isGradeLocked) {
      showToast('Bảng điểm đang bị KHÓA. Hãy bấm nút Mở khóa để chỉnh sửa.');
      return;
    }

    if (valueStr === '') {
      updateGradeItem(studentId, { [field]: undefined });
      setHasUnsavedChanges(true);
      return;
    }

    const val = parseFloat(valueStr.replace(',', '.'));
    if (isNaN(val)) return;

    if (val < 0 || val > 10) {
      showToast('Điểm số phải nằm trong khoảng từ 0 đến 10!');
      return;
    }

    updateGradeItem(studentId, { [field]: val });
    setHasUnsavedChanges(true);
  };

  const handleSaveGrades = () => {
    setHasUnsavedChanges(false);
    showToast('Đã lưu dữ liệu bảng điểm thành công vào hệ thống!');
  };

  const handleExportExcel = () => {
    const rows = students.map((s, idx) => {
      const g = grades[s.id];
      const avg = calculateSubjectAverage(g);
      return {
        'STT': idx + 1,
        'Mã học sinh': s.id,
        'Họ và tên': s.name,
        'Tổ': s.group,
        'TX1': g?.tx1 ?? '',
        'TX2': g?.tx2 ?? '',
        'TX3': g?.tx3 ?? '',
        'TX4': g?.tx4 ?? '',
        'Giữa kỳ (x2)': g?.gk ?? '',
        'Cuối kỳ (x3)': g?.ck ?? '',
        'ĐTB Môn HK': avg ?? '',
        'Xếp loại':
          avg !== null
            ? avg >= 8.0
              ? 'Tốt'
              : avg >= 6.5
              ? 'Khá'
              : avg >= 5.0
              ? 'Đạt'
              : 'Chưa đạt'
            : '',
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Bang_Diem_${selectedSubject}_10A5`);
    XLSX.writeFile(wb, `Bang_Diem_${selectedSubject}_Lop_10A5_Ngo_Quyen.xlsx`);
    showToast('Đã xuất thành công tệp Excel bảng điểm!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#062B65] to-[#1687E8] text-white flex items-center justify-center shadow-md">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#062B65]">
                Phân hệ: Quản lý Điểm & Sổ Điểm Điện Tử (TT22)
              </h2>
              <span className="text-xs bg-emerald-100 text-[#159A61] font-bold px-2.5 py-0.5 rounded-full">
                Thông tư 22/2021/TT-BGDĐT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Tự động tính ĐTBmhk = (Tổng TX + 2×GK + 3×CK) / (Số điểm TX + 5) · Làm tròn 1 chữ số
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => {
              setIsGradeLocked(!isGradeLocked);
              showToast(isGradeLocked ? 'Đã MỞ KHÓA bảng điểm.' : 'Đã KHÓA bảng điểm chống sửa nhầm.');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isGradeLocked
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
            }`}
          >
            {isGradeLocked ? <Lock className="w-4 h-4 text-amber-700" /> : <Unlock className="w-4 h-4 text-slate-600" />}
            <span>{isGradeLocked ? 'Bảng điểm đang Khóa' : 'Khóa chỉnh sửa'}</span>
          </button>

          <button
            onClick={handleSaveGrades}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0755B8] hover:bg-[#062B65] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Lưu bảng điểm</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Môn học:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#062B65]"
            >
              <option value="Vật lí">Vật lí (Cô Lưu Hoàng Anh Thư)</option>
              <option value="Toán học">Toán học</option>
              <option value="Ngữ văn">Ngữ văn</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
              <option value="Hóa học">Hóa học</option>
              <option value="Sinh học">Sinh học</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Học kỳ:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#062B65]"
            >
              <option value="HK2">Học kỳ II (2026-2027)</option>
              <option value="HK1">Học kỳ I (2026-2027)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Lọc theo tổ:</span>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none text-[#062B65]"
            >
              <option value="all">Tất cả ({students.length} HS)</option>
              <option value="1">Tổ 1</option>
              <option value="2">Tổ 2</option>
              <option value="3">Tổ 3</option>
              <option value="4">Tổ 4</option>
            </select>
          </div>
        </div>

        {hasUnsavedChanges && (
          <div className="text-xs text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Có thay đổi chưa lưu, bấm "Lưu bảng điểm" để cập nhật!</span>
          </div>
        )}
      </div>

      {/* Spreadsheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#062B65] text-white text-xs font-bold sticky top-0 z-10 select-none">
              <tr>
                <th className="py-3 px-2 text-center border-r border-[#0A3D8F] w-12">STT</th>
                <th className="py-3 px-3 border-r border-[#0A3D8F] w-28">Mã HS</th>
                <th className="py-3 px-4 border-r border-[#0A3D8F] min-w-[200px]">Họ và tên</th>
                <th className="py-3 px-2 text-center border-r border-[#0A3D8F] w-16">Tổ</th>
                <th className="py-3 px-2 text-center border-r border-[#0A3D8F] w-20">TX 1</th>
                <th className="py-3 px-2 text-center border-r border-[#0A3D8F] w-20">TX 2</th>
                <th className="py-3 px-2 text-center border-r border-[#0A3D8F] w-20">TX 3</th>
                <th className="py-3 px-2 text-center border-r border-[#0A3D8F] w-20">TX 4</th>
                <th className="py-3 px-2 text-center border-r border-[#0A3D8F] w-24 bg-[#0755B8]">
                  Giữa kỳ (x2)
                </th>
                <th className="py-3 px-2 text-center border-r border-[#0A3D8F] w-24 bg-[#1687E8]">
                  Cuối kỳ (x3)
                </th>
                <th className="py-3 px-3 text-center border-r border-[#0A3D8F] w-24 bg-[#159A61]">
                  ĐTB Môn
                </th>
                <th className="py-3 px-3 text-center w-24 bg-slate-800">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayStudents.map((s, idx) => {
                const g = grades[s.id] || { studentId: s.id };
                const avg = calculateSubjectAverage(g);
                const rating =
                  avg !== null
                    ? avg >= 8.0
                      ? 'Tốt'
                      : avg >= 6.5
                      ? 'Khá'
                      : avg >= 5.0
                      ? 'Đạt'
                      : 'Chưa đạt'
                    : '-';
                const ratingColor =
                  rating === 'Tốt'
                    ? 'text-[#159A61] bg-emerald-50'
                    : rating === 'Khá'
                    ? 'text-[#0755B8] bg-blue-50'
                    : rating === 'Đạt'
                    ? 'text-[#F5A623] bg-amber-50'
                    : 'text-[#E34B5F] bg-red-50';

                return (
                  <tr key={s.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-1 px-2 text-center font-bold text-slate-500 text-xs border-r border-slate-100">
                      {idx + 1}
                    </td>
                    <td className="py-1 px-3 font-mono text-xs font-semibold text-slate-600 border-r border-slate-100">
                      {s.id}
                    </td>
                    <td className="py-1 px-4 font-semibold text-[#183153] border-r border-slate-100">
                      <div className="truncate max-w-[220px]">{s.name}</div>
                    </td>
                    <td className="py-1 px-2 text-center text-xs text-slate-600 border-r border-slate-100">
                      {s.group}
                    </td>

                    {/* TX1 */}
                    <td className="py-1 px-1 border-r border-slate-100 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        disabled={isGradeLocked}
                        value={g.tx1 !== undefined ? g.tx1 : ''}
                        onChange={(e) => handleScoreChange(s.id, 'tx1', e.target.value)}
                        className="w-14 text-center py-1 text-xs font-semibold border border-transparent hover:border-slate-300 focus:border-[#0755B8] focus:bg-white rounded outline-none"
                      />
                    </td>

                    {/* TX2 */}
                    <td className="py-1 px-1 border-r border-slate-100 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        disabled={isGradeLocked}
                        value={g.tx2 !== undefined ? g.tx2 : ''}
                        onChange={(e) => handleScoreChange(s.id, 'tx2', e.target.value)}
                        className="w-14 text-center py-1 text-xs font-semibold border border-transparent hover:border-slate-300 focus:border-[#0755B8] focus:bg-white rounded outline-none"
                      />
                    </td>

                    {/* TX3 */}
                    <td className="py-1 px-1 border-r border-slate-100 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        disabled={isGradeLocked}
                        value={g.tx3 !== undefined ? g.tx3 : ''}
                        onChange={(e) => handleScoreChange(s.id, 'tx3', e.target.value)}
                        className="w-14 text-center py-1 text-xs font-semibold border border-transparent hover:border-slate-300 focus:border-[#0755B8] focus:bg-white rounded outline-none"
                      />
                    </td>

                    {/* TX4 */}
                    <td className="py-1 px-1 border-r border-slate-100 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        disabled={isGradeLocked}
                        value={g.tx4 !== undefined ? g.tx4 : ''}
                        onChange={(e) => handleScoreChange(s.id, 'tx4', e.target.value)}
                        className="w-14 text-center py-1 text-xs font-semibold border border-transparent hover:border-slate-300 focus:border-[#0755B8] focus:bg-white rounded outline-none"
                      />
                    </td>

                    {/* GK (x2) */}
                    <td className="py-1 px-1 border-r border-slate-100 text-center bg-blue-50/40">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        disabled={isGradeLocked}
                        value={g.gk !== undefined ? g.gk : ''}
                        onChange={(e) => handleScoreChange(s.id, 'gk', e.target.value)}
                        className="w-14 text-center py-1 text-xs font-bold text-blue-900 border border-transparent hover:border-blue-300 focus:border-[#0755B8] focus:bg-white rounded outline-none"
                      />
                    </td>

                    {/* CK (x3) */}
                    <td className="py-1 px-1 border-r border-slate-100 text-center bg-indigo-50/40">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        disabled={isGradeLocked}
                        value={g.ck !== undefined ? g.ck : ''}
                        onChange={(e) => handleScoreChange(s.id, 'ck', e.target.value)}
                        className="w-14 text-center py-1 text-xs font-bold text-indigo-900 border border-transparent hover:border-indigo-300 focus:border-[#0755B8] focus:bg-white rounded outline-none"
                      />
                    </td>

                    {/* ĐTB Môn */}
                    <td className="py-1 px-2 text-center font-bold text-sm text-[#062B65] bg-emerald-50/50 border-r border-slate-100 font-mono">
                      {avg !== null ? avg.toFixed(1).replace('.', ',') : '-'}
                    </td>

                    {/* Xếp loại */}
                    <td className="py-1 px-2 text-center text-xs font-bold">
                      <span className={`px-2 py-0.5 rounded ${ratingColor}`}>
                        {rating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
