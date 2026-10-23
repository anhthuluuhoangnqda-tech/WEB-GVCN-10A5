import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Clock,
  Calendar,
  Atom,
  CheckCircle2,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { teacher, searchQuery, setSearchQuery, notifications, markNotificationRead, setActiveTab, setSelectedStudentId, students } = useApp();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Real-time clock update (Asia/Ho_Chi_Minh)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date in Vietnamese
  const vietnameseDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = vietnameseDays[currentTime.getDay()];
  const dateFormatted = `${dayName}, ${currentTime.getDate().toString().padStart(2, '0')}/${(currentTime.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${currentTime.getFullYear()}`;
  const timeFormatted = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`;

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter students for quick search dropdown
  const filteredStudents = searchQuery.trim()
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="bg-gradient-to-r from-[#062B65] via-[#0755B8] to-[#1687E8] text-white shadow-lg border-b border-[#29C5E8]/30 relative overflow-hidden">
      {/* Subtle school & physics architectural background accents */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute right-1/3 -top-12 w-64 h-64 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '60s' }} />
        <div className="absolute right-1/4 -bottom-16 w-80 h-80 rounded-full border-2 border-dashed border-white/15" />
      </div>

      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 py-3 flex flex-col lg:flex-row items-center justify-between gap-3 relative z-10">
        {/* Left: School brand & system title */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            title="Mở menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md items-center justify-center border border-white/20 text-[#29C5E8] shadow-inner">
              <Atom className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase drop-shadow-sm">
                  NGÔ QUYỀN EDU – SMART CLASS
                </h1>
              </div>
              <p className="text-sm sm:text-[15px] font-semibold text-blue-100 flex items-center gap-2">
                <span>{teacher.school}</span>
                <span className="hidden md:inline text-blue-300">|</span>
                <span className="hidden md:inline italic font-normal text-blue-200">
                  Kiến thức hôm nay – Kiến tạo ngày mai
                </span>
              </p>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-white/10 text-white"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E34B5F] text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center / Right: Search, Notifications, Teacher Info, Real-time Clock */}
        <div className="flex items-center flex-wrap lg:flex-nowrap gap-3 sm:gap-4 w-full lg:w-auto justify-end">
          {/* Search bar */}
          <div className="relative w-full sm:w-64 lg:w-72">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm học sinh, điểm..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(Boolean(e.target.value.trim()));
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setShowSearchResults(true);
                }}
                className="w-full bg-white/15 hover:bg-white/20 focus:bg-white text-white focus:text-[#183153] placeholder-blue-200 focus:placeholder-slate-400 text-sm px-3.5 py-1.5 pl-9 rounded-full border border-white/25 focus:border-[#29C5E8] outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 absolute left-3 text-blue-200 pointer-events-none" />
            </div>

            {/* Quick search dropdown */}
            {showSearchResults && filteredStudents.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white text-[#183153] rounded-xl shadow-2xl border border-blue-100 max-h-60 overflow-y-auto z-50 p-2">
                <div className="text-[12px] font-semibold text-slate-400 px-2 py-1 uppercase">
                  Kết quả tìm kiếm ({filteredStudents.length})
                </div>
                {filteredStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedStudentId(s.id);
                      setActiveTab('students');
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 flex items-center justify-between text-sm transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-[#062B65]">{s.name}</div>
                      <div className="text-xs text-slate-500">Mã: {s.id} · Tổ {s.group}</div>
                    </div>
                    <span className="text-xs bg-blue-100 text-[#0755B8] px-2 py-0.5 rounded-full font-medium">
                      Xem hồ sơ
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification dropdown */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 shadow-sm"
              title="Thông báo hệ thống"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E34B5F] text-white text-[11px] rounded-full flex items-center justify-center font-bold shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-[#183153] rounded-2xl shadow-2xl border border-blue-100 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-[#062B65]">Thông báo ({unreadCount})</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Đóng
                  </button>
                </div>
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                        n.read ? 'bg-slate-50 text-slate-600' : 'bg-blue-50/70 border border-blue-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#062B65]">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.date}</span>
                      </div>
                      <p className="mt-1 text-slate-600 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Teacher avatar & name block */}
          <div
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 cursor-pointer transition-all"
            title="Xem & sửa thông tin giáo viên"
          >
            <div className="relative">
              <img
                src={teacher.avatarUrl}
                alt={teacher.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border-2 border-white/80 shadow"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#159A61] border border-white" />
            </div>
            <div className="text-left">
              <div className="text-xs text-blue-200">
                Giáo viên: <span className="text-white font-bold">{teacher.name}</span>
              </div>
              <div className="text-[11px] text-blue-100 font-medium">
                {teacher.title}
              </div>
            </div>
          </div>

          {/* Real-time Vietnamese Clock Widget */}
          <div className="hidden xl:flex flex-col items-end px-3 py-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-right">
            <div className="flex items-center gap-1.5 text-xs text-blue-100 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#29C5E8]" />
              <span>{dateFormatted}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-white tracking-widest font-mono">
              <Clock className="w-3.5 h-3.5 text-[#29C5E8]" />
              <span>{timeFormatted}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
