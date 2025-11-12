import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Trash2, Download, FileSpreadsheet, Eye, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { DataSyncButtons } from '@/components/DataSyncButtons';

interface Assessment {
  id: string;
  date: string;
  demographic: {
    nama: string;
    usia: string;
    jenisKelamin: string;
    alamat?: string;
    noTelepon?: string;
    tinggalDengan?: string;
    pekerjaan?: string;
    statusPernikahan?: string;
    pendidikanTerakhir?: string;
    penyakitKronis?: string[];
    penyakitKronisLainnya?: string;
    lamaPenyakitKronis?: string;
    kontrolRutin?: string;
    frekuensiKontrol?: string;
    kepemilikanAsuransi?: string;
    kepemilikanKendaraan?: string;
    kendalaTransportasi?: string;
    detailKendalaTransportasi?: string;
  };
  aksScores: Record<string, number>;
  aiksScores: Record<string, number>;
  barthelScores: Record<string, number>;
  aksScore: number;
  aiksScore: number;
  barthelScore: number;
  status: string;
}

export default function AssessmentHistory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    loadAssessments();
    const filter = searchParams.get('filter') || 'all';
    setActiveFilter(filter);
  }, [searchParams]);

  useEffect(() => {
    applyFilter();
  }, [assessments, activeFilter]);

  const loadAssessments = () => {
    const stored = localStorage.getItem('assessments');
    if (stored) {
      setAssessments(JSON.parse(stored));
    }
  };

  const applyFilter = () => {
    if (activeFilter === 'all') {
      setFilteredAssessments(assessments);
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let filtered = assessments;

    if (activeFilter === 'thisMonth') {
      filtered = assessments.filter((assessment) => {
        const assessmentDate = new Date(assessment.date);
        return assessmentDate.getMonth() === currentMonth && assessmentDate.getFullYear() === currentYear;
      });
    } else if (activeFilter === 'klienPJP') {
      filtered = assessments.filter((assessment) => {
        const totalScore = assessment.aksScore + assessment.aiksScore;
        const maxScore = 28;
        const percentage = (totalScore / maxScore) * 100;
        return percentage < 60;
      });
    } else if (activeFilter === 'bukanKlienPJP') {
      filtered = assessments.filter((assessment) => {
        const totalScore = assessment.aksScore + assessment.aiksScore;
        const maxScore = 28;
        const percentage = (totalScore / maxScore) * 100;
        return percentage >= 60;
      });
    }

    setFilteredAssessments(filtered);
  };

  const clearFilter = () => {
    setActiveFilter('all');
    navigate('/dashboard/history');
  };

  const getFilterLabel = () => {
    const labels: Record<string, string> = {
      all: 'Semua Assessment',
      thisMonth: 'Assessment Bulan Ini',
      klienPJP: 'Klien PJP',
      bukanKlienPJP: 'Bukan Klien PJP',
    };
    return labels[activeFilter] || 'Semua Assessment';
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

  const getBarthelInterpretation = (score: number) => {
    if (score === 100) return { level: 'Mandiri', color: 'bg-green-500' };
    if (score >= 60) return { level: 'Ketergantungan Ringan', color: 'bg-blue-500' };
    if (score >= 40) return { level: 'Ketergantungan Sedang', color: 'bg-yellow-500' };
    if (score >= 20) return { level: 'Ketergantungan Berat', color: 'bg-orange-500' };
    return { level: 'Ketergantungan Total', color: 'bg-red-500' };
  };

  const formatStatusPernikahan = (status?: string) => {
    if (!status) return '-';
    const statusMap: Record<string, string> = {
      'belum-menikah': 'Belum Menikah',
      'menikah': 'Menikah',
      'cerai': 'Cerai',
      'janda-duda': 'Janda/Duda',
    };
    return statusMap[status] || status;
  };

  const formatPendidikan = (pendidikan?: string) => {
    if (!pendidikan) return '-';
    const pendidikanMap: Record<string, string> = {
      'tidak-sekolah': 'Tidak Sekolah',
      'sd': 'SD',
      'smp': 'SMP',
      'sma': 'SMA',
      'diploma': 'Diploma',
      's1': 'S1',
      's2': 'S2',
      's3': 'S3',
    };
    return pendidikanMap[pendidikan] || pendidikan;
  };

  const formatLamaPenyakit = (lama?: string) => {
    if (!lama) return '-';
    const lamaMap: Record<string, string> = {
      'kurang-1-tahun': '< 1 tahun',
      '1-5-tahun': '1-5 tahun',
      '5-10-tahun': '5-10 tahun',
      'lebih-10-tahun': '> 10 tahun',
    };
    return lamaMap[lama] || lama;
  };

  const formatKendaraan = (kendaraan?: string) => {
    if (!kendaraan) return '-';
    const kendaraanMap: Record<string, string> = {
      'mobil': 'Memiliki Mobil',
      'motor': 'Memiliki Sepeda Motor',
      'mobil-motor': 'Memiliki Mobil dan Sepeda Motor',
      'tidak-memiliki': 'Tidak Memiliki',
    };
    return kendaraanMap[kendaraan] || kendaraan;
  };

  const formatAsuransi = (asuransi?: string) => {
    if (!asuransi) return '-';
    const asuransiMap: Record<string, string> = {
      'bpjs-mandiri': 'BPJS Kesehatan Mandiri',
      'bpjs-pegawai': 'BPJS Kesehatan Pegawai/Pensiunan',
      'bpjs-kis': 'BPJS KIS',
      'asuransi-lain': 'Asuransi Lain',
    };
    return asuransiMap[asuransi] || asuransi;
  };

  const handleViewDetail = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setDetailDialogOpen(true);
  };

  const exportToExcel = () => {
    const dataToExport = activeFilter === 'all' ? assessments : filteredAssessments;
    
    if (dataToExport.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const exportData = dataToExport.map((assessment, index) => {
      const tingkat = getTingkatKemandirian(assessment.aksScore, assessment.aiksScore);
      return {
        'No': index + 1,
        'Tanggal': formatDate(assessment.date),
        'Nama': assessment.demographic.nama,
        'Usia': assessment.demographic.usia,
        'Jenis Kelamin': assessment.demographic.jenisKelamin,
        'Alamat': assessment.demographic.alamat || '-',
        'No Telepon': assessment.demographic.noTelepon || '-',
        'Tinggal Dengan': assessment.demographic.tinggalDengan || '-',
        'Pekerjaan': assessment.demographic.pekerjaan || '-',
        'Status Pernikahan': formatStatusPernikahan(assessment.demographic.statusPernikahan),
        'Pendidikan Terakhir': formatPendidikan(assessment.demographic.pendidikanTerakhir),
        'Penyakit Kronis': assessment.demographic.penyakitKronis?.join(', ') || '-',
        'Penyakit Kronis Lainnya': assessment.demographic.penyakitKronisLainnya || '-',
        'Lama Penyakit Kronis': formatLamaPenyakit(assessment.demographic.lamaPenyakitKronis),
        'Kontrol Rutin': assessment.demographic.kontrolRutin === 'ya' ? 'Ya' : assessment.demographic.kontrolRutin === 'tidak' ? 'Tidak' : '-',
        'Frekuensi Kontrol': assessment.demographic.frekuensiKontrol || '-',
        'Kepemilikan Asuransi': formatAsuransi(assessment.demographic.kepemilikanAsuransi),
        'Kepemilikan Kendaraan': formatKendaraan(assessment.demographic.kepemilikanKendaraan),
        'Kendala Transportasi': assessment.demographic.kendalaTransportasi === 'ya' ? 'Ya' : assessment.demographic.kendalaTransportasi === 'tidak' ? 'Tidak' : '-',
        'Detail Kendala Transportasi': assessment.demographic.detailKendalaTransportasi || '-',
        'Skor AKS': assessment.aksScore,
        'Skor AIKS': assessment.aiksScore,
        'Skor Barthel': assessment.barthelScore,
        'Total AKS+AIKS': assessment.aksScore + assessment.aiksScore,
        'Tingkat Kemandirian': tingkat.level,
        'Kriteria PJP': (tingkat.level === 'Ketergantungan Sedang' || tingkat.level === 'Ketergantungan Berat') ? 'Klien PJP' : 'Bukan Klien PJP',
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    
    const colWidths = [
      { wch: 5 },  { wch: 20 }, { wch: 25 }, { wch: 8 },  { wch: 15 },
      { wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
      { wch: 20 }, { wch: 30 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
      { wch: 30 }, { wch: 30 }, { wch: 25 }, { wch: 20 }, { wch: 35 },
      { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 25 },
      { wch: 15 },
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekapan Assessment');

    const currentDate = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
    });
    
    const filterSuffix = activeFilter !== 'all' ? `_${getFilterLabel().replace(/ /g, '_')}` : '';
    XLSX.writeFile(wb, `Rekapan_Assessment${filterSuffix}_${currentDate}.xlsx`);
    
    toast.success('Data berhasil diekspor ke Excel!', {
      description: `File: Rekapan_Assessment${filterSuffix}_${currentDate}.xlsx`,
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
        
        <div className="flex gap-2">
          <DataSyncButtons onDataChange={loadAssessments} />
          {filteredAssessments.length > 0 && (
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
      </div>

      {activeFilter !== 'all' && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-in fade-in slide-in-from-top-4">
          <Badge className="bg-blue-500 text-white text-base px-4 py-2">
            {getFilterLabel()}
          </Badge>
          <span className="text-sm text-gray-600">
            Menampilkan {filteredAssessments.length} dari {assessments.length} assessment
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilter}
            className="ml-auto hover:bg-blue-100"
          >
            <X className="h-4 w-4 mr-1" />
            Hapus Filter
          </Button>
        </div>
      )}

      {filteredAssessments.length === 0 ? (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Download className="h-10 w-10 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-500 mb-2 text-lg">
              {activeFilter === 'all' 
                ? 'Belum ada assessment yang tersimpan' 
                : `Tidak ada data untuk filter "${getFilterLabel()}"`}
            </p>
            {activeFilter !== 'all' && (
              <Button 
                onClick={clearFilter}
                variant="outline"
                className="mt-4 transition-all hover:scale-105"
              >
                Lihat Semua Assessment
              </Button>
            )}
            {activeFilter === 'all' && (
              <Button 
                onClick={() => navigate('/dashboard/assessment')}
                className="mt-4 transition-all hover:scale-105"
              >
                Tambah Assessment Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAssessments.map((assessment, index) => {
            const tingkat = getTingkatKemandirian(assessment.aksScore, assessment.aiksScore);
            return (
              <Card 
                key={assessment.id}
                className="transition-all duration-300 hover:shadow-xl hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex-1">
                      <CardTitle 
                        className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleViewDetail(assessment)}
                      >
                        <User className="h-5 w-5 text-primary" />
                        {assessment.demographic.nama}
                        <Eye className="h-4 w-4 ml-2 text-gray-400" />
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

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Detail Assessment Pasien</DialogTitle>
            <DialogDescription>
              Informasi lengkap hasil assessment kemandirian
            </DialogDescription>
          </DialogHeader>
          
          {selectedAssessment && (
            <div className="space-y-6 mt-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-primary">Data Demografi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                    <p className="font-semibold text-lg">{selectedAssessment.demographic.nama}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Usia</p>
                    <p className="font-semibold text-lg">{selectedAssessment.demographic.usia} tahun</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jenis Kelamin</p>
                    <p className="font-semibold text-lg capitalize">{selectedAssessment.demographic.jenisKelamin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">No. Telepon</p>
                    <p className="font-semibold text-lg">{selectedAssessment.demographic.noTelepon || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tinggal Dengan</p>
                    <p className="font-semibold text-lg">{selectedAssessment.demographic.tinggalDengan || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pekerjaan</p>
                    <p className="font-semibold text-lg">{selectedAssessment.demographic.pekerjaan || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status Pernikahan</p>
                    <p className="font-semibold text-lg">{formatStatusPernikahan(selectedAssessment.demographic.statusPernikahan)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pendidikan Terakhir</p>
                    <p className="font-semibold text-lg">{formatPendidikan(selectedAssessment.demographic.pendidikanTerakhir)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Alamat</p>
                    <p className="font-semibold text-lg">{selectedAssessment.demographic.alamat || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-rose-700">Informasi Kesehatan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Penyakit Kronis</p>
                    <p className="font-semibold text-lg">
                      {selectedAssessment.demographic.penyakitKronis && selectedAssessment.demographic.penyakitKronis.length > 0
                        ? selectedAssessment.demographic.penyakitKronis.join(', ')
                        : '-'}
                    </p>
                    {selectedAssessment.demographic.penyakitKronisLainnya && (
                      <p className="text-sm mt-1 text-gray-700">Lainnya: {selectedAssessment.demographic.penyakitKronisLainnya}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lama Penyakit Kronis</p>
                    <p className="font-semibold text-lg">{formatLamaPenyakit(selectedAssessment.demographic.lamaPenyakitKronis)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kontrol Rutin</p>
                    <p className="font-semibold text-lg">
                      {selectedAssessment.demographic.kontrolRutin === 'ya' ? 'Ya' : selectedAssessment.demographic.kontrolRutin === 'tidak' ? 'Tidak' : '-'}
                    </p>
                  </div>
                  {selectedAssessment.demographic.kontrolRutin === 'ya' && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Frekuensi & Tempat Kontrol</p>
                      <p className="font-semibold text-lg">{selectedAssessment.demographic.frekuensiKontrol || '-'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-emerald-700">Informasi Asuransi & Transportasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Kepemilikan Asuransi</p>
                    <p className="font-semibold text-lg">{formatAsuransi(selectedAssessment.demographic.kepemilikanAsuransi)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kepemilikan Kendaraan</p>
                    <p className="font-semibold text-lg">{formatKendaraan(selectedAssessment.demographic.kepemilikanKendaraan)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kendala Transportasi</p>
                    <p className="font-semibold text-lg">
                      {selectedAssessment.demographic.kendalaTransportasi === 'ya' ? 'Ya' : selectedAssessment.demographic.kendalaTransportasi === 'tidak' ? 'Tidak' : '-'}
                    </p>
                  </div>
                  {selectedAssessment.demographic.kendalaTransportasi === 'ya' && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Detail Kendala Transportasi</p>
                      <p className="font-semibold text-lg">{selectedAssessment.demographic.detailKendalaTransportasi || '-'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <h4 className="font-bold text-blue-700 mb-2">Skor AKS</h4>
                  <p className="text-3xl font-bold text-blue-600">{selectedAssessment.aksScore} / 12</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {getTingkatKemandirian(selectedAssessment.aksScore, selectedAssessment.aiksScore).level}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                  <h4 className="font-bold text-purple-700 mb-2">Skor AIKS</h4>
                  <p className="text-3xl font-bold text-purple-600">{selectedAssessment.aiksScore} / 16</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {getTingkatKemandirian(selectedAssessment.aksScore, selectedAssessment.aiksScore).level}
                  </p>
                </div>
                
                <div className="bg-emerald-50 p-6 rounded-lg border-2 border-emerald-200">
                  <h4 className="font-bold text-emerald-700 mb-2">Barthel Index</h4>
                  <p className="text-3xl font-bold text-emerald-600">{selectedAssessment.barthelScore} / 100</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {getBarthelInterpretation(selectedAssessment.barthelScore).level}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-200">
                <h3 className="text-xl font-bold mb-3 text-amber-800">Kesimpulan</h3>
                <div className="space-y-2">
                  <p className="text-lg">
                    <span className="font-semibold">Total Skor AKS + AIKS:</span>{' '}
                    <span className="text-2xl font-bold text-primary">
                      {selectedAssessment.aksScore + selectedAssessment.aiksScore} / 28
                    </span>
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Tingkat Kemandirian:</span>{' '}
                    <Badge className={`${getTingkatKemandirian(selectedAssessment.aksScore, selectedAssessment.aiksScore).color} text-white text-base px-3 py-1`}>
                      {getTingkatKemandirian(selectedAssessment.aksScore, selectedAssessment.aiksScore).level}
                    </Badge>
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Kriteria PJP:</span>{' '}
                    <span className="font-bold text-lg">
                      {(getTingkatKemandirian(selectedAssessment.aksScore, selectedAssessment.aiksScore).level === 'Ketergantungan Sedang' || 
                        getTingkatKemandirian(selectedAssessment.aksScore, selectedAssessment.aiksScore).level === 'Ketergantungan Berat') 
                        ? '✓ Klien PJP' 
                        : '✗ Bukan Klien PJP'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500 text-center">
                Tanggal Assessment: {formatDate(selectedAssessment.date)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}