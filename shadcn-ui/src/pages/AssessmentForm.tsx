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
    penyakitKronis: '',
  });

  const [aksScores, setAksScores] = useState<Record<string, number>>({});
  const [aiksScores, setAiksScores] = useState<Record<string, number>>({});
  const [barthelScores, setBarthelScores] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleDemographicChange = (field: string, value: string) => {
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

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const assessment = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      demographic: demographicData,
      aksScores: aksScores,
      aiksScores: aiksScores,
      barthelScores: barthelScores,
      aksScore: calculateTotalAKS(),
      aiksScore: calculateTotalAIKS(),
      barthelScore: calculateTotalBarthel(),
      status: 'completed',
    };

    const existingAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    existingAssessments.push(assessment);
    localStorage.setItem('assessments', JSON.stringify(existingAssessments));

    toast.success('Assessment berhasil disimpan!', {
      description: 'Data telah tersimpan dan dapat dilihat di riwayat assessment',
    });
    
    setTimeout(() => {
      navigate('/dashboard/history');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
            Tambah Assessment
          </h2>
          <p className="text-gray-600">Lengkapi form penilaian kemandirian</p>
        </div>
      </div>

      <div className="space-y-8">
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

        <div className="flex gap-4 justify-center animate-in fade-in duration-500 delay-500">
          <Button
            onClick={handleShowResult}
            size="lg"
            className="px-8 py-6 text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
          >
            Lihat Kesimpulan
          </Button>
          <Button
            onClick={handleSave}
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
          >
            <Save className="mr-2 h-5 w-5" />
            Simpan Assessment
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