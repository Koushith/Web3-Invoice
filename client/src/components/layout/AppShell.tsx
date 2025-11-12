import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Key, Webhook, DollarSign, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { MobileBottomNav } from './MobileBottomNav';
import { Sheet, SheetContent } from '@/components/ui/sheet';

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-[#635BFF] rounded-md flex items-center justify-center">
        <span className="text-white text-lg font-bold">D</span>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-base leading-none text-[#0A2540]">DefInvoice</span>
      </div>
    </div>
  );
}

export function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="flex flex-col md:flex-row">
        {/* Mobile Header */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white z-50 flex items-center justify-between px-5 shadow-sm">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center gap-2 active:opacity-70 transition-opacity"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#635BFF]">
              <span className="text-sm font-bold text-white">D</span>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button className="relative h-8 w-8 flex items-center justify-center border border-gray-200 rounded-xl active:bg-gray-50 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
              </svg>
              <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-red-600 rounded-full" />
            </button>
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback className="bg-gray-900 text-white text-sm font-semibold">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar isMobileMenuOpen={false} />
        </div>

        {/* Mobile Sidebar Drawer */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            <MobileSidebarContent onNavigate={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="md:ml-[280px] flex-1 min-h-screen bg-[#FEFFFE] pt-14 pb-20 md:pt-0 md:pb-0">
          <div className="px-4 py-6 sm:px-6 sm:py-8 md:p-8 max-w-[1500px] mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
}

function AppSidebar({ isMobileMenuOpen }: { isMobileMenuOpen: boolean }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-[#E3E8EF] transition-all duration-300 ease-in-out',
        'md:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-[#E3E8EF]">
          <Logo />
        </div>
        <div className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={20} />} label="Home" to="/" />
          <NavItem icon={<FileText size={20} />} label="Invoices" to="/invoices" />
          <NavItem icon={<Users size={20} />} label="Customers" to="/customers" />
          <NavItem icon={<DollarSign size={20} />} label="Payments" to="/payments" />
          <NavItem icon={<Settings size={20} />} label="Settings" to="/settings" />

          <div className="mt-8 mb-3 px-3">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Developer</div>
          </div>
          <NavItem icon={<Key size={20} />} label="API Keys" to="/api-keys" />
          <NavItem icon={<Webhook size={20} />} label="Webhooks" to="/webhooks" />
        </div>

        {/* User Profile Section with Dropdown */}
        <div className="p-4 border-t border-[#E3E8EF] mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto hover:bg-[#F6F9FC] rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || undefined} />
                    <AvatarFallback className="bg-[#635BFF] text-white text-sm font-medium">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium text-[#0A2540] text-[13px]">{user?.displayName || 'User'}</span>
                    <span className="text-[11px] text-[#425466]">{user?.email}</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="top">
              <DropdownMenuItem className="text-red-600 font-medium" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, to, onClick }: { icon: React.ReactNode; label: string; to: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 w-full px-3 py-2.5 text-[13.5px] rounded-md transition-colors',
          isActive
            ? 'bg-[#F6F9FC] text-[#635BFF] font-medium'
            : 'text-[#425466] hover:bg-[#F6F9FC] hover:text-[#0A2540]'
        )
      }
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}

function MobileSidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
      onNavigate();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-[#E3E8EF]">
        <Logo />
      </div>
      <div className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
        <NavItem icon={<LayoutDashboard size={20} />} label="Home" to="/" onClick={onNavigate} />
        <NavItem icon={<FileText size={20} />} label="Invoices" to="/invoices" onClick={onNavigate} />
        <NavItem icon={<Users size={20} />} label="Customers" to="/customers" onClick={onNavigate} />
        <NavItem icon={<DollarSign size={20} />} label="Payments" to="/payments" onClick={onNavigate} />
        <NavItem icon={<Settings size={20} />} label="Settings" to="/settings" onClick={onNavigate} />

        <div className="mt-8 mb-3 px-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Developer</div>
        </div>
        <NavItem icon={<Key size={20} />} label="API Keys" to="/api-keys" onClick={onNavigate} />
        <NavItem icon={<Webhook size={20} />} label="Webhooks" to="/webhooks" onClick={onNavigate} />
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[#E3E8EF] mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || undefined} />
            <AvatarFallback className="bg-[#635BFF] text-white text-sm font-medium">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-medium text-[#0A2540] text-[13px]">{user?.displayName || 'User'}</span>
            <span className="text-[11px] text-[#425466]">{user?.email}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  );
}
