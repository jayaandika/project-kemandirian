import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, History, TrendingUp, Users } from 'lucide-react';

export default function DashboardHome() {
  const navigate = useNavigate();

  const stats = [
    { title: 'Total Assessment', value: '0', icon: ClipboardList, color: 'bg-blue-500' },
    { title: 'Assessment Bulan Ini', value: '0', icon: TrendingUp, color: 'bg-green-500' },
    { title: 'Klien PJP', value: '0', icon: Users, color: 'bg-orange-500' },
    { title: 'Bukan Klien PJP', value: '0', icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-gray-600">Selamat datang di Sistem Penilaian Kemandirian</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              className="w-full justify-start" 
              onClick={() => navigate('/dashboard/assessment')}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Tambah Assessment Baru
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/dashboard/history')}
            >
              <History className="mr-2 h-4 w-4" />
              Lihat Riwayat Assessment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• AKS: Aktivitas Kehidupan Sehari-hari</p>
            <p>• AIKS: Aktivitas Instrumental Kehidupan Sehari-hari</p>
            <p>• Barthel Index: Indeks kemandirian fungsional</p>
            <p>• PJP: Perawatan Jangka Panjang</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}