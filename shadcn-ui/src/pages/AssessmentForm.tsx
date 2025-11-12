import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DemographicForm from '@/components/DemographicForm';
import AKSAssessment from '@/components/AKSAssessment';
import AIKSAssessment from '@/components/AIKSAssessment';
import BarthelIndex from '@/components/BarthelIndex';
import AssessmentResult from '@/components/AssessmentResult';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AssessmentForm() {
  const navigate = useNavigate();
  const [demographicData, setDemographicData] = useState({
    nama: '',
    usia: '',
    jenisKelamin: '',
    alamat: '',
    noTelepon: '',
  });

  const [aksScores, setAksScores] = useState<Record<string, number>>({
    mandi: 0,
    berpakaian: 0,
    toileting: 0,
    berpindah: 0,
    kontinensia: 0,
    makan: 0,
  });

  const [aiksScores, setAiksScores] = useState<Record<string, number>>({
    telepon: 0,
    belanja: 0,
    persiapanMakanan: 0,
    rumahTangga: 0,
    laundry: 0,
    transportasi: 0,
    obat: 0,
    keuangan: 0,
  });

  const [barthelScores, setBarthelScores] = useState<Record<string, number>>({
    makan: 0,
    mandi: 0,
    perawatanDiri: 0,
    berpakaian: 0,
    buangAirBesar: 0,
    buangAirKecil: 0,
    toilet: 0,
    transfer: 0,
    mobilitas: 0,
    tangga: 0,
  });

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

  const handleShowResult = () => {
    if (!demographicData.nama || !demographicData.usia) {
      toast.error('Mohon lengkapi data demografi terlebih dahulu');
      return;
    }
    setShowResult(true);
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSave = () => {
    const assessment = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      demographic: demographicData,
      aksScore: calculateTotalAKS(),
      aiksScore: calculateTotalAIKS(),
      barthelScore: calculateTotalBarthel(),
      status: 'completed',
    };

    const existingAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    existingAssessments.push(assessment);
    localStorage.setItem('assessments', JSON.stringify(existingAssessments));

    toast.success('Assessment berhasil disimpan!');
    setTimeout(() => {
      navigate('/dashboard/history');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Tambah Assessment</h2>
          <p className="text-gray-600">Lengkapi form penilaian kemandirian</p>
        </div>
      </div>

      <div className="space-y-8">
        <DemographicForm data={demographicData} onChange={handleDemographicChange} />

        <AKSAssessment scores={aksScores} onChange={handleAksChange} />

        <AIKSAssessment scores={aiksScores} onChange={handleAiksChange} />

        <BarthelIndex scores={barthelScores} onChange={handleBarthelChange} />

        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleShowResult}
            size="lg"
            className="px-8 py-6 text-lg font-semibold"
          >
            Lihat Kesimpulan
          </Button>
        </div>

        {showResult && (
          <div id="result-section" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AssessmentResult 
              aksScore={calculateTotalAKS()} 
              aiksScore={calculateTotalAIKS()}
              barthelScore={calculateTotalBarthel()}
            />
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleSave}
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
              >
                Simpan Assessment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}