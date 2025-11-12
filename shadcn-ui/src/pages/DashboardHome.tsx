import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, History, TrendingUp, Users } from 'lucide-react';

interface Assessment {
  date: string;
  aksScore: number;
  aiksScore: number;
}

export default function DashboardHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    klienPJP: 0,
    bukanKlienPJP: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const assessments: Assessment[] = JSON.parse(localStorage.getItem('assessments') || '[]');
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let thisMonthCount = 0;
    let klienPJPCount = 0;
    let bukanKlienPJPCount = 0;

    assessments.forEach((assessment) => {
      const assessmentDate = new Date(assessment.date);
      
      // Count this month's assessments
      if (assessmentDate.getMonth() === currentMonth && assessmentDate.getFullYear() === currentYear) {
        thisMonthCount++;
      }

      // Determine PJP status
      const totalScore = assessment.aksScore + assessment.aiksScore;
      const maxScore = 28;
      const percentage = (totalScore / maxScore) * 100;
      
      // Ketergantungan Sedang or Ketergantungan Berat = Klien PJP
      if (percentage < 60) {
        klienPJPCount++;
      } else {
        bukanKlienPJPCount++;
      }
    });

    setStats({
      total: assessments.length,
      thisMonth: thisMonthCount,
      klienPJP: klienPJPCount,
      bukanKlienPJP: bukanKlienPJPCount,
    });
  };

  const statsData = [
    { title: 'Total Assessment', value: stats.total.toString(), icon: ClipboardList, color: 'bg-blue-500' },
    { title: 'Assessment Bulan Ini', value: stats.thisMonth.toString(), icon: TrendingUp, color: 'bg-green-500' },
    { title: 'Klien PJP', value: stats.klienPJP.toString(), icon: Users, color: 'bg-orange-500' },
    { title: 'Bukan Klien PJP', value: stats.bukanKlienPJP.toString(), icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h2>
        <p className="text-gray-600">Selamat datang di Sistem Penilaian Kemandirian</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title}
              className="transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-left-4 delay-200">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full justify-start transition-all hover:scale-105" 
              onClick={() => navigate('/dashboard/assessment')}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Tambah Assessment Baru
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start transition-all hover:scale-105"
              onClick={() => navigate('/dashboard/history')}
            >
              <History className="mr-2 h-4 w-4" />
              Lihat Riwayat Assessment
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-right-4 delay-300">
          <CardHeader>
            <CardTitle>Informasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• AKS: Aktivitas Kehidupan Sehari-hari</p>
            <p>• AIKS: Aktivitas Instrumental Kehidupan Sehari-hari</p>
            <p>• Barthel Index: Indeks kemandirian fungsional</p>
            <p>• PJP: Perawatan Jangka Panjang</p>
            <p className="pt-2 text-xs italic">
              * Statistik diperbarui secara otomatis berdasarkan data assessment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}