import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Trash2, FileSpreadsheet, Search } from 'lucide-react';
import { toast } from 'sonner';
import { fetchAssessments, deleteAssessment, type Assessment } from '@/lib/supabase';
import { exportToExcel } from '@/lib/excelExport';

export default function AssessmentHistory() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    filterAssessmentData();
  }, [assessments, searchTerm, filterStatus]);

  const loadAssessments = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAssessments();
      setAssessments(data);
    } catch (error) {
      console.error('Error loading assessments:', error);
      toast.error('Gagal memuat data assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAssessmentData = () => {
    let filtered = [...assessments];

    // Filter by search term (nama)
    if (searchTerm) {
      filtered = filtered.filter((assessment) =>
        assessment.demographic.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((assessment) => {
        const status = assessment.status.toLowerCase();
        if (filterStatus === 'mandiri') {
          return status.includes('mandiri') && !status.includes('ketergantungan');
        } else if (filterStatus === 'ketergantungan') {
          return status.includes('ketergantungan');
        }
        return true;
      });
    }

    setFilteredAssessments(filtered);
  };

  const handleDelete = async () => {
    if (!assessmentToDelete) return;

    try {
      await deleteAssessment(assessmentToDelete.id);
      toast.success('Assessment berhasil dihapus');
      setDeleteDialogOpen(false);
      setAssessmentToDelete(null);
      loadAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Gagal menghapus assessment');
    }
  };

  const handleExportToExcel = () => {
    if (filteredAssessments.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    try {
      exportToExcel(filteredAssessments);
      toast.success('Data berhasil diekspor ke Excel', {
        description: `${filteredAssessments.length} assessment telah diekspor`,
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Gagal mengekspor data ke Excel');
    }
  };

  const openDeleteDialog = (assessment: Assessment) => {
    setAssessmentToDelete(assessment);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
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
            Riwayat Assessment
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
            Lihat dan kelola data assessment yang telah disimpan
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">Data Assessment</CardTitle>
            <Button
              onClick={handleExportToExcel}
              disabled={filteredAssessments.length === 0}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export ke Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama lansia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="mandiri">Mandiri</SelectItem>
                <SelectItem value="ketergantungan">Ketergantungan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all'
                  ? 'Tidak ada data yang sesuai dengan filter'
                  : 'Belum ada assessment yang disimpan'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Usia</TableHead>
                    <TableHead className="hidden sm:table-cell">AKS</TableHead>
                    <TableHead className="hidden sm:table-cell">AIKS</TableHead>
                    <TableHead className="hidden md:table-cell">Barthel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(assessment.date).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className="font-medium">{assessment.demographic.nama}</TableCell>
                      <TableCell>{assessment.demographic.usia}</TableCell>
                      <TableCell className="hidden sm:table-cell">{assessment.aks_score}</TableCell>
                      <TableCell className="hidden sm:table-cell">{assessment.aiks_score}</TableCell>
                      <TableCell className="hidden md:table-cell">{assessment.barthel_score}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            assessment.status.toLowerCase().includes('mandiri') &&
                            !assessment.status.toLowerCase().includes('ketergantungan')
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          }`}
                        >
                          {assessment.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(assessment)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Summary */}
          {filteredAssessments.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Menampilkan {filteredAssessments.length} dari {assessments.length} assessment
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus assessment untuk{' '}
              <strong>{assessmentToDelete?.demographic.nama}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}