import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AKSAssessmentProps {
  scores: Record<string, number>;
  onChange: (field: string, value: number) => void;
}

const aksItems = [
  {
    id: 'bab',
    label: 'Mengendalikan rangsang BAB',
    options: [
      { value: 0, label: 'tidak terkendali/tidak teratur (perlu pencahar)' },
      { value: 1, label: 'kadang-kadang tak terkendali (1x/minggu)' },
      { value: 2, label: 'terkendali teratur' },
    ],
  },
  {
    id: 'bak',
    label: 'Mengendalikan rangsang BAK',
    options: [
      { value: 0, label: 'tidak terkendali atau menggunakan kateter' },
      { value: 1, label: 'kadang-kadang tak terkendali (1x24 jam)' },
      { value: 2, label: 'terkendali teratur' },
    ],
  },
  {
    id: 'membersihkan',
    label: 'Membersihkan diri (mencuci wajah, menyikat rambut, mencukur kumis, sikat gigi)',
    options: [
      { value: 0, label: 'butuh bantuan orang lain' },
      { value: 1, label: 'mandiri' },
    ],
  },
  {
    id: 'makan',
    label: 'Makan minum (jika makanan harus berupa potongan, dianggap dibantu)',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'perlu ditolong memotong makanan' },
      { value: 2, label: 'mandiri' },
    ],
  },
  {
    id: 'berpindah',
    label: 'Bergerak dari kursi roda ke tempat tidur dan sebaliknya (termasuk duduk ditempat tidur)',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'perlu banyak bantuan untuk bisa duduk (2 orang)' },
      { value: 2, label: 'mandiri' },
    ],
  },
  {
    id: 'berjalan',
    label: 'Berjalan di tempat rata (atau jika tidak bisa berjalan, menjalankan kursi roda)',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'mampu berpindah menggunakan kursi roda' },
      { value: 2, label: 'berjalan dengan bantuan 1 orang' },
      { value: 3, label: 'mandiri' },
    ],
  },
  {
    id: 'berpakaian',
    label: 'Berpakaian (termasuk memasang tali sepatu, mengencangkan sabuk)',
    options: [
      { value: 0, label: 'tergantung orang lain' },
      { value: 1, label: 'sebagian dibantu' },
      { value: 2, label: 'mandiri' },
    ],
  },
  {
    id: 'tangga',
    label: 'Naik turun tangga',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'butuh pertolongan' },
      { value: 2, label: 'mandiri' },
    ],
  },
  {
    id: 'mandi',
    label: 'Mandi',
    options: [
      { value: 0, label: 'tergantung orang lain' },
      { value: 1, label: 'mandiri' },
    ],
  },
];

export default function AKSAssessment({ scores, onChange }: AKSAssessmentProps) {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const allFilled = aksItems.every((item) => scores[item.id] !== undefined && scores[item.id] !== null);

  const getInterpretation = (score: number) => {
    if (score === 20) {
      return { level: 'Mandiri (A)', category: 'Bukan PJP', color: 'bg-green-100 border-green-500' };
    }
    if (score >= 12 && score <= 19) {
      return { level: 'Ketergantungan ringan (B)', category: 'Bukan PJP', color: 'bg-yellow-100 border-yellow-500' };
    }
    if (score >= 9 && score <= 11) {
      return { level: 'Ketergantungan sedang (C)', category: 'PJP', color: 'bg-orange-100 border-orange-500' };
    }
    if (score >= 5 && score <= 8) {
      return { level: 'Ketergantungan sedang (C)', category: 'PJP', color: 'bg-orange-100 border-orange-500' };
    }
    return { level: 'Ketergantungan total (E)', category: 'PJP', color: 'bg-red-100 border-red-500' };
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-2xl font-bold text-primary">Penilaian AKS (Aktivitas Kehidupan Sehari-hari)</CardTitle>
        <p className="text-sm text-gray-600">Pilih tingkat kemandirian untuk setiap aktivitas</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {aksItems.map((item, index) => (
          <div
            key={item.id}
            className="space-y-3 p-4 border rounded-lg transition-all duration-300 hover:border-primary hover:shadow-md animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Label className="text-lg font-semibold">
              {index + 1}. {item.label}
            </Label>
            <RadioGroup value={scores[item.id]?.toString() || ''} onValueChange={(value) => onChange(item.id, parseInt(value))}>
              {item.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option.value.toString()} id={`${item.id}-${option.value}`} />
                  <Label htmlFor={`${item.id}-${option.value}`} className="font-normal cursor-pointer flex-1">
                    {option.label} ({option.value} poin)
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        {allFilled && (
          <Alert className={`${interpretation.color} border-2 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <AlertDescription className="space-y-2">
              <div className="font-bold text-lg">Interpretasi AKS:</div>
              <div>Total Skor: {totalScore} / 20</div>
              <div>Tingkat Kemandirian: {interpretation.level}</div>
              <div className="font-semibold">Kategori PJP: {interpretation.category}</div>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-semibold mb-2">Kriteria Hasil Tingkat Kemandirian:</div>
          <div className="text-xs space-y-1 text-gray-700">
            <div>• Skor 20: Mandiri (A) - Bukan PJP</div>
            <div>• Skor 12-19: Ketergantungan ringan (B) - Bukan PJP</div>
            <div>• Skor 9-11: Ketergantungan sedang (C) - PJP</div>
            <div>• Skor 5-8: Ketergantungan sedang (C) - PJP</div>
            <div>• Skor 0-4: Ketergantungan total (E) - PJP</div>
          </div>
          <div className="mt-3 text-xs text-gray-600 italic">
            Kondisi lansia yang memerlukan PJP adalah berdasarkan penilaian AKS tingkat ketergantungan sedang (B) berat (C) dan total serta
            berdasarkan AIKS dengan hasil: perlu bantuan dan tidak dapat melakukan apa-apa
          </div>
        </div>
      </CardContent>
    </Card>
  );
}