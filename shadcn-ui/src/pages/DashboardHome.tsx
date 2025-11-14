import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Users, TrendingUp, Calendar, FileText, BarChart3 } from 'lucide-react';
import { DataSyncButtons } from '@/components/DataSyncButtons';
import { fetchAssessments, migrateLocalStorageToSupabase, type Assessment } from '@/lib/supabase';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';

export default function DashboardHome() {
  const navigate = useNavigate();
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [thisMonthCount, setThisMonthCount] = useState(0);
  const [klienPJPCount, setKlienPJPCount] = useState(0);
  const [bukanKlienPJPCount, setBukanKlienPJPCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [showChart, setShowChart] = useState(false);

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

  // Helper function to determine if patient is PJP client based on NEW criteria
  const isKlienPJP = (assessment: Assessment): boolean => {
    // AKS: Skor < 10 = PJP (based on new max 17)
    const aksIsPJP = assessment.aks_score < 10;
    
    // AIKS: Skor < 3 = PJP
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

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAssessments();
      setAssessments(data);
      
      setTotalAssessments(data.length);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const thisMonth = data.filter((assessment) => {
        const assessmentDate = new Date(assessment.date);
        return assessmentDate.getMonth() === currentMonth && assessmentDate.getFullYear() === currentYear;
      });
      setThisMonthCount(thisMonth.length);

      const klienPJP = data.filter((assessment) => isKlienPJP(assessment));
      setKlienPJPCount(klienPJP.length);

      const bukanKlienPJP = data.filter((assessment) => !isKlienPJP(assessment));
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

  // Prepare chart data
  const getChartData = () => {
    const klienPJP = assessments.filter(a => isKlienPJP(a)).length;
    const bukanKlienPJP = assessments.filter(a => !isKlienPJP(a)).length;
    
    const mandiri = assessments.filter(a => getOverallPercentage(a) >= 85).length;
    const ketergantunganRingan = assessments.filter(a => {
      const p = getOverallPercentage(a);
      return p >= 60 && p < 85;
    }).length;
    const ketergantunganSedang = assessments.filter(a => {
      const p = getOverallPercentage(a);
      return p >= 40 && p < 60;
    }).length;
    const ketergantunganBerat = assessments.filter(a => getOverallPercentage(a) < 40).length;

    return {
      pjpData: [
        { name: 'Klien PJP', value: klienPJP, fill: '#ef4444' },
        { name: 'Bukan Klien PJP', value: bukanKlienPJP, fill: '#3b82f6' },
      ],
      statusData: [
        { name: 'Mandiri', value: mandiri, fill: '#22c55e' },
        { name: 'Ketergantungan Ringan', value: ketergantunganRingan, fill: '#eab308' },
        { name: 'Ketergantungan Sedang', value: ketergantunganSedang, fill: '#f97316' },
        { name: 'Ketergantungan Berat', value: ketergantunganBerat, fill: '#ef4444' },
      ],
    };
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Sistem Assessment Kemandirian Lansia</p>
        </div>
        <DataSyncButtons onDataChange={loadStatistics} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card 
          className="transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 animate-in slide-in-from-bottom-4"
          onClick={() => handleNavigateWithFilter('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-blue-700">Total Assessment</CardTitle>
            <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-900">
              {isLoading ? '...' : totalAssessments}
            </div>
            <p className="text-xs text-blue-600 mt-2">Semua data assessment</p>
          </CardContent>
        </Card>

        <Card 
          className="transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200 animate-in slide-in-from-bottom-4 delay-100"
          onClick={() => handleNavigateWithFilter('thisMonth')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-green-700">Bulan Ini</CardTitle>
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-900">
              {isLoading ? '...' : thisMonthCount}
            </div>
            <p className="text-xs text-green-600 mt-2">Assessment bulan ini</p>
          </CardContent>
        </Card>

        <Card 
          className="transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 animate-in slide-in-from-bottom-4 delay-200"
          onClick={() => handleNavigateWithFilter('klienPJP')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-orange-700">Klien PJP</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-orange-900">
              {isLoading ? '...' : klienPJPCount}
            </div>
            <p className="text-xs text-orange-600 mt-2">Perlu pendampingan</p>
          </CardContent>
        </Card>

        <Card 
          className="transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 animate-in slide-in-from-bottom-4 delay-300"
          onClick={() => handleNavigateWithFilter('bukanKlienPJP')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-purple-700">Bukan Klien PJP</CardTitle>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-purple-900">
              {isLoading ? '...' : bukanKlienPJPCount}
            </div>
            <p className="text-xs text-purple-600 mt-2">Mandiri / ringan</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section with Toggle Button */}
      {assessments.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 delay-400">
          <div className="flex justify-center">
            <Button
              onClick={() => setShowChart(!showChart)}
              variant="outline"
              size="lg"
              className="transition-all hover:scale-105 hover:shadow-lg"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              {showChart ? 'Sembunyikan Grafik Statistik' : 'Tampilkan Grafik Statistik'}
            </Button>
          </div>

          {showChart && (
            <Card className="animate-in fade-in slide-in-from-top-4 duration-500">
              <CardHeader>
                <CardTitle className="text-xl">Statistik Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Kriteria PJP</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.pjpData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Jumlah">
                        {chartData.pjpData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tingkat Kemandirian</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Jumlah">
                        {chartData.statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card className="transition-all duration-300 hover:shadow-xl animate-in slide-in-from-left-4 delay-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Tambah Assessment Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
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
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Riwayat Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
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