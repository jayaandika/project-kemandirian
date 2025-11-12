import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Trash2 } from 'lucide-react';
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

interface Assessment {
  id: string;
  date: string;
  demographic: {
    nama: string;
    usia: string;
    jenisKelamin: string;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Riwayat Assessment</h2>
          <p className="text-gray-600">Daftar semua assessment yang telah dilakukan</p>
        </div>
      </div>

      {assessments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">Belum ada assessment yang tersimpan</p>
            <Button onClick={() => navigate('/dashboard/assessment')}>
              Tambah Assessment Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assessments.map((assessment) => {
            const tingkat = getTingkatKemandirian(assessment.aksScore, assessment.aiksScore);
            return (
              <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {assessment.demographic.nama}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(assessment.date)}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
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
                          <AlertDialogAction onClick={() => handleDelete(assessment.id)}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Usia</p>
                      <p className="font-semibold">{assessment.demographic.usia} tahun</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jenis Kelamin</p>
                      <p className="font-semibold capitalize">{assessment.demographic.jenisKelamin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Skor AKS</p>
                      <p className="font-semibold">{assessment.aksScore} / 12</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Skor AIKS</p>
                      <p className="font-semibold">{assessment.aiksScore} / 16</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Barthel Index</p>
                      <p className="font-semibold">{assessment.barthelScore} / 100</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tingkat Kemandirian</p>
                      <Badge className={tingkat.color}>{tingkat.level}</Badge>
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