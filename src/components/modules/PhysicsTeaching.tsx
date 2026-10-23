import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSubjectAverage, initialPhysicsTopics } from '../../data/initialData';
import {
  Atom,
  Plus,
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  ListTodo,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface HomeworkItem {
  id: string;
  title: string;
  topic: string;
  deadline: string;
  totalStudents: number;
  submittedCount: number;
  unsubmittedStudentIds: string[];
}

export const PhysicsTeaching: React.FC = () => {
  const { students, grades, showToast, teacher } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>('10A5');
  const [classesList, setClassesList] = useState<string[]>(['10A5', '10A2', '11A1']);
  const [activeSubTab, setActiveSubTab] = useState<'gradebook' | 'topics' | 'homework'>('gradebook');
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  // Sample homework assignments
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([
    {
      id: 'HW-01',
      title: 'Phiếu bài tập số 4: Ba định luật Newton & Lực ma sát',
      topic: 'Cơ học',
      deadline: '2026-10-25',
      totalStudents: 31,
      submittedCount: 23,
      unsubmittedStudentIds: ['HS10A5-03', 'HS10A5-05', 'HS10A5-09', 'HS10A5-13', 'HS10A5-17', 'HS10A5-23', 'HS10A5-25', 'HS10A5-29'],
    },
    {
      id: 'HW-02',
      title: 'Báo cáo thu hoạch Thí nghiệm ảo PhET: Con lắc đơn',
      topic: 'Cơ học',
      deadline: '2026-10-28',
      totalStudents: 31,
      submittedCount: 27,
      unsubmittedStudentIds: ['HS10A5-05', 'HS10A5-17', 'HS10A5-23', 'HS10A5-29'],
    },
    {
      id: 'HW-03',
      title: 'Bài tập trắc nghiệm trực tuyến: Động lượng & Va chạm',
      topic: 'Cơ học',
      deadline: '2026-10-30',
      totalStudents: 31,
      submittedCount: 19,
      unsubmittedStudentIds: ['HS10A5-02', 'HS10A5-03', 'HS10A5-05', 'HS10A5-07', 'HS10A5-09', 'HS10A5-11', 'HS10A5-13', 'HS10A5-15', 'HS10A5-17', 'HS10A5-21', 'HS10A5-23', 'HS10A5-29'],
    },
  ]);

  const [showAddHW, setShowAddHW] = useState(false);
  const [newHWTitle, setNewHWTitle] = useState('');
  const [newHWTopic, setNewHWTopic] = useState('Cơ học');
  const [newHWDeadline, setNewHWDeadline] = useState('2026-11-05');

  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    if (classesList.includes(newClassName.trim())) {
      showToast('Lớp học này đã tồn tại!');
      return;
    }
    setClassesList([...classesList, newClassName.trim()]);
    setSelectedClass(newClassName.trim());
    setNewClassName('');
    setIsAddingClass(false);
    showToast(`Đã thêm lớp dạy: ${newClassName.trim()}`);
  };

  const handleCreateHW = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHWTitle.trim()) return;
    const newHW: HomeworkItem = {
      id: `HW-${Date.now().toString().slice(-4)}`,
      title: newHWTitle,
      topic: newHWTopic,
      deadline: newHWDeadline,
      totalStudents: students.length,
      submittedCount: 0,
      unsubmittedStudentIds: students.map((s) => s.id),
    };
    setHomeworkList([newHW, ...homeworkList]);
    setNewHWTitle('');
    setShowAddHW(false);
    showToast(`Đã giao nhiệm vụ: ${newHW.title}`);
  };

  const toggleStudentSubmission = (hwId: string, studentId: string) => {
    setHomeworkList((prev) =>
      prev.map((hw) => {
        if (hw.id !== hwId) return hw;
        const isCurrentlyUnsubmitted = hw.unsubmittedStudentIds.includes(studentId);
        const updatedIds = isCurrentlyUnsubmitted
          ? hw.unsubmittedStudentIds.filter((id) => id !== studentId)
          : [...hw.unsubmittedStudentIds, studentId];
        return {
          ...hw,
          unsubmittedStudentIds: updatedIds,
          submittedCount: hw.totalStudents - updatedIds.length,
        };
      })
    );
    showToast('Đã cập nhật trạng thái nộp bài!');
  };

  // Grade statistics
  const studentGradesList = students.map((s) => {
    const g = grades[s.id];
    return {
      student: s,
      grade: g,
      avg: calculateSubjectAverage(g),
    };
  });

  const avgScores = studentGradesList
    .map((item) => item.avg)
    .filter((a): a is number => typeof a === 'number');

  const classAvg = avgScores.length
    ? (avgScores.reduce((a, b) => a + b, 0) / avgScores.length).toFixed(1)
    : '8.2';

  const excellentCount = studentGradesList.filter((i) => (i.avg ?? 0) >= 8.0).length;
  const goodCount = studentGradesList.filter((i) => (i.avg ?? 0) >= 6.5 && (i.avg ?? 0) < 8.0).length;
  const passCount = studentGradesList.filter((i) => (i.avg ?? 0) >= 5.0 && (i.avg ?? 0) < 6.5).length;
  const failCount = studentGradesList.filter((i) => (i.avg ?? 0) < 5.0).length;

  const scoreDistribution = [
    { range: 'Giỏi (≥ 8.0)', count: excellentCount, fill: '#159A61' },
    { range: 'Khá (6.5 - 7.9)', count: goodCount, fill: '#0755B8' },
    { range: 'Đạt (5.0 - 6.4)', count: passCount, fill: '#F5A623' },
    { range: 'Chưa đạt (< 5.0)', count: failCount, fill: '#E34B5F' },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar of module */}
      <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0755B8] flex items-center justify-center shadow-sm">
              <Atom className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#062B65]">
                Phân hệ: Dạy học Vật lí THPT
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Quản lý giảng dạy bộ môn theo chương trình GDPT 2018 · GV: {teacher.name}
              </p>
            </div>
          </div>
        </div>

        {/* Class selector & subtabs */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {classesList.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedClass === cls
                    ? 'bg-[#0755B8] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lớp {cls} {cls === '10A5' ? '(CN)' : ''}
              </button>
            ))}
            {isAddingClass ? (
              <div className="flex items-center gap-1 pl-1">
                <input
                  type="text"
                  placeholder="Tên lớp..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-20 px-2 py-1 text-xs border rounded outline-none"
                />
                <button
                  onClick={handleAddClass}
                  className="px-2 py-1 bg-[#159A61] text-white rounded text-xs font-bold"
                >
                  Lưu
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingClass(true)}
                className="p-1.5 text-slate-500 hover:text-[#0755B8]"
                title="Thêm lớp dạy mới"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex items-center border-b border-slate-200 gap-2 sm:gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveSubTab('gradebook')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'gradebook'
              ? 'border-[#0755B8] text-[#0755B8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Theo dõi kết quả & Điểm môn Lí ({selectedClass})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('topics')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'topics'
              ? 'border-[#0755B8] text-[#0755B8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Phân tích kiến thức theo chủ đề</span>
        </button>

        <button
          onClick={() => setActiveSubTab('homework')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'homework'
              ? 'border-[#0755B8] text-[#0755B8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>Theo dõi bài tập & Nhiệm vụ ({homeworkList.length})</span>
        </button>
      </div>

      {/* Subtab 1: Gradebook & Statistics */}
      {activeSubTab === 'gradebook' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold">Điểm TB môn {selectedClass}</span>
              <div className="text-2xl font-bold text-[#062B65] mt-1">{classAvg}</div>
              <div className="text-[11px] text-[#159A61] font-semibold mt-1">▲ 0.4 so với đầu năm</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold">Học sinh Giỏi (≥ 8.0)</span>
              <div className="text-2xl font-bold text-[#159A61] mt-1">{excellentCount} HS</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Chiếm {Math.round((excellentCount / (students.length || 1)) * 100)}% lớp
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold">Học sinh Khá (6.5-7.9)</span>
              <div className="text-2xl font-bold text-[#0755B8] mt-1">{goodCount} HS</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Chiếm {Math.round((goodCount / (students.length || 1)) * 100)}% lớp
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold">Cần phụ đạo / bồi dưỡng</span>
              <div className="text-2xl font-bold text-[#F5A623] mt-1">{passCount + failCount} HS</div>
              <div className="text-[11px] text-[#E34B5F] font-semibold mt-1">Cần hỗ trợ kiến thức Cơ học</div>
            </div>
          </div>

          {/* Score distribution bar chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-[17px] text-[#062B65] mb-3">
              Phổ điểm môn Vật lí lớp {selectedClass} (Học kỳ II - Năm học 2026-2027)
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#475569' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, fontSize: 12, fontFamily: 'Times New Roman' }}
                    formatter={(val: any) => [`${val} học sinh`, 'Số lượng']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student table with TT22 scores */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[16px] text-[#062B65]">
                  Bảng theo dõi điểm chi tiết môn Vật lí - Lớp {selectedClass}
                </h3>
                <p className="text-xs text-slate-500">
                  Công thức tính ĐTBmhk theo Thông tư 22/2021/TT-BGDĐT: ĐTB = (Tổng TX + 2×GK + 3×CK) / (Số điểm TX + 5)
                </p>
              </div>
              <span className="text-xs bg-blue-100 text-[#0755B8] font-bold px-2 py-1 rounded">
                {students.length} học sinh
              </span>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs font-bold text-slate-600 uppercase sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3 text-center">STT</th>
                    <th className="py-2.5 px-3">Mã HS</th>
                    <th className="py-2.5 px-3">Họ và tên</th>
                    <th className="py-2.5 px-2 text-center">TX1</th>
                    <th className="py-2.5 px-2 text-center">TX2</th>
                    <th className="py-2.5 px-2 text-center">TX3</th>
                    <th className="py-2.5 px-2 text-center">TX4</th>
                    <th className="py-2.5 px-2 text-center bg-blue-50/80">GK (x2)</th>
                    <th className="py-2.5 px-2 text-center bg-indigo-50/80">CK (x3)</th>
                    <th className="py-2.5 px-3 text-center bg-[#0755B8] text-white">ĐTB Môn</th>
                    <th className="py-2.5 px-3 text-center">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentGradesList.map((item, idx) => {
                    const avg = item.avg;
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
                        ? 'text-[#159A61]'
                        : rating === 'Khá'
                        ? 'text-[#0755B8]'
                        : rating === 'Đạt'
                        ? 'text-[#F5A623]'
                        : 'text-[#E34B5F]';

                    return (
                      <tr key={item.student.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2 px-3 text-center text-xs font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-mono text-xs text-slate-500">
                          {item.student.id}
                        </td>
                        <td className="py-2 px-3 font-semibold text-[#183153]">
                          {item.student.name}
                        </td>
                        <td className="py-2 px-2 text-center text-xs font-medium">{item.grade?.tx1 ?? '-'}</td>
                        <td className="py-2 px-2 text-center text-xs font-medium">{item.grade?.tx2 ?? '-'}</td>
                        <td className="py-2 px-2 text-center text-xs font-medium">{item.grade?.tx3 ?? '-'}</td>
                        <td className="py-2 px-2 text-center text-xs font-medium">{item.grade?.tx4 ?? '-'}</td>
                        <td className="py-2 px-2 text-center text-xs font-bold text-blue-800 bg-blue-50/40">
                          {item.grade?.gk ?? '-'}
                        </td>
                        <td className="py-2 px-2 text-center text-xs font-bold text-indigo-800 bg-indigo-50/40">
                          {item.grade?.ck ?? '-'}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-[15px] text-[#062B65] bg-blue-50/60">
                          {avg !== null ? avg.toFixed(1).replace('.', ',') : '-'}
                        </td>
                        <td className={`py-2 px-3 text-center text-xs font-bold ${ratingColor}`}>
                          {rating}
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

      {/* Subtab 2: Topic Knowledge Analysis */}
      {activeSubTab === 'topics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {initialPhysicsTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-blue-100 text-[#0755B8] font-bold px-2 py-0.5 rounded">
                      Lớp {topic.gradeLevel}
                    </span>
                    <span className="text-xs font-bold text-[#062B65]">
                      ĐTB: <span className="text-base text-[#1687E8]">{topic.averageScore}</span>/10
                    </span>
                  </div>

                  <h4 className="font-bold text-lg text-[#062B65]">{topic.name}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {topic.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1 text-[#E34B5F]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Nội dung học sinh còn yếu:</span>
                    </div>
                    <ul className="space-y-1">
                      {topic.weakPoints.map((point, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <span className="text-[#E34B5F] mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Chương trình GDPT 2018</span>
                  <button
                    onClick={() => showToast(`Mở chuyên đề ôn tập cho chủ đề: ${topic.name}`)}
                    className="text-[#0755B8] font-bold hover:underline"
                  >
                    Xem bài tập chuyên đề →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Homework & Assignments */}
      {activeSubTab === 'homework' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#062B65]">
                Quản lý giao bài tập & Theo dõi nộp bài
              </h3>
              <p className="text-xs text-slate-500">
                Ghi nhận tiến độ làm bài tập, nhắc nhở học sinh nộp đúng hạn
              </p>
            </div>
            <button
              onClick={() => setShowAddHW(!showAddHW)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0755B8] hover:bg-[#062B65] text-white text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Giao nhiệm vụ mới</span>
            </button>
          </div>

          {/* Add HW Modal/Form */}
          {showAddHW && (
            <form
              onSubmit={handleCreateHW}
              className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 space-y-3"
            >
              <h4 className="font-bold text-sm text-[#062B65]">Tạo nhiệm vụ học tập mới</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Tên nhiệm vụ / bài tập:</label>
                  <input
                    type="text"
                    required
                    value={newHWTitle}
                    onChange={(e) => setNewHWTitle(e.target.value)}
                    placeholder="VD: Bài tập ôn định luật bảo toàn cơ năng..."
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Chủ đề:</label>
                  <select
                    value={newHWTopic}
                    onChange={(e) => setNewHWTopic(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="Cơ học">Cơ học</option>
                    <option value="Nhiệt học">Nhiệt học</option>
                    <option value="Điện học">Điện học</option>
                    <option value="Quang học">Quang học</option>
                    <option value="Vật lí hiện đại">Vật lí hiện đại</option>
                    <option value="Tổng hợp">Tổng hợp</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Thời hạn hoàn thành:</label>
                  <input
                    type="date"
                    value={newHWDeadline}
                    onChange={(e) => setNewHWDeadline(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHW(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-[#0755B8] rounded-lg font-bold"
                >
                  Lưu & Giao cho lớp
                </button>
              </div>
            </form>
          )}

          {/* List of assignments */}
          <div className="space-y-4">
            {homeworkList.map((hw) => {
              const unsubmittedStudents = students.filter((s) =>
                hw.unsubmittedStudentIds.includes(s.id)
              );
              const percent = Math.round((hw.submittedCount / hw.totalStudents) * 100);

              return (
                <div
                  key={hw.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-[#0755B8] font-bold px-2 py-0.5 rounded">
                          {hw.topic}
                        </span>
                        <span className="text-xs text-slate-400">Mã: {hw.id}</span>
                      </div>
                      <h4 className="font-bold text-[17px] text-[#062B65] mt-1">{hw.title}</h4>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Hạn nộp: {hw.deadline}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-[#062B65]">
                        Đã nộp: <span className="text-[#159A61]">{hw.submittedCount}</span>/{hw.totalStudents} ({percent}%)
                      </div>
                      <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5 ml-auto">
                        <div
                          className="bg-[#159A61] h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* List of unsubmitted students with 1-click toggle */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                      <span className="text-[#E34B5F] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Học sinh chưa hoàn thành ({unsubmittedStudents.length}):</span>
                      </span>
                      <span className="text-slate-400 font-normal">Nhấp vào học sinh để chuyển thành ĐÃ NỘP</span>
                    </div>

                    {unsubmittedStudents.length === 0 ? (
                      <div className="text-xs text-[#159A61] font-semibold flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>Toàn bộ 31 học sinh đã nộp bài đầy đủ!</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {unsubmittedStudents.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => toggleStudentSubmission(hw.id, s.id)}
                            className="text-xs bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-medium flex items-center gap-1.5 transition-all"
                            title="Nhấp để ghi nhận Đã nộp bài"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#E34B5F]" />
                            <span>{s.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
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
