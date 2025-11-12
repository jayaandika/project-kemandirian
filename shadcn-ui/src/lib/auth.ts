export interface User {
  id: string;
  username: string;
  role: string;
  name: string;
}

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  name: 'Administrator',
  role: 'admin',
};

export const login = (username: string, password: string): User | null => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const user: User = {
      id: '1',
      username: ADMIN_CREDENTIALS.username,
      role: ADMIN_CREDENTIALS.role,
      name: ADMIN_CREDENTIALS.name,
    };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
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