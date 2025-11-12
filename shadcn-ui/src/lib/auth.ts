import { fetchUserByUsername } from './supabase';

export interface User {
  id: string;
  username: string;
  role: string;
  name: string;
}

export const login = async (username: string, password: string): Promise<User | null> => {
  try {
    // Validate input
    if (!username || !password) {
      console.error('Username and password are required');
      return null;
    }

    // Fetch user from Supabase
    const user = await fetchUserByUsername(username);
    
    if (!user) {
      console.error('User not found:', username);
      return null;
    }

    // Verify password (plain text comparison - in production, use hashed passwords)
    if (user.password !== password) {
      console.error('Invalid password for user:', username);
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
    console.log('Login successful for user:', username);
    return sessionUser;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
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