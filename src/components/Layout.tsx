import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Smartphone,
  MessagesSquare,
  Settings,
  Menu,
  ChevronRight,
  BookOpen,
  Sun,
  Moon,
} from 'lucide-react';
import Logo from '../assets/Logo.png';

import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sessions', icon: Smartphone, label: 'Sessions' },
  { to: '/chats', icon: MessagesSquare, label: 'Chats' },
  { to: '/api-docs', icon: BookOpen, label: 'API Docs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen bg-app-bg">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64
          bg-app-surface border-r border-app-border
          flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-app-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-[#25D366]/20">
              <img src={Logo} alt="RelayX Logo" className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = to === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-[#25D366]/10 text-[#25D366]'
                    : 'text-app-text-secondary hover:text-app-text hover:bg-app-surface-hover'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#25D366]' : 'text-app-text-muted group-hover:text-app-text'}`} />
                {label}
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer with theme toggle */}
        <div className="p-4 border-t border-app-border space-y-3">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs text-app-text-muted">RelayX Platform</span>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text-secondary hover:text-app-text hover:border-app-border-hover transition-all text-xs"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <><Sun className="w-4 h-4" /> Light Mode</>
            ) : (
              <><Moon className="w-4 h-4" /> Dark Mode</>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-app-border bg-app-surface">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-app-surface-hover text-app-text-secondary"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-app-text font-semibold text-sm">RelayX Dashboard</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
