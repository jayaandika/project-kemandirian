import { useState } from 'react';
import DemographicForm from '@/components/DemographicForm';
import AKSAssessment from '@/components/AKSAssessment';
import AIKSAssessment from '@/components/AIKSAssessment';
import AssessmentResult from '@/components/AssessmentResult';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Index() {
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

  const calculateTotalAKS = () => {
    return Object.values(aksScores).reduce((sum, score) => sum + score, 0);
  };

  const calculateTotalAIKS = () => {
    return Object.values(aiksScores).reduce((sum, score) => sum + score, 0);
  };

  const handleShowResult = () => {
    setShowResult(true);
    // Scroll to result
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setDemographicData({
      nama: '',
      usia: '',
      jenisKelamin: '',
      alamat: '',
      noTelepon: '',
    });
    setAksScores({
      mandi: 0,
      berpakaian: 0,
      toileting: 0,
      berpindah: 0,
      kontinensia: 0,
      makan: 0,
    });
    setAiksScores({
      telepon: 0,
      belanja: 0,
      persiapanMakanan: 0,
      rumahTangga: 0,
      laundry: 0,
      transportasi: 0,
      obat: 0,
      keuangan: 0,
    });
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Sistem Penilaian Kemandirian
          </h1>
          <p className="text-gray-600">
            Penilaian Aktivitas Kehidupan Sehari-hari (AKS) dan Aktivitas Instrumental Kehidupan Sehari-hari (AIKS)
          </p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          <DemographicForm data={demographicData} onChange={handleDemographicChange} />

          <AKSAssessment scores={aksScores} onChange={handleAksChange} />

          <AIKSAssessment scores={aiksScores} onChange={handleAiksChange} />

          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleShowResult}
              size="lg"
              className="px-8 py-6 text-lg font-semibold"
            >
              Lihat Kesimpulan
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold"
            >
              Reset Form
            </Button>
          </div>

          {showResult && (
            <div id="result-section" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AssessmentResult aksScore={calculateTotalAKS()} aiksScore={calculateTotalAIKS()} />
            </div>
          )}
        </div>

        <div className="text-center mt-12 text-sm text-gray-500">
          <p>© 2025 Sistem Penilaian Kemandirian - Dibuat dengan MGX</p>
        </div>
      </div>
    </div>
  );
}