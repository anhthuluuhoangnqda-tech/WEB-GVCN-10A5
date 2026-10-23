import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  User,
  Calendar,
  Layers,
  Database,
  Download,
  Upload,
  RefreshCw,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { teacher, updateTeacher, students, grades, materials, homeroomLogs, resetSampleData, clearSampleData, showToast } = useApp();

  // Teacher Form State
  const [name, setName] = useState(teacher.name);
  const [title, setTitle] = useState(teacher.title);
  const [school, setSchool] = useState(teacher.school);
  const [homeroomClass, setHomeroomClass] = useState(teacher.homeroomClass);
  const [cohort, setCohort] = useState(teacher.cohort);
  const [academicYear, setAcademicYear] = useState(teacher.academicYear);
  const [semester, setSemester] = useState(teacher.semester);
  const [email, setEmail] = useState(teacher.email);
  const [phone, setPhone] = useState(teacher.phone);
  const [avatarUrl, setAvatarUrl] = useState(teacher.avatarUrl);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacher({
      name,
      title,
      school,
      homeroomClass,
      cohort,
      academicYear,
      semester,
      email,
      phone,
      avatarUrl,
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setAvatarUrl(evt.target.result as string);
        showToast('Đã tải ảnh đại diện mới thành công!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Backup system data to JSON
  const handleBackupData = () => {
    const backupObj = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      teacher,
      students,
      grades,
      materials,
      homeroomLogs,
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `NgoQuyen_SmartClass_Backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã tạo và tải tệp sao lưu dữ liệu (.json) thành công!');
  };

  // Restore system data from JSON
  const handleRestoreData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.teacher) updateTeacher(parsed.teacher);
        if (parsed.students) localStorage.setItem('nq_students', JSON.stringify(parsed.students));
        if (parsed.grades) localStorage.setItem('nq_grades', JSON.stringify(parsed.grades));
        if (parsed.materials) localStorage.setItem('nq_materials', JSON.stringify(parsed.materials));
        if (parsed.homeroomLogs) localStorage.setItem('nq_homeroom_logs', JSON.stringify(parsed.homeroomLogs));
        showToast('Đã khôi phục dữ liệu từ tệp sao lưu thành công! Đang làm mới hệ thống...');
        setTimeout(() => window.location.reload(), 1200);
      } catch (err) {
        showToast('Tệp sao lưu không hợp lệ!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#062B65] to-[#1687E8] text-white flex items-center justify-center shadow-md">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#062B65]">
              Phân hệ: Cài đặt Hệ thống & Hồ sơ Giáo viên
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Quản lý thông tin tài khoản, năm học, bảng môn học và sao lưu khôi phục dữ liệu
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Teacher Profile Configuration (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-[#0755B8]" />
            <h3 className="font-bold text-base text-[#062B65]">Hồ sơ Giáo viên & Trường học</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Avatar Preview & Upload */}
            <div className="flex items-center gap-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <img
                src={avatarUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#062B65] block">Ảnh chân dung giáo viên</span>
                <label className="inline-block px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer shadow-xs">
                  <span>Thay đổi ảnh mới</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
                <div className="text-[11px] text-slate-500">
                  Hỗ trợ định dạng JPG, PNG (tối ưu khung tròn 1:1)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Họ và tên giáo viên *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#0755B8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Chức vụ & Phân công</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#0755B8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Trường THPT *</label>
                <input
                  type="text"
                  required
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#0755B8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Lớp chủ nhiệm</label>
                <input
                  type="text"
                  value={homeroomClass}
                  onChange={(e) => setHomeroomClass(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#0755B8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Khóa học</label>
                <input
                  type="text"
                  value={cohort}
                  onChange={(e) => setCohort(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Năm học</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                >
                  <option value="2026–2027">2026–2027</option>
                  <option value="2025–2026">2025–2026</option>
                  <option value="2027–2028">2027–2028</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Học kỳ</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                >
                  <option value="Học kỳ II">Học kỳ II</option>
                  <option value="Học kỳ I">Học kỳ I</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Email công vụ</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Số điện thoại liên lạc</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0755B8] hover:bg-[#062B65] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thông tin giáo viên</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: System, Palette & Backup / Restore (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Design & Typography Spec */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Layers className="w-5 h-5 text-[#0755B8]" />
              <h3 className="font-bold text-base text-[#062B65]">Giao diện & Tiêu chuẩn hiển thị</h3>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-bold">Phông chữ toàn hệ thống:</span>
                <span className="font-serif font-bold text-[#062B65]">Times New Roman</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-bold">Màu chủ đạo:</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#062B65]" title="#062B65" />
                  <span className="w-4 h-4 rounded-full bg-[#0755B8]" title="#0755B8" />
                  <span className="w-4 h-4 rounded-full bg-[#1687E8]" title="#1687E8" />
                  <span className="w-4 h-4 rounded-full bg-[#29C5E8]" title="#29C5E8" />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-bold">Múi giờ hoạt động:</span>
                <span className="font-mono text-slate-700">Asia/Ho_Chi_Minh (+07:00)</span>
              </div>
            </div>
          </div>

          {/* Backup & Restore Data */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-[#062B65]">Sao lưu & Khôi phục dữ liệu</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Dữ liệu được lưu trữ an toàn trong trình duyệt (LocalStorage). Để phòng ngừa mất mát dữ liệu hoặc chuyển sang máy tính khác, vui lòng sao lưu tệp JSON định kỳ.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={handleBackupData}
                className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#159A61] rounded-xl text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Xuất file sao lưu toàn bộ dữ liệu (.json)</span>
              </button>

              <label className="w-full flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0755B8] rounded-xl text-xs font-bold transition-all cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Khôi phục dữ liệu từ file sao lưu</span>
                <input type="file" accept=".json" onChange={handleRestoreData} className="hidden" />
              </label>

              <button
                onClick={resetSampleData}
                className="w-full flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>Nạp lại 31 học sinh & dữ liệu mẫu ban đầu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
