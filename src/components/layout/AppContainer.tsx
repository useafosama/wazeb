'use client';

import React from 'react';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';
import DesktopSummaryPanel from './DesktopSummaryPanel';
import AddHabitSheet from '../modals/AddHabitSheet';
import HabitDetailsModal from '../modals/HabitDetailsModal';
import FailureReasonModal from '../modals/FailureReasonModal';
import QuickCompleteModal from '../modals/QuickCompleteModal';
import AchievementUnlockToast from '../achievements/AchievementUnlockToast';

interface AppContainerProps {
  children: React.ReactNode;
  showNav?: boolean;
  showSummaryPanel?: boolean;
}

export default function AppContainer({ children, showNav = true, showSummaryPanel = true }: AppContainerProps) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex justify-center selection:bg-muted selection:text-foreground">
      {/* Responsive Shell */}
      <div className="w-full max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1520px] min-h-screen flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-6 pb-28 lg:pb-6">
        {/* Desktop Sidebar (>=1024px) */}
        {showNav && <DesktopSidebar />}

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 flex flex-col">
          {children}
        </main>

        {/* Right Summary Panel on Wide Desktop (>=1280px) */}
        {showSummaryPanel && <DesktopSummaryPanel />}

        {/* Mobile / Tablet Bottom Nav (<1024px) */}
        {showNav && <BottomNav />}

        {/* Global Modals */}
        <AddHabitSheet />
        <HabitDetailsModal />
        <FailureReasonModal />
        <QuickCompleteModal />
        <AchievementUnlockToast />
      </div>
    </div>
  );
}
