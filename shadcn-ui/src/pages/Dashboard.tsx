import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Home, ClipboardList, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { logout } from '@/lib/auth';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('isAuthenticated');
    toast.success('Logout berhasil');
    navigate('/login', { replace: true });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                Assessment Lansia
              </h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs sm:text-sm px-2 sm:px-4"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6 flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Button
            variant={isActive('/dashboard') ? 'default' : 'outline'}
            onClick={() => navigate('/dashboard')}
            className="flex-shrink-0 text-xs sm:text-sm px-3 sm:px-4"
          >
            <Home className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          <Button
            variant={isActive('/dashboard/assessment') ? 'default' : 'outline'}
            onClick={() => navigate('/dashboard/assessment')}
            className="flex-shrink-0 text-xs sm:text-sm px-3 sm:px-4"
          >
            <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Assessment</span>
          </Button>
          <Button
            variant={isActive('/dashboard/history') ? 'default' : 'outline'}
            onClick={() => navigate('/dashboard/history')}
            className="flex-shrink-0 text-xs sm:text-sm px-3 sm:px-4"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Riwayat</span>
          </Button>
        </div>

        <Outlet />
      </div>
    </div>
  );
}