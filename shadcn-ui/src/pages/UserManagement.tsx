import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, UserPlus, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { fetchUsers, createUser, updateUser, deleteUser, type User } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeleteingUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'user',
  });

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      toast.error('Akses ditolak', {
        description: 'Anda tidak memiliki izin untuk mengakses halaman ini',
      });
      navigate('/dashboard');
      return;
    }

    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Gagal memuat data user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: '', // Don't show password
        name: user.name,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        password: '',
        name: '',
        role: 'user',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      name: '',
      role: 'user',
    });
  };

  const handleSave = async () => {
    if (!formData.username || !formData.name) {
      toast.error('Username dan Nama wajib diisi');
      return;
    }

    if (!editingUser && !formData.password) {
      toast.error('Password wajib diisi untuk user baru');
      return;
    }

    setIsSaving(true);

    try {
      if (editingUser) {
        // Update existing user
        const updateData: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>> = {
          username: formData.username,
          name: formData.name,
          role: formData.role,
        };

        // Only update password if provided
        if (formData.password) {
          updateData.password = formData.password;
        }

        await updateUser(editingUser.id, updateData);
        toast.success('User berhasil diupdate');
      } else {
        // Create new user
        await createUser({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          role: formData.role,
        });
        toast.success('User berhasil ditambahkan');
      }

      handleCloseDialog();
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('duplicate') || (error as { code?: string }).code === '23505') {
        toast.error('Username sudah digunakan');
      } else {
        toast.error('Gagal menyimpan user');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setDeleteingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    // Prevent deleting the last admin
    const adminCount = users.filter(u => u.role === 'admin').length;
    if (deletingUser.role === 'admin' && adminCount <= 1) {
      toast.error('Tidak dapat menghapus admin terakhir');
      return;
    }

    try {
      await deleteUser(deletingUser.id);
      toast.success('User berhasil dihapus');
      setIsDeleteDialogOpen(false);
      setDeleteingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Gagal menghapus user');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-2 sm:px-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="transition-transform hover:scale-110 flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
            Kelola User
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
            Tambah, edit, dan hapus user sistem
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">Daftar User</CardTitle>
            <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Belum ada user terdaftar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.role === 'admin' ? (
                            <>
                              <Shield className="h-4 w-4 text-orange-500" />
                              <span className="text-orange-600 font-semibold">Admin</span>
                            </>
                          ) : (
                            <>
                              <UserIcon className="h-4 w-4 text-blue-500" />
                              <span className="text-blue-600">User</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Update informasi user. Kosongkan password jika tidak ingin mengubahnya.'
                : 'Masukkan informasi user baru.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Masukkan username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {editingUser && '(kosongkan jika tidak diubah)'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Masukkan password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus user <strong>{deletingUser?.username}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}