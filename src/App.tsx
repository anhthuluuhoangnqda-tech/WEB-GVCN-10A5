/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HeaderBanner } from './components/common/HeaderBanner';
import { OverviewDashboard } from './components/modules/OverviewDashboard';
import { PhysicsTeaching } from './components/modules/PhysicsTeaching';
import { HomeroomClass } from './components/modules/HomeroomClass';
import { StudentProfiles } from './components/modules/StudentProfiles';
import { GradeManagement } from './components/modules/GradeManagement';
import { AttendanceConduct } from './components/modules/AttendanceConduct';
import { PhysicsMaterials } from './components/modules/PhysicsMaterials';
import { AIAssistant } from './components/modules/AIAssistant';
import { ReportsExport } from './components/modules/ReportsExport';
import { SettingsModule } from './components/modules/SettingsModule';
import { AddStudentModal } from './components/modals/AddStudentModal';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

function MainApp() {
  const { activeTab, quickToast } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  // Render appropriate module
  const renderCurrentModule = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'physics_teaching':
        return <PhysicsTeaching />;
      case 'homeroom_10a5':
        return <HomeroomClass />;
      case 'students':
        return <StudentProfiles />;
      case 'grades':
        return <GradeManagement />;
      case 'attendance':
        return <AttendanceConduct />;
      case 'materials':
        return <PhysicsMaterials />;
      case 'ai_assistant':
        return <AIAssistant />;
      case 'reports':
        return <ReportsExport />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F8FF] text-[#183153]">
      {/* Desktop & Tablet Sidebar */}
      <div className="hidden lg:flex shrink-0 h-full">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-xs bg-[#062B65] text-white z-10 h-full shadow-2xl">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              isCollapsed={false}
              setIsCollapsed={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 max-w-[1720px] w-full mx-auto">
          {/* Welcome Banner of Teacher Thư */}
          <HeaderBanner onOpenAddStudent={() => setIsAddStudentOpen(true)} />

          {/* Active Module Screen */}
          <div className="pb-12">{renderCurrentModule()}</div>
        </main>
      </div>

      {/* Add Student Modal from Header Banner */}
      {isAddStudentOpen && (
        <AddStudentModal onClose={() => setIsAddStudentOpen(false)} />
      )}

      {/* Global Toast Alert */}
      {quickToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#062B65] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#29C5E8]/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-6 h-6 rounded-full bg-[#159A61] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide">
            {quickToast}
          </span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
