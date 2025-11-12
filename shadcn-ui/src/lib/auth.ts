import { fetchUserByUsername, type User as SupabaseUser } from './supabase';

export interface User {
  id: string;
  username: string;
  role: string;
  name: string;
}

export const login = async (username: string, password: string): Promise<User | null> => {
  try {
    // Fetch user from Supabase
    const user = await fetchUserByUsername(username);
    
    if (!user) {
      return null;
    }

    // Verify password (plain text comparison - in production, use hashed passwords)
    if (user.password !== password) {
      return null;
    }

    // Create user session
    const sessionUser: User = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    };

    localStorage.setItem('user', JSON.stringify(sessionUser));
    return sessionUser;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};