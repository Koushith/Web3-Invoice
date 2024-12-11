import { Button } from '@/components/ui/button';
import { Menu, LayoutDashboard, FileText, Users, Settings, LogOut, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Receipt className="h-6 w-6 text-primary" />
      <span className="font-bold">
        <span className="text-primary">DeF</span>
        <span className="text-gray-800">Invoice</span>
      </span>
    </div>
  );
}

export function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <AppSidebar isMobileMenuOpen={isMobileMenuOpen} />
        <main className="md:ml-[280px] flex-1 min-h-screen bg-white">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function AppSidebar({ isMobileMenuOpen }: { isMobileMenuOpen: boolean }) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen w-[280px] bg-white/80 backdrop-blur-sm border-r border-neutral-200 transition-transform duration-200 ease-in-out',
        'md:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="h-full">
        <div className="p-6">
          <Logo />
        </div>
        <div className="flex flex-col gap-1 p-3">
          <NavItem icon={<LayoutDashboard size={18} />} label="Home" to="/" />
          <NavItem icon={<FileText size={18} />} label="Invoices" to="/invoices" />
          <NavItem icon={<Users size={18} />} label="Customers" to="/customers" />
          <NavItem icon={<Settings size={18} />} label="Settings" to="/settings" />

          <div className="mt-6 mb-2 px-3">
            <div className="text-xs font-medium text-[#697386] uppercase">Developer</div>
          </div>
          <NavItem icon={<FileText size={18} />} label="API Keys" to="/api-keys" />
          <NavItem icon={<FileText size={18} />} label="Webhooks" to="/webhooks" />
          <NavItem icon={<FileText size={18} />} label="Documentation" to="/documentation" />

          <div className="mt-6 mb-2 px-3">
            <div className="text-xs font-medium text-[#697386] uppercase">Other</div>
          </div>
          <NavItem icon={<LogOut size={18} />} label="Sign out" to="/sign-out" />
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 w-full px-3 py-2 text-[13px] rounded-md transition-colors',
          isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )
      }
    >
      <span className={cn('flex-shrink-0 w-[18px] h-[18px]')}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
