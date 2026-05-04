import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Moon, Sun, Bell, User, LogOut, Menu } from 'lucide-react';

export function Header({ onOpenMenu }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMenu}>
          <Menu size={20} />
        </Button>
        <h1 className="text-xl font-bold font-heading md:hidden truncate max-w-[150px]">Financeiro Pro</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        <div className="h-8 w-px bg-border mx-1 md:mx-2" />
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 px-1 md:px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <User size={18} />
            </div>
            <span className="text-sm font-medium hidden lg:inline-block max-w-[100px] truncate">{user?.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}
