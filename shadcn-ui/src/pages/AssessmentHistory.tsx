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

  // Helper function to determine if patient is PJP client based on NEW criteria
  const isKlienPJP = (assessment: Assessment): boolean => {
    // AKS: Skor < 10 = PJP (based on new max 17: Ketergantungan sedang C, berat D, total E)
    const aksIsPJP = assessment.aks_score < 10;
    
    // AIKS: Skor < 3 = PJP (based on criteria: 0, 1, 2 = PJP; 3-8 = Bukan PJP)
    const aiksIsPJP = assessment.aiks_score < 3;
    
    // Patient is PJP if either AKS or AIKS indicates PJP
    return aksIsPJP || aiksIsPJP;
  };

  // Calculate percentage for AKS (max 17)
  const getAKSPercentage = (score: number): number => {
    return Math.round((score / 17) * 100);
  };

  // Calculate percentage for AIKS (max 8)
  const getAIKSPercentage = (score: number): number => {
    return Math.round((score / 8) * 100);
  };

  // Calculate overall percentage
  const getOverallPercentage = (assessment: Assessment): number => {
    const aksPercentage = getAKSPercentage(assessment.aks_score);
    const aiksPercentage = getAIKSPercentage(assessment.aiks_score);
    return Math.round((aksPercentage + aiksPercentage) / 2);
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
      if (filterStatus === 'klien-pjp') {
        filtered = filtered.filter((assessment) => isKlienPJP(assessment));
      } else if (filterStatus === 'bukan-klien-pjp') {
        filtered = filtered.filter((assessment) => !isKlienPJP(assessment));
      } else if (filterStatus === 'mandiri') {
        // Mandiri: AKS >= 10 AND AIKS >= 3
        filtered = filtered.filter((assessment) => 
          assessment.aks_score >= 10 && assessment.aiks_score >= 3
        );
      } else if (filterStatus === 'ketergantungan') {
        // Ketergantungan: AKS < 10 OR AIKS < 3
        filtered = filtered.filter((assessment) => 
          assessment.aks_score < 10 || assessment.aiks_score < 3
        );
      }
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

  const getStatusBadge = (assessment: Assessment) => {
    const overallPercentage = getOverallPercentage(assessment);

    if (overallPercentage >= 85) {
      return { label: 'Mandiri', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    } else if (overallPercentage >= 60) {
      return { label: 'Ketergantungan Ringan', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    } else if (overallPercentage >= 40) {
      return { label: 'Ketergantungan Sedang', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
    } else {
      return { label: 'Ketergantungan Berat', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
    }
  };

  const getPJPBadge = (assessment: Assessment) => {
    if (isKlienPJP(assessment)) {
      return { label: 'Klien PJP', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
    } else {
      return { label: 'Bukan Klien PJP', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    }
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
              Export Excel
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
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="mandiri">Mandiri</SelectItem>
                <SelectItem value="ketergantungan">Ketergantungan</SelectItem>
                <SelectItem value="klien-pjp">Klien PJP</SelectItem>
                <SelectItem value="bukan-klien-pjp">Bukan Klien PJP</SelectItem>
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
                    <TableHead>% Kemandirian</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kriteria PJP</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.map((assessment) => {
                    const status = getStatusBadge(assessment);
                    const pjpStatus = getPJPBadge(assessment);
                    const overallPercentage = getOverallPercentage(assessment);
                    
                    return (
                      <TableRow key={assessment.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(assessment.date).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell className="font-medium">{assessment.demographic.nama}</TableCell>
                        <TableCell>{assessment.demographic.usia}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {assessment.aks_score}/17 ({getAKSPercentage(assessment.aks_score)}%)
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {assessment.aiks_score}/8 ({getAIKSPercentage(assessment.aiks_score)}%)
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{assessment.barthel_score}/100</TableCell>
                        <TableCell>
                          <span className="font-semibold">{overallPercentage}%</span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${pjpStatus.color}`}>
                            {pjpStatus.label}
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
                    );
                  })}
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