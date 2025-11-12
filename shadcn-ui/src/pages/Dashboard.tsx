import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { logout, getCurrentUser } from '@/lib/auth';
import { 
  LayoutDashboard, 
  ClipboardList, 
  History, 
  User, 
  LogOut,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/assessment', icon: ClipboardList, label: 'Tambah Assessment' },
    { path: '/dashboard/history', icon: History, label: 'Riwayat Assessment' },
    { path: '/dashboard/profile', icon: User, label: 'Profil' },
  ];

  const NavItems = () => (
    <>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => {
              navigate(item.path);
              setOpen(false);
            }}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4 border-b dark:border-gray-700">
                  <h2 className="font-semibold">Menu</h2>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg sm:text-xl font-bold text-primary">Sistem Penilaian Kemandirian</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="hidden sm:block text-sm">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{user?.role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Button variant="outline" size="icon" onClick={handleLogout} className="sm:hidden">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 min-h-[calc(100vh-57px)] sticky top-[57px]">
          <nav className="flex flex-col gap-2 p-4">
            <NavItems />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}