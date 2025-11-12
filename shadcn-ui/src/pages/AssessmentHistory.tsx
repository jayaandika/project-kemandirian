import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Trash2, Download, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface Assessment {
  id: string;
  date: string;
  demographic: {
    nama: string;
    usia: string;
    jenisKelamin: string;
    alamat?: string;
    noTelepon?: string;
  };
  aksScore: number;
  aiksScore: number;
  barthelScore: number;
  status: string;
}

export default function AssessmentHistory() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = () => {
    const stored = localStorage.getItem('assessments');
    if (stored) {
      setAssessments(JSON.parse(stored));
    }
  };

  const handleDelete = (id: string) => {
    const updated = assessments.filter((a) => a.id !== id);
    localStorage.setItem('assessments', JSON.stringify(updated));
    setAssessments(updated);
    toast.success('Assessment berhasil dihapus');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTingkatKemandirian = (aksScore: number, aiksScore: number) => {
    const totalScore = aksScore + aiksScore;
    const maxScore = 28;
    const percentage = (totalScore / maxScore) * 100;
    
    if (percentage >= 85) return { level: 'Mandiri', color: 'bg-green-500' };
    if (percentage >= 60) return { level: 'Ketergantungan Ringan', color: 'bg-yellow-500' };
    if (percentage >= 40) return { level: 'Ketergantungan Sedang', color: 'bg-orange-500' };
    return { level: 'Ketergantungan Berat', color: 'bg-red-500' };
  };

  const exportToExcel = () => {
    if (assessments.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const exportData = assessments.map((assessment, index) => {
      const tingkat = getTingkatKemandirian(assessment.aksScore, assessment.aiksScore);
      return {
        'No': index + 1,
        'Tanggal': formatDate(assessment.date),
        'Nama': assessment.demographic.nama,
        'Usia': assessment.demographic.usia,
        'Jenis Kelamin': assessment.demographic.jenisKelamin,
        'Alamat': assessment.demographic.alamat || '-',
        'No Telepon': assessment.demographic.noTelepon || '-',
        'Skor AKS': assessment.aksScore,
        'Skor AIKS': assessment.aiksScore,
        'Skor Barthel': assessment.barthelScore,
        'Total AKS+AIKS': assessment.aksScore + assessment.aiksScore,
        'Tingkat Kemandirian': tingkat.level,
        'Kriteria PJP': (tingkat.level === 'Ketergantungan Sedang' || tingkat.level === 'Ketergantungan Berat') ? 'Klien PJP' : 'Bukan Klien PJP',
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    const colWidths = [
      { wch: 5 },  // No
      { wch: 20 }, // Tanggal
      { wch: 25 }, // Nama
      { wch: 8 },  // Usia
      { wch: 15 }, // Jenis Kelamin
      { wch: 30 }, // Alamat
      { wch: 15 }, // No Telepon
      { wch: 10 }, // Skor AKS
      { wch: 10 }, // Skor AIKS
      { wch: 12 }, // Skor Barthel
      { wch: 15 }, // Total
      { wch: 25 }, // Tingkat Kemandirian
      { wch: 15 }, // Kriteria PJP
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekapan Assessment');

    const currentDate = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
    });
    
    XLSX.writeFile(wb, `Rekapan_Assessment_${currentDate}.xlsx`);
    
    toast.success('Data berhasil diekspor ke Excel!', {
      description: `File: Rekapan_Assessment_${currentDate}.xlsx`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="transition-transform hover:scale-110"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Riwayat Assessment
            </h2>
            <p className="text-gray-600">Daftar semua assessment yang telah dilakukan</p>
          </div>
        </div>
        
        {assessments.length > 0 && (
          <Button 
            onClick={exportToExcel}
            className="transition-all hover:scale-105 hover:shadow-lg"
            size="lg"
          >
            <FileSpreadsheet className="mr-2 h-5 w-5" />
            Export ke Excel
          </Button>
        )}
      </div>

      {assessments.length === 0 ? (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Download className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-500 mb-4 text-lg">Belum ada assessment yang tersimpan</p>
            <Button 
              onClick={() => navigate('/dashboard/assessment')}
              className="transition-all hover:scale-105"
            >
              Tambah Assessment Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assessments.map((assessment, index) => {
            const tingkat = getTingkatKemandirian(assessment.aksScore, assessment.aiksScore);
            return (
              <Card 
                key={assessment.id}
                className="transition-all duration-300 hover:shadow-xl hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        {assessment.demographic.nama}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(assessment.date)}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Assessment?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Assessment akan dihapus permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(assessment.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
                      <p className="text-sm text-gray-600">Usia</p>
                      <p className="font-semibold text-lg">{assessment.demographic.usia} tahun</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
                      <p className="text-sm text-gray-600">Jenis Kelamin</p>
                      <p className="font-semibold text-lg capitalize">{assessment.demographic.jenisKelamin}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg transition-all hover:bg-blue-100">
                      <p className="text-sm text-gray-600">Skor AKS</p>
                      <p className="font-semibold text-lg text-blue-600">{assessment.aksScore} / 12</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg transition-all hover:bg-purple-100">
                      <p className="text-sm text-gray-600">Skor AIKS</p>
                      <p className="font-semibold text-lg text-purple-600">{assessment.aiksScore} / 16</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-emerald-50 rounded-lg transition-all hover:bg-emerald-100">
                      <p className="text-sm text-gray-600 mb-1">Barthel Index</p>
                      <p className="font-semibold text-lg text-emerald-600">{assessment.barthelScore} / 100</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
                      <p className="text-sm text-gray-600 mb-1">Tingkat Kemandirian</p>
                      <Badge className={`${tingkat.color} text-white`}>{tingkat.level}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}