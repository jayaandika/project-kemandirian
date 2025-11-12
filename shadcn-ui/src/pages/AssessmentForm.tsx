import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DemographicForm from '@/components/DemographicForm';
import AKSAssessment from '@/components/AKSAssessment';
import AIKSAssessment from '@/components/AIKSAssessment';
import BarthelIndex from '@/components/BarthelIndex';
import AssessmentResult from '@/components/AssessmentResult';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { saveAssessment } from '@/lib/supabase';

const aksItems = ['mandi', 'berpakaian', 'toileting', 'berpindah', 'kontinensia', 'makan'];
const aiksItems = ['telepon', 'belanja', 'persiapanMakanan', 'rumahTangga', 'laundry', 'transportasi', 'obat', 'keuangan'];
const barthelItems = ['makan', 'mandi', 'perawatanDiri', 'berpakaian', 'buangAirBesar', 'buangAirKecil', 'toilet', 'transfer', 'mobilitas', 'tangga'];

export default function AssessmentForm() {
  const navigate = useNavigate();
  const [demographicData, setDemographicData] = useState({
    nama: '',
    usia: '',
    jenisKelamin: '',
    alamat: '',
    noTelepon: '',
    tinggalDengan: '',
    pekerjaan: '',
    statusPernikahan: '',
    pendidikanTerakhir: '',
    penyakitKronis: [] as string[],
    penyakitKronisLainnya: '',
    lamaPenyakitKronis: '',
    kontrolRutin: '',
    frekuensiKontrol: '',
    kepemilikanAsuransi: '',
    kepemilikanKendaraan: '',
    kendalaTransportasi: '',
    detailKendalaTransportasi: '',
  });

  const [aksScores, setAksScores] = useState<Record<string, number>>({});
  const [aiksScores, setAiksScores] = useState<Record<string, number>>({});
  const [barthelScores, setBarthelScores] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDemographicChange = (field: string, value: string | string[]) => {
    setDemographicData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAksChange = (field: string, value: number) => {
    setAksScores((prev) => ({ ...prev, [field]: value }));
  };

  const handleAiksChange = (field: string, value: number) => {
    setAiksScores((prev) => ({ ...prev, [field]: value }));
  };

  const handleBarthelChange = (field: string, value: number) => {
    setBarthelScores((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTotalAKS = () => {
    return Object.values(aksScores).reduce((sum, score) => sum + score, 0);
  };

  const calculateTotalAIKS = () => {
    return Object.values(aiksScores).reduce((sum, score) => sum + score, 0);
  };

  const calculateTotalBarthel = () => {
    return Object.values(barthelScores).reduce((sum, score) => sum + score, 0);
  };

  const validateForm = () => {
    if (!demographicData.nama || !demographicData.usia) {
      toast.error('Mohon lengkapi data demografi (Nama dan Usia wajib diisi)');
      return false;
    }

    const aksComplete = aksItems.every(item => aksScores[item] !== undefined && aksScores[item] !== null);
    if (!aksComplete) {
      toast.error('Mohon lengkapi semua penilaian AKS');
      return false;
    }

    const aiksComplete = aiksItems.every(item => aiksScores[item] !== undefined && aiksScores[item] !== null);
    if (!aiksComplete) {
      toast.error('Mohon lengkapi semua penilaian AIKS');
      return false;
    }

    const barthelComplete = barthelItems.every(item => barthelScores[item] !== undefined && barthelScores[item] !== null);
    if (!barthelComplete) {
      toast.error('Mohon lengkapi semua penilaian Barthel Index');
      return false;
    }

    return true;
  };

  const handleShowResult = () => {
    if (!validateForm()) {
      return;
    }
    setShowResult(true);
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const assessment = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        demographic: demographicData,
        aks_scores: aksScores,
        aiks_scores: aiksScores,
        barthel_scores: barthelScores,
        aks_score: calculateTotalAKS(),
        aiks_score: calculateTotalAIKS(),
        barthel_score: calculateTotalBarthel(),
        status: 'completed',
      };

      await saveAssessment(assessment);

      toast.success('Assessment berhasil disimpan!', {
        description: 'Data telah tersimpan di cloud dan dapat diakses dari semua device',
      });
      
      setTimeout(() => {
        navigate('/dashboard/history');
      }, 1500);
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Gagal menyimpan assessment', {
        description: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.',
      });
    } finally {
      setIsSaving(false);
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
            Tambah Assessment
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">Lengkapi form penilaian kemandirian</p>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <DemographicForm data={demographicData} onChange={handleDemographicChange} />
        </div>

        <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <AKSAssessment scores={aksScores} onChange={handleAksChange} />
        </div>

        <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
          <AIKSAssessment scores={aiksScores} onChange={handleAiksChange} />
        </div>

        <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
          <BarthelIndex scores={barthelScores} onChange={handleBarthelChange} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-in fade-in duration-500 delay-500 pb-4">
          <Button
            onClick={handleShowResult}
            size="lg"
            className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
          >
            Lihat Kesimpulan
          </Button>
          <Button
            onClick={handleSave}
            size="lg"
            variant="outline"
            disabled={isSaving}
            className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
          >
            <Save className="mr-2 h-5 w-5" />
            {isSaving ? 'Menyimpan...' : 'Simpan Assessment'}
          </Button>
        </div>

        {showResult && (
          <div id="result-section" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AssessmentResult 
              aksScore={calculateTotalAKS()} 
              aiksScore={calculateTotalAIKS()}
              barthelScore={calculateTotalBarthel()}
            />
          </div>
        )}
      </div>
    </div>
  );
}