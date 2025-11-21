import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const DashboardShell = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
