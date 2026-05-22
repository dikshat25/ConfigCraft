import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Zap, LayoutTemplate } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* HEADER */}
      <header className="sticky top-0 z-50 h-[60px] px-12 bg-bg-primary/85 backdrop-blur-[20px] border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-[28px] h-[28px] rounded-lg bg-accent-emerald flex flex-wrap items-center justify-center p-[6px] gap-[2px]">
            <div className="w-[6px] h-[6px] bg-black rounded-sm"></div>
            <div className="w-[6px] h-[6px] bg-black rounded-sm"></div>
            <div className="w-[6px] h-[6px] bg-black rounded-sm"></div>
            <div className="w-[6px] h-[6px] bg-black rounded-sm"></div>
          </div>
          <span className="font-syne font-bold text-[18px] text-text-primary tracking-tight">ConfigCraft</span>
        </div>

        <nav className="flex items-center gap-8 hidden md:flex">
          <a href="#features" className="font-sans text-[14px] text-text-secondary hover:text-text-primary transition-colors duration-200">Features</a>
          <a href="#about" className="font-sans text-[14px] text-text-secondary hover:text-text-primary transition-colors duration-200">About</a>
          <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="font-sans text-[14px] text-text-secondary hover:text-text-primary transition-colors duration-200">GitHub</a>
        </nav>

        <button 
          onClick={() => navigate('/login')}
          className="bg-accent-emerald text-black font-medium px-[18px] py-[8px] rounded-sm text-[13px] shadow-[0_0_20px_var(--emerald-glow)] hover:opacity-85 transition-opacity"
        >
          Launch App
        </button>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="pt-[110px] pb-[80px] px-12 max-w-[860px] mx-auto text-center md:text-left flex flex-col items-center md:items-start">
          <div className="inline-flex items-center gap-2 bg-emerald-glow border border-[rgba(0,217,126,0.2)] text-accent-emerald text-[12px] font-medium px-[14px] py-[5px] rounded-full mb-8">
            <div className="w-[6px] h-[6px] bg-accent-emerald rounded-full animate-pulse"></div>
            Config-driven · Self-healing · Production-ready
          </div>

          <h1 className="font-syne text-[52px] md:text-[72px] font-extrabold leading-[1.0] tracking-[-3px] text-text-primary mb-6">
            <div className="block">Build apps from</div>
            <div className="block"><span className="text-accent-emerald">JSON configs.</span></div>
            <div className="block">Instantly.</div>
          </h1>

          <p className="text-[18px] text-text-secondary leading-[1.7] font-light max-w-[560px] mb-[40px] font-sans">
            ConfigCraft turns imperfect JSON into fully working forms, tables, 
            and CRUD APIs — with a self-healing engine that gracefully recovers from 
            broken configurations.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-accent-emerald text-black font-medium px-[26px] py-[13px] rounded-sm shadow-[0_0_24px_var(--emerald-glow)] hover:-translate-y-[1px] hover:shadow-[0_0_32px_var(--emerald-glow)] transition-all duration-250 w-full sm:w-auto"
            >
              Start Building &rarr;
            </button>
            <button 
              onClick={() => window.open('https://github.com/your-repo', '_blank')}
              className="bg-transparent border border-border-emphasis text-text-secondary font-medium px-[26px] py-[13px] rounded-sm hover:border-border-subtle hover:text-text-primary transition-colors duration-200 w-full sm:w-auto"
            >
              View on GitHub
            </button>
          </div>
        </section>

        {/* FEATURES STRIP */}
        <section id="features" className="grid grid-cols-1 md:grid-cols-3 bg-border-subtle gap-[1px] border-t border-b border-border-subtle mb-[80px]">
          <div className="bg-bg-primary p-[40px_48px] hover:bg-bg-secondary transition-colors duration-200">
            <div className="w-[36px] h-[36px] bg-emerald-glow rounded-sm flex items-center justify-center mb-4">
              <Zap size={18} className="text-accent-emerald" />
            </div>
            <h3 className="font-syne text-[18px] font-semibold text-text-primary mb-2">Self-Healing Engine</h3>
            <p className="font-sans text-[14px] text-text-secondary leading-[1.6]">
              Broken configs? Missing fields? Detects, fixes, and warns — without crashing.
            </p>
          </div>
          
          <div className="bg-bg-primary p-[40px_48px] hover:bg-bg-secondary transition-colors duration-200">
            <div className="w-[36px] h-[36px] bg-emerald-glow rounded-sm flex items-center justify-center mb-4">
              <Database size={18} className="text-accent-emerald" />
            </div>
            <h3 className="font-syne text-[18px] font-semibold text-text-primary mb-2">Dynamic CRUD APIs</h3>
            <p className="font-sans text-[14px] text-text-secondary leading-[1.6]">
              Upload JSON and get fully working backend routes and database storage instantly.
            </p>
          </div>

          <div className="bg-bg-primary p-[40px_48px] hover:bg-bg-secondary transition-colors duration-200">
            <div className="w-[36px] h-[36px] bg-emerald-glow rounded-sm flex items-center justify-center mb-4">
              <LayoutTemplate size={18} className="text-accent-emerald" />
            </div>
            <h3 className="font-syne text-[18px] font-semibold text-text-primary mb-2">Extensible by Design</h3>
            <p className="font-sans text-[14px] text-text-secondary leading-[1.6]">
              Component registry architecture — add new field types without touching core logic.
            </p>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-[80px] px-12 border-t border-border-subtle grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center max-w-screen-xl mx-auto">
          <div>
            <div className="text-[11px] tracking-[2px] uppercase text-accent-emerald mb-5 font-bold font-sans">— Built by</div>
            <h2 className="font-syne text-[42px] font-extrabold tracking-[-1.5px] leading-[1.1] text-text-primary mb-5">
              A developer who thinks in systems.
            </h2>
            <p className="font-sans text-[15px] text-text-secondary leading-[1.8] font-light mb-4">
              ConfigCraft isn't a tutorial project. It's a production-grade runtime 
              engine built with resilience and extensibility as first principles.
            </p>
            <p className="font-sans text-[15px] text-text-secondary leading-[1.8] font-light">
              Every edge case is handled. Every config heals gracefully. Every 
              architectural decision has a reason.
            </p>
          </div>

          <div className="bg-bg-secondary border border-border-emphasis rounded-xl p-8 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] bg-[radial-gradient(circle,var(--emerald-dim)_0%,transparent_70%)] pointer-events-none"></div>

            <div className="w-[64px] h-[64px] bg-gradient-to-br from-accent-emerald to-[#00A86B] rounded-md font-syne text-[22px] font-extrabold text-black flex items-center justify-center mb-5">
              DT
            </div>
            
            <h3 className="font-syne text-[22px] font-bold text-text-primary tracking-[-0.5px] mb-1">Diksha Thongire</h3>
            <div className="font-sans text-[13px] text-accent-emerald font-medium mb-5">Full Stack Developer</div>
            
            <p className="font-sans text-[14px] text-text-secondary leading-[1.7] font-light mb-6">
              Building resilient, extensible, production-ready systems. 
              Passionate about React, Node.js, and config-driven architecture.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {['React', 'Node.js', 'PostgreSQL'].map(skill => (
                <span key={skill} className="bg-emerald-glow border border-[rgba(0,217,126,0.2)] text-accent-emerald text-[12px] px-[10px] py-[4px] rounded-[6px] font-sans">
                  {skill}
                </span>
              ))}
              {['Prisma', 'Express', 'Tailwind CSS', 'JWT Auth', 'System Design'].map(skill => (
                <span key={skill} className="bg-bg-tertiary border border-border-emphasis text-text-secondary text-[12px] px-[10px] py-[4px] rounded-[6px] font-sans">
                  {skill}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-[1px] bg-border-subtle rounded-md overflow-hidden border border-border-subtle mt-6">
              <div className="bg-bg-tertiary p-4 text-center">
                <div className="font-syne text-[22px] font-extrabold text-text-primary tracking-[-1px]">15+</div>
                <div className="font-sans text-[11px] text-text-secondary mt-[2px]">Edge cases handled</div>
              </div>
              <div className="bg-bg-tertiary p-4 text-center">
                <div className="font-syne text-[22px] font-extrabold text-text-primary tracking-[-1px]">8</div>
                <div className="font-sans text-[11px] text-text-secondary mt-[2px]">Core features</div>
              </div>
              <div className="bg-bg-tertiary p-4 text-center">
                <div className="font-syne text-[22px] font-extrabold text-text-primary tracking-[-1px]">∞</div>
                <div className="font-sans text-[11px] text-text-secondary mt-[2px]">Configs supported</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border-subtle py-[32px] px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded-full bg-accent-emerald shadow-[0_0_8px_var(--emerald)]"></div>
          <span className="font-sans text-[13px] text-text-secondary">ConfigCraft — Config-driven app generator</span>
        </div>
        <div className="font-sans text-[13px] text-text-secondary">
          Built by Diksha Thongire · 2026
        </div>
      </footer>
    </div>
  );
}
