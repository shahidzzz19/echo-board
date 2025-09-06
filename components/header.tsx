'use client';

import type React from 'react';

import { useState, useCallback } from 'react';
import { Search, Settings, Bell, User, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setQuery } from '@/lib/slices/searchSlice';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface HeaderProps {
  onOpenPreferences: () => void;
  onToggleMobileSidebar?: () => void;
}

export function Header({ onOpenPreferences, onToggleMobileSidebar }: HeaderProps) {
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState('');
  const profile = useAppSelector((state) => state.user.profile);

  // Debounced search
  const debouncedSearch = useCallback(
    useDebounce((query: string) => {
      dispatch(setQuery(query));
    }, 300),
    [dispatch],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  return (
    <header className="h-14 sm:h-16 border-b border-border bg-card px-3 sm:px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-md">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="relative w-full">
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
          <Input
            placeholder="Search content..."
            value={searchInput}
            onChange={handleSearchChange}
            className="pl-8 sm:pl-10 pr-3 sm:pr-4 h-8 sm:h-10 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
          <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenPreferences}
          className="h-8 w-8 sm:h-9 sm:w-9"
        >
          <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
          <AvatarImage src={profile?.avatar || '/placeholder.svg'} />
          <AvatarFallback>
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
