import { LayoutDashboard, FileText, Users, Wallet, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings, Key, Webhook, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  onClick?: () => void;
}

function BottomNavItem({ icon, label, to, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-lg transition-all',
          isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-500'
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className={cn('relative', isActive && 'nav-icon-active')}>
            {icon}
          </div>
          <span className={cn(
            'text-[10px] font-medium mt-0.5',
            isActive && 'font-semibold'
          )}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

function MenuNavItem({ icon, label, to, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 w-full px-4 py-3 text-[14px] rounded-lg transition-colors',
          'active:scale-98 transition-transform duration-100',
          isActive
            ? 'bg-gray-100 text-gray-900 font-medium'
            : 'text-gray-500 active:bg-gray-50'
        )
      }
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}

export function MobileBottomNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          <BottomNavItem
            icon={<LayoutDashboard size={20} strokeWidth={2} />}
            label="Home"
            to="/"
          />
          <BottomNavItem
            icon={<FileText size={20} strokeWidth={2} />}
            label="Invoices"
            to="/invoices"
          />
          <BottomNavItem
            icon={<Users size={20} strokeWidth={2} />}
            label="Customers"
            to="/customers"
          />
          <BottomNavItem
            icon={<Wallet size={20} strokeWidth={2} />}
            label="Transactions"
            to="/transactions"
          />

          {/* Menu Sheet Trigger */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button
                className={cn(
                  'flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-lg transition-all',
                  isMenuOpen ? 'text-gray-900 bg-gray-100' : 'text-gray-500'
                )}
              >
                <div className={cn('relative', isMenuOpen && 'nav-icon-active')}>
                  <Menu size={20} strokeWidth={2} />
                </div>
                <span className={cn(
                  'text-[10px] font-medium mt-0.5',
                  isMenuOpen && 'font-semibold'
                )}>
                  Menu
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[75vh] rounded-t-3xl p-0 border-t-2 border-gray-200"
            >
              <div className="h-full flex flex-col">
                {/* Handle bar for drag hint */}
                <div className="flex justify-center pt-3 pb-4">
                  <div className="w-12 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* User Profile Section */}
                <div className="px-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-gray-200">
                      <AvatarImage src={user?.photoURL || undefined} />
                      <AvatarFallback className="bg-gray-900 text-white text-base font-medium">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-[15px]">
                        {user?.displayName || 'User'}
                      </span>
                      <span className="text-[13px] text-gray-500">{user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="flex flex-col gap-1 px-4">
                    <MenuNavItem
                      icon={<Settings size={22} strokeWidth={2} />}
                      label="Settings"
                      to="/settings"
                      onClick={closeMenu}
                    />

                    <div className="mt-6 mb-2 px-4">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Developer
                      </div>
                    </div>
                    <MenuNavItem
                      icon={<Key size={22} strokeWidth={2} />}
                      label="API Keys"
                      to="/api-keys"
                      onClick={closeMenu}
                    />
                    <MenuNavItem
                      icon={<Webhook size={22} strokeWidth={2} />}
                      label="Webhooks"
                      to="/webhooks"
                      onClick={closeMenu}
                    />
                  </div>
                </div>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-12 text-[15px] active:scale-98"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" strokeWidth={2} />
                    <span className="font-medium">Sign out</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
