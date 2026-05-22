import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
