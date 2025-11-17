import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import AssessmentForm from './pages/AssessmentForm';
import AssessmentHistory from './pages/AssessmentHistory';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// GitHub Pages support - detect base path
const getBasename = () => {
  // For GitHub Pages
  if (window.location.hostname.includes('github.io')) {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1 && pathParts[1]) {
      return `/${pathParts[1]}`;
    }
  }
  return '';
};

const basename = getBasename();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "assessment",
        element: <AssessmentForm />,
      },
      {
        path: "history",
        element: <AssessmentHistory />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
], {
  basename: basename,
});

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="assessment-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;