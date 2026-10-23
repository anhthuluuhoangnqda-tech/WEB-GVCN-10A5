import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { StudentDetailModal } from '../modals/StudentDetailModal';
import { AddStudentModal } from '../modals/AddStudentModal';
import {
  Contact,
  UserPlus,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Edit2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const StudentProfiles: React.FC = () => {
  const {
    students,
    deleteStudent,
    clearSampleData,
    resetSampleData,
    selectedStudentId,
    setSelectedStudentId,
    showToast,
    addStudent,
  } = useApp();

  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | undefined>(undefined);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      (s.parentName && s.parentName.toLowerCase().includes(search.toLowerCase()));

    const matchesGroup = groupFilter === 'all' || s.group.toString() === groupFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesGender = genderFilter === 'all' || s.gender === genderFilter;

    return matchesSearch && matchesGroup && matchesStatus && matchesGender;
  });

  // Export students to Excel
  const handleExportExcel = () => {
    const rows = students.map((s, idx) => ({
      'STT': idx + 1,
      'Mã học sinh': s.id,
      'Họ và tên': s.name,
      'Giới tính': s.gender,
      'Ngày sinh': s.dob,
      'Lớp': s.classId,
      'Tổ': s.group,
      'Chức vụ': s.role || 'Học sinh',
      'Trạng thái': s.status,
      'Phụ huynh': s.parentName,
      'SĐT Phụ huynh': s.parentPhone,
      'Địa chỉ': s.address,
      'Ghi chú': s.notes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ho_So_Hoc_Sinh_10A5');
    XLSX.writeFile(workbook, `Danh_Sach_Ho_So_Hoc_Sinh_Lop_10A5_Ngo_Quyen.xlsx`);
    showToast('Đã xuất thành công tệp Excel danh sách học sinh!');
  };

  // Import from Excel
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        let count = 0;
        data.forEach((row) => {
          const studentName = row['Họ và tên'] || row['Họ tên'] || row['name'];
          if (studentName) {
            addStudent({
              name: String(studentName).trim(),
              gender: row['Giới tính'] === 'Nam' ? 'Nam' : 'Nữ',
              dob: row['Ngày sinh'] || '2010-01-01',
              group: Number(row['Tổ']) || 1,
              role: row['Chức vụ'] || 'Học sinh',
              classId: '10A5',
              status: 'Đang học',
              parentName: row['Phụ huynh'] || `Phụ huynh em ${studentName}`,
              parentPhone: row['SĐT Phụ huynh'] || row['Điện thoại'] || '0988.xxx.xxx',
              address: row['Địa chỉ'] || 'Huyện Đông Anh, TP. Hà Nội',
              notes: row['Ghi chú'] || 'Nhập từ file Excel',
            });
            count++;
          }
        });
        showToast(`Đã nhập thành công ${count} học sinh từ tệp Excel!`);
      } catch (err) {
        showToast('Có lỗi xảy ra khi đọc tệp Excel. Vui lòng kiểm tra định dạng!');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#062B65] to-[#1687E8] text-white flex items-center justify-center shadow-md">
            <Contact className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#062B65]">
                Phân hệ: Quản lý Hồ sơ Học sinh (Lớp 10A5)
              </h2>
              <span className="text-xs bg-blue-100 text-[#0755B8] font-bold px-2 py-0.5 rounded-full">
                Sĩ số: {students.length} HS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Lưu trữ hồ sơ 360°, thông tin liên hệ phụ huynh và lịch sử phát triển cá nhân
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => {
              setStudentToEdit(undefined);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0755B8] hover:bg-[#062B65] text-white text-xs font-bold transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm học sinh</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-all shadow-sm">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Nhập Excel</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImportExcel}
              className="hidden"
            />
          </label>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          {/* Clear sample data button per Section XIV */}
          {students.some((s) => s.isDemo) ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 text-[#E34B5F] text-xs font-bold transition-all shadow-sm"
              title="Xóa 31 học sinh mẫu trước khi nhập dữ liệu thật"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa dữ liệu mẫu</span>
            </button>
          ) : (
            <button
              onClick={resetSampleData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-[#0755B8] text-xs font-bold transition-all shadow-sm"
              title="Tải lại 31 học sinh mẫu để thử nghiệm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Nạp lại dữ liệu mẫu</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirm modal for clearing sample data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-[#E34B5F]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-lg">Xác nhận xóa dữ liệu mẫu</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa toàn bộ danh sách <b>học sinh mẫu 10A5</b> không? Thao tác này giúp làm sạch hệ thống để bạn bắt đầu nhập danh sách học sinh thật của trường THPT Ngô Quyền.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  clearSampleData();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 bg-[#E34B5F] hover:bg-[#c93c4f] text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Đồng ý xóa dữ liệu mẫu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and search toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên, mã HS, phụ huynh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#0755B8]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none bg-white font-medium text-slate-700"
          >
            <option value="all">Tất cả các tổ</option>
            <option value="1">Tổ 1</option>
            <option value="2">Tổ 2</option>
            <option value="3">Tổ 3</option>
            <option value="4">Tổ 4</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none bg-white font-medium text-slate-700"
          >
            <option value="all">Tất cả giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none bg-white font-medium text-slate-700"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Đang học">Đang học</option>
            <option value="Nghỉ học">Nghỉ học</option>
            <option value="Chuyển trường">Chuyển trường</option>
          </select>
        </div>
      </div>

      {/* Main Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <tr>
                <th className="py-3 px-3 text-center">STT</th>
                <th className="py-3 px-3">Mã học sinh</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-2 text-center">Giới tính</th>
                <th className="py-3 px-3">Ngày sinh</th>
                <th className="py-3 px-2 text-center">Tổ</th>
                <th className="py-3 px-3">Chức vụ</th>
                <th className="py-3 px-3 text-center">Trạng thái</th>
                <th className="py-3 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-sm">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-500 text-xs">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs font-bold text-[#0755B8]">
                      {s.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0755B8] font-bold text-xs flex items-center justify-center shrink-0">
                          {s.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#183153] text-[14px]">
                            {s.name}
                          </div>
                          {s.isDemo && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 rounded">
                              DỮ LIỆU MẪU
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center text-xs">{s.gender}</td>
                    <td className="py-2.5 px-3 text-xs text-slate-600 font-mono">{s.dob}</td>
                    <td className="py-2.5 px-2 text-center">
                      <span className="text-xs bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-700">
                        Tổ {s.group}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-xs font-semibold text-[#0755B8]">
                      {s.role || 'Học sinh'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#159A61] bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{s.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedStudentId(s.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Mở hồ sơ 360°"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setStudentToEdit(s);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa học sinh ${s.name} khỏi lớp 10A5?`)) {
                              deleteStudent(s.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa học sinh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Đang hiển thị {filteredStudents.length} / {students.length} học sinh</span>
          <span>Khóa 2026–2029 · THPT Ngô Quyền</span>
        </div>
      </div>

      {/* Modals */}
      {selectedStudentId && (
        <StudentDetailModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}

      {isAddModalOpen && (
        <AddStudentModal
          studentToEdit={studentToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setStudentToEdit(undefined);
          }}
        />
      )}
    </div>
  );
};
