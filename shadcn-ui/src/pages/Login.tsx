import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { login } from '@/lib/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Use the auth.ts login function
    const user = login(username, password);
    
    if (user) {
      // Also set isAuthenticated for backward compatibility
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Login berhasil!', {
        description: `Selamat datang, ${user.name}`,
      });
      
      // Small delay to ensure localStorage is set before navigation
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
        setIsLoading(false);
      }, 100);
    } else {
      toast.error('Username atau password salah');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Assessment Lansia
          </CardTitle>
          <CardDescription className="text-base sm:text-lg">
            Sistem Penilaian Kemandirian Lansia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                disabled={isLoading}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </Button>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 font-medium mb-2">Demo Credentials:</p>
              <p className="text-sm text-gray-600">Username: <span className="font-mono font-semibold">admin</span></p>
              <p className="text-sm text-gray-600">Password: <span className="font-mono font-semibold">admin123</span></p>
              <p className="text-xs text-gray-500 mt-3">
                💡 <strong>Catatan:</strong> Semua device yang login akan melihat data yang sama (shared database)
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}