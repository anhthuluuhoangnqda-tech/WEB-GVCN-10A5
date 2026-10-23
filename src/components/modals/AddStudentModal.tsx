import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { X, UserPlus, Check } from 'lucide-react';

interface AddStudentModalProps {
  onClose: () => void;
  studentToEdit?: Student;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, studentToEdit }) => {
  const { addStudent, updateStudent, showToast } = useApp();

  const [name, setName] = useState(studentToEdit?.name || '');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>(studentToEdit?.gender || 'Nữ');
  const [dob, setDob] = useState(studentToEdit?.dob || '2010-01-15');
  const [group, setGroup] = useState<number>(studentToEdit?.group || 1);
  const [role, setRole] = useState(studentToEdit?.role || 'Học sinh');
  const [status, setStatus] = useState<'Đang học' | 'Nghỉ học' | 'Chuyển trường'>(studentToEdit?.status || 'Đang học');
  const [parentName, setParentName] = useState(studentToEdit?.parentName || '');
  const [parentPhone, setParentPhone] = useState(studentToEdit?.parentPhone || '');
  const [address, setAddress] = useState(studentToEdit?.address || 'Huyện Đông Anh, TP. Hà Nội');
  const [notes, setNotes] = useState(studentToEdit?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Vui lòng nhập họ và tên học sinh!');
      return;
    }

    if (studentToEdit) {
      updateStudent(studentToEdit.id, {
        name,
        gender,
        dob,
        group,
        role,
        status,
        parentName,
        parentPhone,
        address,
        notes,
      });
      showToast(`Đã cập nhật hồ sơ ${studentToEdit.id}`);
    } else {
      addStudent({
        name,
        gender,
        dob,
        group,
        role,
        classId: '10A5',
        status,
        parentName: parentName || `Phụ huynh em ${name}`,
        parentPhone: parentPhone || '0988.xxx.xxx',
        address,
        notes,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="bg-gradient-to-r from-[#062B65] via-[#0755B8] to-[#1687E8] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5" />
            <h3 className="font-bold text-lg">
              {studentToEdit ? 'Chỉnh sửa hồ sơ học sinh' : 'Thêm học sinh mới vào lớp 10A5'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-slate-700">Họ và tên học sinh *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Văn An"
              className="w-full mt-1 px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#0755B8]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Ngày sinh</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl outline-none"
              >
              </input>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Phân tổ</label>
              <select
                value={group}
                onChange={(e) => setGroup(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
              >
                <option value={1}>Tổ 1</option>
                <option value={2}>Tổ 2</option>
                <option value={3}>Tổ 3</option>
                <option value={4}>Tổ 4</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Chức vụ trong lớp</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Lớp trưởng, Tổ trưởng, Học sinh..."
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Trạng thái học tập</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
              >
                <option value="Đang học">Đang học</option>
                <option value="Nghỉ học">Nghỉ học</option>
                <option value="Chuyển trường">Chuyển trường</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Họ tên Phụ huynh</label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Họ tên bố/mẹ..."
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Số điện thoại Phụ huynh</label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="09xx.xxx.xxx"
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Địa chỉ thường trú</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Xã/Thị trấn, Huyện Đông Anh..."
              className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Ghi chú của GVCN</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Đặc điểm tính cách, lưu ý sức khỏe..."
              className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs text-white bg-[#0755B8] hover:bg-[#062B65] rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{studentToEdit ? 'Lưu thay đổi' : 'Thêm học sinh'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
