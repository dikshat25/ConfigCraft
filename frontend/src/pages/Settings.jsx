import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useLocale } from '../hooks/useLocale';
import { useT } from '../hooks/useT';

export default function Settings() {
  const { user, logout } = useAuthStore();
  const { locale, setLocale } = useLocale();
  const t = useT();

  return (
    <div className="p-[32px_48px] max-w-screen-xl mx-auto w-full">
      <div className="flex items-center justify-between mb-[32px]">
        <div>
          <h1 className="font-syne text-[28px] font-extrabold text-text-primary tracking-[-1px] leading-[1.1]">{t('settings')}</h1>
          <p className="text-[14px] text-text-secondary mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-[800px]">
        
        {/* PROFILE SECTION */}
        <div className="bg-bg-secondary border border-border-subtle rounded-lg p-[28px] mb-[16px]">
          <h3 className="font-syne text-[15px] font-semibold text-text-primary mb-[20px] pb-[16px] border-b border-border-subtle">{t('profile')}</h3>
          <div className="space-y-[16px]">
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-[6px] block">{t('email')}</label>
              <div className="bg-bg-tertiary border border-border-emphasis rounded-sm px-[14px] py-[11px] text-[14px] text-text-primary w-full">{user?.email}</div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-[6px] block">{t('name')}</label>
              <div className="bg-bg-tertiary border border-border-emphasis rounded-sm px-[14px] py-[11px] text-[14px] text-text-primary w-full">{user?.name || 'Not set'}</div>
            </div>
          </div>
        </div>

        {/* PREFERENCES SECTION */}
        <div className="bg-bg-secondary border border-border-subtle rounded-lg p-[28px] mb-[16px]">
          <h3 className="font-syne text-[15px] font-semibold text-text-primary mb-[20px] pb-[16px] border-b border-border-subtle">{t('preferences')}</h3>
          <div className="space-y-[16px]">
            <div>
              <label className="text-[12px] font-medium text-text-secondary mb-[6px] block">{t('language')}</label>
              <select 
                className="bg-bg-tertiary border border-border-emphasis rounded-sm px-[14px] py-[11px] text-[14px] text-text-primary w-full sm:w-[256px] outline-none focus:border-accent-emerald focus:ring-1 focus:ring-emerald-glow transition-all appearance-none"
                value={locale}
                onChange={e => setLocale(e.target.value)}
              >
                <option value="en">English (en)</option>
                <option value="hi">Hindi (hi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECURITY SECTION */}
        <div className="bg-bg-secondary border border-border-subtle rounded-lg p-[28px] mb-[16px]">
          <h3 className="font-syne text-[15px] font-semibold text-text-primary mb-[20px] pb-[16px] border-b border-border-subtle">Security</h3>
          <p className="text-[14px] text-text-secondary mb-[16px]">JWT token is stored securely. To end your session on this device, log out.</p>
          <button 
            onClick={logout}
            className="bg-danger-dim border border-[rgba(239,68,68,0.2)] text-accent-danger px-[20px] py-[10px] rounded-sm text-[14px] font-medium cursor-pointer hover:bg-[rgba(239,68,68,0.15)] transition-colors duration-200"
          >
            {t('logout')}
          </button>
        </div>

      </div>
    </div>
  );
}
