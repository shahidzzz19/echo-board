'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { ContentFeed } from './content-feed';
import { TrendingSection } from './trending-section';
import { FavoritesSection } from './favorites-section';
import { SearchResults } from './search-results';
import { UserPreferencesModal } from './user-preferences-modal';
import { useAppSelector } from '@/lib/hooks';

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<'feed' | 'trending' | 'favorites' | 'search'>(
    'feed',
  );
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const searchQuery = useAppSelector((state) => state.search.query);

  const renderContent = () => {
    if (searchQuery.trim()) return <SearchResults />;

    switch (activeSection) {
      case 'trending':
        return <TrendingSection />;
      case 'favorites':
        return <FavoritesSection />;
      default:
        return <ContentFeed />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Mobile backdrop */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                      lg:translate-x-0 transition-transform duration-300 
                      ease-in-out fixed lg:relative z-50`}
        >
          <Sidebar
            activeSection={activeSection}
            onSectionChange={(section) => {
              setActiveSection(section);
              setIsMobileSidebarOpen(false);
            }}
            onOpenPreferences={() => setIsPreferencesOpen(true)}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header
            onOpenPreferences={() => setIsPreferencesOpen(true)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />

          <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>

        <UserPreferencesModal
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
        />
      </div>
    </DndProvider>
  );
}
