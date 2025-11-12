import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

interface AssessmentResultProps {
  aksScore: number;
  aiksScore: number;
  barthelScore?: number;
}

export default function AssessmentResult({ aksScore, aiksScore, barthelScore = 0 }: AssessmentResultProps) {
  const totalScore = aksScore + aiksScore;
  const maxScore = 28; // 12 (AKS) + 16 (AIKS)

  const getTingkatKemandirian = () => {
    const percentage = (totalScore / maxScore) * 100;
    if (percentage >= 85) return 'Mandiri';
    if (percentage >= 60) return 'Ketergantungan Ringan';
    if (percentage >= 40) return 'Ketergantungan Sedang';
    return 'Ketergantungan Berat';
  };

  const getBarthelInterpretation = () => {
    if (barthelScore === 100) return 'Mandiri';
    if (barthelScore >= 60) return 'Ketergantungan Ringan';
    if (barthelScore >= 40) return 'Ketergantungan Sedang';
    if (barthelScore >= 20) return 'Ketergantungan Berat';
    return 'Ketergantungan Total';
  };

  const getKriteriaPJP = () => {
    const tingkat = getTingkatKemandirian();
    // Klien PJP jika memiliki ketergantungan sedang atau berat
    return tingkat === 'Ketergantungan Sedang' || tingkat === 'Ketergantungan Berat';
  };

  const tingkatKemandirian = getTingkatKemandirian();
  const isKlienPJP = getKriteriaPJP();

  const getColorClass = () => {
    if (tingkatKemandirian === 'Mandiri') return 'bg-green-50 border-green-500';
    if (tingkatKemandirian === 'Ketergantungan Ringan') return 'bg-yellow-50 border-yellow-500';
    if (tingkatKemandirian === 'Ketergantungan Sedang') return 'bg-orange-50 border-orange-500';
    return 'bg-red-50 border-red-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Kesimpulan Penilaian</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className={`${getColorClass()} border-2`}>
          <AlertDescription className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="font-semibold text-gray-700">Skor AKS:</div>
                <div className="text-2xl font-bold">{aksScore} / 12</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Skor AIKS:</div>
                <div className="text-2xl font-bold">{aiksScore} / 16</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Barthel Index:</div>
                <div className="text-2xl font-bold">{barthelScore} / 100</div>
              </div>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="font-semibold text-gray-700">Total Skor AKS + AIKS:</div>
              <div className="text-3xl font-bold text-primary">{totalScore} / {maxScore}</div>
            </div>

            <div className="border-t pt-3 mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-gray-700">Tingkat Kemandirian (AKS + AIKS):</div>
                <div className="text-xl font-bold">{tingkatKemandirian}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Tingkat Kemandirian (Barthel):</div>
                <div className="text-xl font-bold">{getBarthelInterpretation()}</div>
              </div>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="font-semibold text-gray-700">Kriteria PJP:</div>
              <div className="flex items-center gap-2 mt-2">
                {isKlienPJP ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-red-600" />
                    <span className="text-xl font-bold text-red-600">Klien PJP</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-green-600" />
                    <span className="text-xl font-bold text-green-600">Bukan Klien PJP</span>
                  </>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
          <div className="font-semibold mb-2">Keterangan:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>PJP = Perawatan Jangka Panjang</li>
            <li>Klien PJP: Memerlukan perawatan dan bantuan berkelanjutan</li>
            <li>Bukan Klien PJP: Dapat melakukan aktivitas dengan mandiri atau bantuan minimal</li>
            <li>Barthel Index: Skor 0-100 untuk mengukur kemandirian fungsional</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}