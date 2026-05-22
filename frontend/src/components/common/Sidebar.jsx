import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, GitCompare, BarChart3, Sparkles, ChevronLeft, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Channel Overview' },
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/compare', icon: GitCompare, label: 'Compare' },
    { to: '/analysis', icon: Sparkles, label: 'Analysis' },
    { to: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-xl"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <motion.aside 
        animate={{ width: collapsed ? 80 : 260 }}
        className={`fixed md:relative z-40 bg-white border-r border-slate-100 h-screen flex flex-col transition-all duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 flex items-center gap-3">
          <img src="/logo.png" alt="YT-lytics" className="w-10 h-10 rounded-xl shadow-md border border-slate-100 flex-shrink-0 object-cover" />
          {!collapsed && <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 whitespace-nowrap">YT-lytics</h1>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative ${isActive ? 'text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                  {isActive && (
                    <motion.div layoutId="active-nav" className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-xl -z-10" />
                  )}
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : ''}`} />
                  {!collapsed && <span className="whitespace-nowrap">{link.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 hidden md:block">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
              <ChevronLeft className="w-5 h-5" />
            </motion.div>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
