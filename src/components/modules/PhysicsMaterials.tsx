import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LearningMaterial } from '../../types';
import {
  FolderOpen,
  Plus,
  Search,
  Download,
  Trash2,
  ExternalLink,
  BookOpen,
  FileText,
  Video,
  FileCheck,
  FileQuestion,
  Layers,
} from 'lucide-react';

export const PhysicsMaterials: React.FC = () => {
  const { materials, addMaterial, deleteMaterial, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [gradeLevel, setGradeLevel] = useState<10 | 11 | 12>(10);
  const [topic, setTopic] = useState('Cơ học');
  const [category, setCategory] = useState<LearningMaterial['category']>('Bài giảng');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState<LearningMaterial['fileType']>('pdf');
  const [url, setUrl] = useState('');

  const categories: LearningMaterial['category'][] = [
    'Bài giảng',
    'Giáo án',
    'Slide PowerPoint',
    'Video thí nghiệm',
    'Mô phỏng Vật lí',
    'Phiếu học tập',
    'Đề kiểm tra',
    'Đề ôn tập',
    'Đáp án & Hướng dẫn chấm',
  ];

  // Filter
  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.topic.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesGrade = selectedGrade === 'all' || m.gradeLevel === selectedGrade;
    return matchesSearch && matchesCategory && matchesGrade;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMaterial({
      title,
      gradeLevel,
      topic,
      category,
      description,
      fileType,
      fileSize: '1.5 MB',
      url: url || '#',
    });

    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const handleDownload = (mat: LearningMaterial) => {
    if (mat.url && mat.url.startsWith('http')) {
      window.open(mat.url, '_blank');
      return;
    }
    // Generate text/markdown file for immediate practical download
    const content = `# THPT NGÔ QUYỀN - ĐÔNG ANH\n## KHO HỌC LIỆU VẬT LÍ\n\nTài liệu: ${mat.title}\nKhối lớp: ${mat.gradeLevel}\nChủ đề: ${mat.topic}\nPhân loại: ${mat.category}\nNgày phát hành: ${mat.dateAdded}\n\nMô tả chi tiết:\n${mat.description}\n\nNội dung bài học được biên soạn chuẩn theo Chương trình Giáo dục Phổ thông 2018 bởi Cô Lưu Hoàng Anh Thư.\n`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${mat.title.replace(/\s+/g, '_')}.${mat.fileType === 'pdf' ? 'txt' : mat.fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đang tải tài liệu: ${mat.title}`);
  };

  const getCategoryIcon = (cat: LearningMaterial['category']) => {
    switch (cat) {
      case 'Bài giảng':
      case 'Giáo án':
      case 'Slide PowerPoint':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'Video thí nghiệm':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'Mô phỏng Vật lí':
        return <Layers className="w-5 h-5 text-cyan-600" />;
      case 'Phiếu học tập':
        return <FileCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileQuestion className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#062B65] to-[#1687E8] text-white flex items-center justify-center shadow-md">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#062B65]">
                Phân hệ: Kho Học Liệu Vật Lí THPT
              </h2>
              <span className="text-xs bg-blue-100 text-[#0755B8] font-bold px-2 py-0.5 rounded-full">
                {materials.length} tài liệu
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Thư viện giáo án 5512, bài giảng điện tử, video thí nghiệm thực hành và ngân hàng đề thi
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0755B8] hover:bg-[#062B65] text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm học liệu mới</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên học liệu, chủ đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 text-xs sm:text-sm border border-slate-200 rounded-xl outline-none focus:border-[#0755B8]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value) as any)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none bg-white font-medium text-slate-700"
          >
            <option value="all">Tất cả khối lớp</option>
            <option value={10}>Vật lí 10 (Chính)</option>
            <option value={11}>Vật lí 11</option>
            <option value={12}>Vật lí 12</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none bg-white font-medium text-slate-700 max-w-[200px]"
          >
            <option value="all">Tất cả 9 nhóm học liệu</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full space-y-4"
          >
            <h3 className="font-bold text-lg text-[#062B65]">Thêm học liệu Vật lí mới</h3>

            <div>
              <label className="text-xs font-bold text-slate-700">Tên học liệu / Tài liệu *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Bài giảng Động học chất điểm..."
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Khối lớp</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(Number(e.target.value) as any)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                >
                  <option value={10}>Vật lí 10</option>
                  <option value={11}>Vật lí 11</option>
                  <option value={12}>Vật lí 12</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Loại tài liệu</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Chủ đề kiến thức</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Định dạng tệp</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                >
                  <option value="pdf">PDF (.pdf)</option>
                  <option value="docx">Word (.docx)</option>
                  <option value="pptx">PowerPoint (.pptx)</option>
                  <option value="mp4">Video (.mp4)</option>
                  <option value="sim">Mô phỏng PhET / Web</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Mô tả tóm tắt nội dung</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Yêu cầu cần đạt, phương pháp giảng dạy..."
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0755B8] text-white text-xs font-bold rounded-xl"
              >
                Lưu vào kho học liệu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {getCategoryIcon(mat.category)}
                  <span className="text-xs font-bold text-[#0755B8]">{mat.category}</span>
                </div>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Lớp {mat.gradeLevel} · {mat.topic}
                </span>
              </div>

              <h4 className="font-bold text-base text-[#062B65] leading-snug">
                {mat.title}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {mat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                <span>{mat.fileSize || 'Tệp đính kèm'}</span> · <span>{mat.dateAdded}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDownload(mat)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0755B8] text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải về</span>
                </button>
                <button
                  onClick={() => deleteMaterial(mat.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Xóa tài liệu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
