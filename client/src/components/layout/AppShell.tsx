import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Key, Webhook, DollarSign } from 'lucide-react';
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
  const [isMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="flex">
        <AppSidebar isMobileMenuOpen={isMobileMenuOpen} />
        <main className="md:ml-[280px] flex-1 min-h-screen bg-[#FEFFFE]">
          <div className="p-8 max-w-[1500px] mx-auto">
            <Outlet />
          </div>
        </main>
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

function NavItem({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <NavLink
      to={to}
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
