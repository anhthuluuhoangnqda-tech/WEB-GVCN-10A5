import React from 'react';
import { useApp } from '../../context/AppContext';
import { TabId } from '../../types';
import {
  LayoutDashboard,
  Atom,
  Users,
  Contact,
  BarChart3,
  CalendarCheck2,
  FolderOpen,
  Bot,
  FileSpreadsheet,
  Settings,
  Flame,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { activeTab, setActiveTab } = useApp();

  const menuItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Tổng quan', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { id: 'physics_teaching', label: 'Dạy học Vật lí', icon: <Atom className="w-5 h-5 shrink-0" /> },
    { id: 'homeroom_10a5', label: 'Chủ nhiệm 10A5', icon: <Users className="w-5 h-5 shrink-0" /> },
    { id: 'students', label: 'Hồ sơ học sinh', icon: <Contact className="w-5 h-5 shrink-0" /> },
    { id: 'grades', label: 'Quản lý điểm', icon: <BarChart3 className="w-5 h-5 shrink-0" /> },
    { id: 'attendance', label: 'Chuyên cần & Rèn luyện', icon: <CalendarCheck2 className="w-5 h-5 shrink-0" /> },
    { id: 'materials', label: 'Kho học liệu Vật lí', icon: <FolderOpen className="w-5 h-5 shrink-0" /> },
    { id: 'ai_assistant', label: 'Trợ lý AI', icon: <Bot className="w-5 h-5 shrink-0" /> },
    { id: 'reports', label: 'Báo cáo & Xuất dữ liệu', icon: <FileSpreadsheet className="w-5 h-5 shrink-0" /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  return (
    <aside
      className={`bg-[#062B65] text-white flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none border-r border-[#0A3D8F]/60 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top brand header */}
      <div>
        <div className="p-4 border-b border-[#0A3D8F]/80 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#F5A623] to-[#FFD572] flex items-center justify-center text-[#062B65] shadow-lg shadow-[#F5A623]/20">
                <Flame className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide text-white leading-tight">
                  NGÔ QUYỀN
                </h1>
                <p className="text-[11px] text-blue-200 uppercase tracking-widest font-medium">
                  Tri thức · Nhân cách · Vươn xa
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F5A623] to-[#FFD572] flex items-center justify-center text-[#062B65] shadow-md">
              <Flame className="w-6 h-6 stroke-[2.5]" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-[#0755B8] transition-colors"
            title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5 mt-2 overflow-y-auto max-h-[calc(100vh-280px)]">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1687E8] to-[#0755B8] text-white shadow-md shadow-[#1687E8]/30 font-semibold'
                    : 'text-blue-100/85 hover:bg-[#0755B8]/40 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}
                {item.id === 'ai_assistant' && !isCollapsed && (
                  <span className="ml-auto text-[10px] bg-[#29C5E8] text-[#062B65] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom pedagogical quote card */}
      {!isCollapsed ? (
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-[#0A3D8F]/50 to-[#041D44]/90 border border-blue-400/20 text-center relative overflow-hidden shadow-inner">
          <div className="absolute -right-3 -bottom-3 opacity-15 pointer-events-none">
            <BookOpen className="w-24 h-24 text-blue-200" />
          </div>
          <p className="text-[13px] text-blue-100 italic leading-relaxed">
            “Giáo dục không phải là đổ đầy một chiếc bình, mà là thắp sáng một ngọn lửa.”
          </p>
          <div className="mt-2 text-[12px] font-semibold text-blue-300">
            — William Butler Yeats —
          </div>
          <div className="mt-2 pt-2 border-t border-blue-400/15 flex items-center justify-center gap-1.5 text-[11px] text-blue-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#159A61]" />
            Năm học 2026 - 2027
          </div>
        </div>
      ) : (
        <div className="p-3 text-center text-xs text-blue-300/80 border-t border-[#0A3D8F]/80">
          10A5
        </div>
      )}
    </aside>
  );
};
