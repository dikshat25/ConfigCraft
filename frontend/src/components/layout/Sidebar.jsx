import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useT } from '../../hooks/useT';
import { Home, Settings, UploadCloud, FileJson, LogOut } from 'lucide-react';

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const t = useT();
  const location = useLocation();

  return (
    <div className="w-[240px] bg-bg-secondary border-r border-border-subtle h-screen sticky top-0 flex flex-col">
      {/* Logo Area */}
      <div className="h-[60px] px-5 border-b border-border-subtle flex items-center gap-[10px]">
        <div className="w-[26px] h-[26px] rounded-sm bg-accent-emerald flex flex-wrap items-center justify-center p-[5px] gap-[2px]">
          <div className="w-[5px] h-[5px] bg-black rounded-sm"></div>
          <div className="w-[5px] h-[5px] bg-black rounded-sm"></div>
          <div className="w-[5px] h-[5px] bg-black rounded-sm"></div>
          <div className="w-[5px] h-[5px] bg-black rounded-sm"></div>
        </div>
        <span className="font-syne font-bold text-[17px] text-text-primary tracking-tight">ConfigCraft</span>
        <div className="w-2 h-2 rounded-full bg-accent-emerald shadow-[0_0_8px_var(--emerald)] ml-auto"></div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-[2px] overflow-y-auto">
        <NavLink to="/dashboard" icon={<Home size={18} />} label={t('dashboard')} currentPath={location.pathname} />
        <NavLink to="/configs/new" icon={<FileJson size={18} />} label={t('newApp')} currentPath={location.pathname} />
        <NavLink to="/csv-import" icon={<UploadCloud size={18} />} label={t('importCSV')} currentPath={location.pathname} />
      </nav>

      {/* Bottom Items */}
      <div className="mt-auto p-3 border-t border-border-subtle space-y-[2px]">
        <NavLink to="/settings" icon={<Settings size={18} />} label={t('settings')} currentPath={location.pathname} />
        <button 
          onClick={logout}
          className="w-full flex items-center gap-[10px] px-3 py-[9px] rounded-sm text-[14px] text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-200"
        >
          <LogOut size={18} />
          {t('logout')}
        </button>
      </div>
    </div>
  );
}

function NavLink({ to, icon, label, currentPath }) {
  const isActive = currentPath === to || (currentPath.startsWith('/apps/') && to === '/dashboard');
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-[10px] px-3 py-[9px] transition-all duration-200 text-[14px] mb-[2px]
        ${isActive 
          ? 'bg-emerald-glow text-accent-emerald border-l-2 border-accent-emerald rounded-r-sm font-medium' 
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-sm border-l-2 border-transparent font-normal'}`}
    >
      {icon}
      {label}
    </Link>
  );
}
