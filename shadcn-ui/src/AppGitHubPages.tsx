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

// GitHub Pages support - detect if we're on GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');
const basename = isGitHubPages ? '/project-kemandirian' : '';

const router = createBrowserRouter([
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
    path: "/",
    element: <Login />,
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