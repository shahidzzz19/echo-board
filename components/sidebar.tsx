'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, TrendingUp, Heart, Settings, User, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { updatePreferences } from '@/lib/slices/userSlice';

interface SidebarProps {
  activeSection: 'feed' | 'trending' | 'favorites' | 'search';
  onSectionChange: (section: 'feed' | 'trending' | 'favorites' | 'search') => void;
  onOpenPreferences: () => void;
}

export function Sidebar({ activeSection, onSectionChange, onOpenPreferences }: SidebarProps) {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();
  const favorites = useAppSelector((state) => state.user.favorites);

  const menuItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favorites.length },
  ];

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    dispatch(updatePreferences({ darkMode: newTheme === 'dark' }));
  };

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-card border-r border-border flex flex-col fixed lg:relative z-50 lg:z-auto h-full lg:h-auto"
    >
      <div className="p-4 lg:p-6 border-b border-border">
        <h1 className="text-lg lg:text-xl font-bold text-foreground">EchoBoard</h1>
        <p className="text-xs lg:text-sm text-muted-foreground">Personalized Dashboard</p>
      </div>

      <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? 'default' : 'ghost'}
            className="w-full justify-start text-sm lg:text-base h-9 lg:h-10"
            onClick={() => onSectionChange(item.id as any)}
          >
            <item.icon className="mr-2 lg:mr-3 h-4 w-4" />
            <span className="truncate">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-1.5 lg:px-2 py-0.5 lg:py-1 min-w-[1.25rem] text-center">
                {item.badge}
              </span>
            )}
          </Button>
        ))}
      </nav>

      <div className="p-3 lg:p-4 border-t border-border space-y-1 lg:space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm lg:text-base h-9 lg:h-10"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="mr-2 lg:mr-3 h-4 w-4" />
          ) : (
            <Moon className="mr-2 lg:mr-3 h-4 w-4" />
          )}
          <span className="truncate">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-sm lg:text-base h-9 lg:h-10"
          onClick={onOpenPreferences}
        >
          <Settings className="mr-2 lg:mr-3 h-4 w-4" />
          <span className="truncate">Preferences</span>
        </Button>

        <Button variant="ghost" className="w-full justify-start text-sm lg:text-base h-9 lg:h-10">
          <User className="mr-2 lg:mr-3 h-4 w-4" />
          <span className="truncate">Profile</span>
        </Button>
      </div>
    </motion.aside>
  );
}
