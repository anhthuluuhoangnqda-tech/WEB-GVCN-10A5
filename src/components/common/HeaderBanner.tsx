import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Quote,
  Sparkles,
  BookOpen,
  UserPlus,
  Edit3,
  CalendarCheck,
  Bot,
  FileSpreadsheet,
} from 'lucide-react';

interface HeaderBannerProps {
  onOpenAddStudent: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ onOpenAddStudent }) => {
  const { teacher, setActiveTab } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-[#1687E8]/25 shadow-sm p-4 sm:p-6 mb-6 relative overflow-hidden">
      {/* Background soft glow and grid */}
      <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-[#29C5E8]/10 via-[#1687E8]/5 to-transparent pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left: Teacher Portrait & Welcome Message */}
        <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto">
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-[#0755B8] via-[#1687E8] to-[#29C5E8] shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <img
                  src={teacher.avatarUrl}
                  alt={teacher.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230755B8"/><text x="50" y="58" font-size="32" text-anchor="middle" fill="white" font-family="Times New Roman">LAT</text></svg>';
                  }}
                />
              </div>
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#159A61] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" title="Trạng thái trực tuyến">
              ✓
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#062B65] leading-tight flex items-center gap-2">
              <span>Xin chào, Giáo viên {teacher.name} !</span>
            </h2>
            <p className="text-sm sm:text-[16px] font-semibold text-[#0755B8]">
              {teacher.title}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 italic max-w-xl leading-relaxed">
              Cùng đồng hành, truyền cảm hứng và kiến tạo những thế hệ học sinh Ngô Quyền bản lĩnh, nhân văn, vươn xa!
            </p>
          </div>
        </div>

        {/* Right: Inspirational Physics Quote & Quick actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-blue-100 pt-4 lg:pt-0 lg:pl-6">
          <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 p-3.5 rounded-xl border border-blue-100/80 max-w-md">
            <Quote className="w-8 h-8 text-[#1687E8] shrink-0 opacity-70 mt-0.5" />
            <div>
              <p className="text-sm sm:text-[15px] font-semibold text-[#062B65] italic leading-snug">
                “Vật lí giúp ta hiểu thế giới và giáo dục giúp ta thay đổi thế giới.”
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-blue-600 font-medium">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Khoa học tự nhiên · Khám phá & Sáng tạo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center flex-wrap gap-2.5 sm:gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          Thao tác nhanh:
        </span>
        <button
          onClick={onOpenAddStudent}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0755B8] hover:bg-[#062B65] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm học sinh</span>
        </button>

        <button
          onClick={() => setActiveTab('grades')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-blue-200 text-[#0755B8] text-xs sm:text-sm font-semibold transition-all shadow-sm"
        >
          <Edit3 className="w-4 h-4" />
          <span>Nhập điểm</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-blue-200 text-[#0755B8] text-xs sm:text-sm font-semibold transition-all shadow-sm"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Điểm danh</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_assistant')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#1687E8] to-[#29C5E8] hover:opacity-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
        >
          <Bot className="w-4 h-4" />
          <span>Mở Trợ lý AI</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-blue-200 text-[#0755B8] text-xs sm:text-sm font-semibold transition-all shadow-sm ml-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Tạo báo cáo</span>
        </button>
      </div>
    </div>
  );
};
