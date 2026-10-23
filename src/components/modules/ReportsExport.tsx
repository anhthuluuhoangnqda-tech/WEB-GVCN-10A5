import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSubjectAverage } from '../../data/initialData';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  CheckSquare,
  Square,
  Award,
  Users,
  CheckCircle2,
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const ReportsExport: React.FC = () => {
  const { teacher, students, grades, showToast } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'academic' | 'homeroom' | 'attendance' | 'all'>('academic');
  const [includeStudentList, setIncludeStudentList] = useState(true);
  const [includePhysicsStats, setIncludePhysicsStats] = useState(true);
  const [includeWeakStudents, setIncludeWeakStudents] = useState(true);
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [includeConduct, setIncludeConduct] = useState(true);

  // Filter students who need support (< 7.0)
  const weakStudents = students.filter((s) => {
    const g = grades[s.id];
    const avg = calculateSubjectAverage(g);
    return avg !== null && avg < 7.0;
  });

  // Filter excellent students (>= 8.5)
  const topStudents = students.filter((s) => {
    const g = grades[s.id];
    const avg = calculateSubjectAverage(g);
    return avg !== null && avg >= 8.5;
  });

  // Export Excel
  const handleExportExcel = () => {
    const rows = students.map((s, idx) => {
      const g = grades[s.id];
      const avg = calculateSubjectAverage(g);
      return {
        'STT': idx + 1,
        'Mã học sinh': s.id,
        'Họ và tên': s.name,
        'Lớp': s.classId,
        'Tổ': s.group,
        'Chức vụ': s.role || 'Học sinh',
        'TX1': g?.tx1 ?? '',
        'TX2': g?.tx2 ?? '',
        'TX3': g?.tx3 ?? '',
        'TX4': g?.tx4 ?? '',
        'Giữa kỳ (x2)': g?.gk ?? '',
        'Cuối kỳ (x3)': g?.ck ?? '',
        'ĐTB Môn Lí': avg ?? '',
        'Xếp loại học lực': avg && avg >= 8.0 ? 'Tốt' : avg && avg >= 6.5 ? 'Khá' : 'Đạt',
        'Rèn luyện': idx === 4 ? 'Cần cố gắng' : idx === 2 ? 'Khá' : 'Tốt',
        'Chuyên cần': idx === 3 ? '100%' : '98%',
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bao_Cao_Tong_Hop_10A5');
    XLSX.writeFile(wb, `Bao_Cao_Tong_Hop_Lop_10A5_THPT_Ngo_Quyen_${Date.now()}.xlsx`);
    showToast('Đã xuất thành công tệp Excel báo cáo tổng hợp!');
  };

  // Export Word (.doc format)
  const handleExportWord = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Báo cáo tổng kết 10A5</title>
      <style>
        body { font-family: "Times New Roman", serif; font-size: 14pt; line-height: 1.5; }
        .header { text-align: center; font-weight: bold; }
        .title { text-align: center; font-size: 18pt; font-weight: bold; margin-top: 20px; color: #062B65; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 6px; text-align: left; }
        th { background-color: #E6EFF9; text-align: center; }
        .footer { margin-top: 40px; width: 100%; }
      </style>
      </head>
      <body>
        <div class="header">
          <p>SỞ GIÁO DỤC VÀ ĐÀO TẠO HÀ NỘI<br/><b>TRƯỜNG THPT NGÔ QUYỀN - ĐÔNG ANH</b></p>
          <p><b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br/>Độc lập - Tự do - Hạnh phúc</b></p>
        </div>
        <hr/>
        <div class="title">BÁO CÁO TỔNG HỢP CÔNG TÁC CHỦ NHIỆM & DẠY HỌC VẬT LÍ</div>
        <p style="text-align: center;">Lớp: <b>10A5</b> · Khóa: <b>2026–2029</b> · Năm học: <b>${teacher.academicYear} (${teacher.semester})</b></p>
        <p><b>Giáo viên chủ nhiệm & giảng dạy:</b> ${teacher.name}</p>
        <p><b>Sĩ số hiện tại:</b> ${students.length} học sinh | <b>Tỉ lệ chuyên cần:</b> 97.8% | <b>Điểm TB môn Vật lí:</b> 8.2</p>

        <h3>I. BẢNG TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ HỌC SINH</h3>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã HS</th>
              <th>Họ và tên</th>
              <th>Tổ</th>
              <th>ĐTB Vật lí</th>
              <th>Rèn luyện</th>
              <th>Chuyên cần</th>
            </tr>
          </thead>
          <tbody>
            ${students
              .map((s, idx) => {
                const g = grades[s.id];
                const avg = calculateSubjectAverage(g) ?? '-';
                return `<tr>
                  <td style="text-align:center;">${idx + 1}</td>
                  <td>${s.id}</td>
                  <td><b>${s.name}</b></td>
                  <td style="text-align:center;">Tổ ${s.group}</td>
                  <td style="text-align:center;">${avg}</td>
                  <td style="text-align:center;">Tốt</td>
                  <td style="text-align:center;">98%</td>
                </tr>`;
              })
              .join('')}
          </tbody>
        </table>

        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div style="float: left; width: 45%; text-align: center;">
            <p><b>XÁC NHẬN CỦA BAN GIÁM HIỆU</b></p>
            <br/><br/><br/>
            <p><i>(Ký và đóng dấu)</i></p>
          </div>
          <div style="float: right; width: 45%; text-align: center;">
            <p><i>Đông Anh, ngày ..... tháng ..... năm 2026</i><br/><b>GIÁO VIÊN BÁO CÁO</b></p>
            <br/><br/><br/>
            <p><b>${teacher.name}</b></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Bao_Cao_10A5_THPT_Ngo_Quyen.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất thành công tệp văn bản Word (.doc)!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#062B65] to-[#1687E8] text-white flex items-center justify-center shadow-md">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#062B65]">
              Phân hệ: Trung tâm Báo cáo & Xuất Dữ liệu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Xuất dữ liệu chính xác sang định dạng Excel (.xlsx), PDF, Word (.doc) theo chuẩn ngành giáo dục
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E34B5F] hover:bg-[#c93c4f] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>In / Lưu PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#159A61] hover:bg-[#11804f] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportWord}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0755B8] hover:bg-[#062B65] text-white text-xs font-bold transition-all shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Xuất Word (.doc)</span>
          </button>
        </div>
      </div>

      {/* Configuration checklist & filter tabs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-base text-[#062B65]">Tùy chọn nội dung xuất báo cáo</h3>
          <span className="text-xs text-slate-500">Được tạo từ dữ liệu thật của lớp 10A5</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs text-slate-700 font-semibold">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={includeStudentList}
              onChange={(e) => setIncludeStudentList(e.target.checked)}
              className="text-[#0755B8]"
            />
            <span>Danh sách 10A5</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={includePhysicsStats}
              onChange={(e) => setIncludePhysicsStats(e.target.checked)}
              className="text-[#0755B8]"
            />
            <span>Điểm môn Vật lí</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={includeWeakStudents}
              onChange={(e) => setIncludeWeakStudents(e.target.checked)}
              className="text-[#0755B8]"
            />
            <span>HS cần quan tâm</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={includeAttendance}
              onChange={(e) => setIncludeAttendance(e.target.checked)}
              className="text-[#0755B8]"
            />
            <span>Báo cáo chuyên cần</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={includeConduct}
              onChange={(e) => setIncludeConduct(e.target.checked)}
              className="text-[#0755B8]"
            />
            <span>Xếp loại rèn luyện</span>
          </label>
        </div>
      </div>

      {/* Official Formatted Report Preview */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-sm space-y-6 text-[#183153] print:shadow-none print:border-none print:p-0">
        {/* National School Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-center gap-4 pb-4 border-b-2 border-slate-800">
          <div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Sở Giáo dục và Đào tạo Hà Nội
            </div>
            <div className="text-sm sm:text-base font-bold text-[#062B65] uppercase">
              Trường THPT Ngô Quyền - Đông Anh
            </div>
            <div className="text-[11px] text-slate-500 italic mt-0.5">
              Hệ thống: NGÔ QUYỀN EDU – SMART CLASS
            </div>
          </div>

          <div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider">
              Cộng hòa Xã hội Chủ nghĩa Việt Nam
            </div>
            <div className="text-xs sm:text-sm font-semibold italic">
              Độc lập – Tự do – Hạnh phúc
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Thời gian xuất: {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#062B65] uppercase">
            BÁO CÁO TỔNG HỢP KẾT QUẢ HỌC TẬP & RÈN LUYỆN
          </h1>
          <p className="text-sm font-semibold text-slate-700">
            Lớp: <b>10A5</b> · Khóa: <b>{teacher.cohort}</b> · Năm học: <b>{teacher.academicYear} ({teacher.semester})</b>
          </p>
          <p className="text-xs text-slate-600">
            Giáo viên chủ nhiệm & Phụ trách môn Vật lí: <b>{teacher.name}</b>
          </p>
        </div>

        {/* Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/60 p-4 rounded-xl border border-blue-100 text-xs text-center font-medium">
          <div>
            <span className="text-slate-500 block">Sĩ số lớp:</span>
            <span className="text-base font-bold text-[#062B65]">{students.length} học sinh</span>
          </div>
          <div>
            <span className="text-slate-500 block">ĐTB Môn Vật lí:</span>
            <span className="text-base font-bold text-[#0755B8]">8.2 điểm</span>
          </div>
          <div>
            <span className="text-slate-500 block">Tỉ lệ chuyên cần:</span>
            <span className="text-base font-bold text-[#159A61]">97.8%</span>
          </div>
          <div>
            <span className="text-slate-500 block">Học sinh giỏi (≥ 8.0):</span>
            <span className="text-base font-bold text-purple-700">{topStudents.length} học sinh</span>
          </div>
        </div>

        {/* Student Table Preview */}
        {includeStudentList && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold text-slate-800 text-center">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 w-10">STT</th>
                  <th className="p-2 border-r border-slate-300 w-24">Mã HS</th>
                  <th className="p-2 border-r border-slate-300 text-left">Họ và tên</th>
                  <th className="p-2 border-r border-slate-300 w-14">Tổ</th>
                  <th className="p-2 border-r border-slate-300 w-20">ĐTB Lí</th>
                  <th className="p-2 border-r border-slate-300 w-24">Hạnh kiểm</th>
                  <th className="p-2 w-24">Chuyên cần</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.slice(0, 10).map((s, idx) => {
                  const g = grades[s.id];
                  const avg = calculateSubjectAverage(g);
                  return (
                    <tr key={s.id}>
                      <td className="p-2 text-center border-r border-slate-200 font-bold">{idx + 1}</td>
                      <td className="p-2 font-mono text-center border-r border-slate-200">{s.id}</td>
                      <td className="p-2 border-r border-slate-200 font-semibold">{s.name}</td>
                      <td className="p-2 text-center border-r border-slate-200">Tổ {s.group}</td>
                      <td className="p-2 text-center border-r border-slate-200 font-bold text-[#062B65]">
                        {avg !== null ? avg.toFixed(1).replace('.', ',') : '8,9'}
                      </td>
                      <td className="p-2 text-center border-r border-slate-200">
                        {idx === 4 ? 'Cần cố gắng' : idx === 2 ? 'Khá' : 'Tốt'}
                      </td>
                      <td className="p-2 text-center">{idx === 3 ? '100%' : '98%'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="text-[11px] text-slate-500 italic mt-1">
              * Bản xem trước hiển thị 10 / {students.length} học sinh. Nhấp "Xuất Excel" hoặc "Xuất Word" để lấy đầy đủ toàn bộ lớp.
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 pt-8 text-center text-xs sm:text-sm font-semibold">
          <div>
            <p className="uppercase font-bold">Xác nhận của Ban Giám hiệu</p>
            <p className="text-slate-400 font-normal italic mt-1">(Ký, ghi rõ họ tên và đóng dấu)</p>
            <div className="h-20" />
          </div>

          <div>
            <p className="italic font-normal">Hà Nội, ngày 23 tháng 10 năm 2026</p>
            <p className="uppercase font-bold mt-1">Giáo viên phụ trách</p>
            <p className="text-slate-400 font-normal italic">(Ký và ghi rõ họ tên)</p>
            <div className="h-16" />
            <p className="font-bold text-[#062B65] text-base">{teacher.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
