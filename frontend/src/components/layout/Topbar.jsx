import React from 'react';
import { useLocale } from '../../hooks/useLocale';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useT } from '../../hooks/useT';

export default function Topbar() {
  const { locale, toggleLocale } = useLocale();
  const { theme, toggleTheme } = useThemeStore();
  const user = useAuthStore(state => state.user);
  const location = useLocation();
  const t = useT();

  // Simple mapping of paths to titles
  const getPageTitle = () => {
    if (location.pathname.startsWith('/dashboard')) return t('dashboard');
    if (location.pathname.startsWith('/configs/new')) return t('newApp');
    if (location.pathname.startsWith('/csv-import')) return t('importCSV');
    if (location.pathname.startsWith('/settings')) return t('settings');
    if (location.pathname.startsWith('/apps/')) return 'Live App';
    return 'ConfigCraft';
  };

  return (
    <div className="h-[60px] bg-bg-primary/85 backdrop-blur-[20px] border-b border-border-subtle sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="font-syne text-[16px] font-bold text-text-primary">
        {getPageTitle()}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <button 
          onClick={toggleLocale}
          className="bg-bg-tertiary border border-border-emphasis px-3 py-1.5 rounded-sm text-[13px] text-text-secondary cursor-pointer hover:bg-surface3 transition-colors duration-200"
          title="Toggle Language"
        >
          {locale === 'en' ? 'EN' : 'हि'}
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="w-[32px] h-[32px] bg-bg-tertiary border border-border-emphasis rounded-sm cursor-pointer hover:bg-surface3 transition-colors duration-200 flex items-center justify-center text-text-secondary"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Avatar */}
        {user && (
          <div className="w-[32px] h-[32px] bg-gradient-to-br from-accent-emerald to-[#00A86B] rounded-full font-syne text-[13px] font-bold text-black flex items-center justify-center ring-[2px] ring-[rgba(0,217,126,0.3)] hover:ring-[rgba(0,217,126,0.6)] transition-all cursor-pointer shadow-[0_0_8px_var(--emerald-glow)] ml-1">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
