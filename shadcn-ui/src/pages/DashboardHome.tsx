import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Users, TrendingUp, Calendar, FileText } from 'lucide-react';
import { DataSyncButtons } from '@/components/DataSyncButtons';
import { fetchAssessments, migrateLocalStorageToSupabase } from '@/lib/supabase';

export default function DashboardHome() {
  const navigate = useNavigate();
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [thisMonthCount, setThisMonthCount] = useState(0);
  const [klienPJPCount, setKlienPJPCount] = useState(0);
  const [bukanKlienPJPCount, setBukanKlienPJPCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
    checkAndMigrate();
  }, []);

  const checkAndMigrate = async () => {
    const localData = localStorage.getItem('assessments');
    if (localData) {
      try {
        await migrateLocalStorageToSupabase();
      } catch (error) {
        console.error('Migration error:', error);
      }
    }
  };

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const assessments = await fetchAssessments();
      
      setTotalAssessments(assessments.length);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const thisMonth = assessments.filter((assessment) => {
        const assessmentDate = new Date(assessment.date);
        return assessmentDate.getMonth() === currentMonth && assessmentDate.getFullYear() === currentYear;
      });
      setThisMonthCount(thisMonth.length);

      const klienPJP = assessments.filter((assessment) => {
        const totalScore = assessment.aks_score + assessment.aiks_score;
        const maxScore = 28;
        const percentage = (totalScore / maxScore) * 100;
        return percentage < 60;
      });
      setKlienPJPCount(klienPJP.length);

      const bukanKlienPJP = assessments.filter((assessment) => {
        const totalScore = assessment.aks_score + assessment.aiks_score;
        const maxScore = 28;
        const percentage = (totalScore / maxScore) * 100;
        return percentage >= 60;
      });
      setBukanKlienPJPCount(bukanKlienPJP.length);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateWithFilter = (filter: string) => {
    navigate(`/dashboard/history?filter=${filter}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-gray-600 mt-2">Sistem Assessment Kemandirian Lansia</p>
        </div>
        <DataSyncButtons onDataChange={loadStatistics} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 animate-in slide-in-from-bottom-4"
          onClick={() => handleNavigateWithFilter('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Assessment</CardTitle>
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {isLoading ? '...' : totalAssessments}
            </div>
            <p className="text-xs text-blue-600 mt-2">Semua data assessment</p>
          </CardContent>
        </Card>

        <Card 
          className="transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200 animate-in slide-in-from-bottom-4 delay-100"
          onClick={() => handleNavigateWithFilter('thisMonth')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Bulan Ini</CardTitle>
            <Calendar className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {isLoading ? '...' : thisMonthCount}
            </div>
            <p className="text-xs text-green-600 mt-2">Assessment bulan ini</p>
          </CardContent>
        </Card>

        <Card 
          className="transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 animate-in slide-in-from-bottom-4 delay-200"
          onClick={() => handleNavigateWithFilter('klienPJP')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Klien PJP</CardTitle>
            <Users className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              {isLoading ? '...' : klienPJPCount}
            </div>
            <p className="text-xs text-orange-600 mt-2">Perlu pendampingan</p>
          </CardContent>
        </Card>

        <Card 
          className="transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 animate-in slide-in-from-bottom-4 delay-300"
          onClick={() => handleNavigateWithFilter('bukanKlienPJP')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Bukan Klien PJP</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {isLoading ? '...' : bukanKlienPJPCount}
            </div>
            <p className="text-xs text-purple-600 mt-2">Mandiri / ringan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="transition-all duration-300 hover:shadow-xl animate-in slide-in-from-left-4 delay-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Tambah Assessment Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Mulai assessment kemandirian untuk pasien baru atau lakukan follow-up assessment
            </p>
            <Button 
              onClick={() => navigate('/dashboard/assessment')}
              className="w-full transition-all hover:scale-105 hover:shadow-lg"
              size="lg"
            >
              Tambah Assessment
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-xl animate-in slide-in-from-right-4 delay-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Riwayat Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Lihat semua assessment yang telah dilakukan dan export data ke Excel
            </p>
            <Button 
              onClick={() => navigate('/dashboard/history')}
              variant="outline"
              className="w-full transition-all hover:scale-105 hover:shadow-lg"
              size="lg"
            >
              Lihat Riwayat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}