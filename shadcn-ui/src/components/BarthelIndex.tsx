import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BarthelIndexProps {
  scores: Record<string, number>;
  onChange: (field: string, value: number) => void;
}

const barthelItems = [
  { 
    id: 'makan', 
    label: 'Makan',
    options: [
      { value: 10, label: 'Mandiri (10)' },
      { value: 5, label: 'Butuh bantuan (5)' },
      { value: 0, label: 'Tidak mampu (0)' }
    ]
  },
  { 
    id: 'mandi', 
    label: 'Mandi',
    options: [
      { value: 5, label: 'Mandiri (5)' },
      { value: 0, label: 'Tergantung (0)' }
    ]
  },
  { 
    id: 'perawatanDiri', 
    label: 'Perawatan Diri (cuci muka, sisir rambut, sikat gigi)',
    options: [
      { value: 5, label: 'Mandiri (5)' },
      { value: 0, label: 'Butuh bantuan (0)' }
    ]
  },
  { 
    id: 'berpakaian', 
    label: 'Berpakaian',
    options: [
      { value: 10, label: 'Mandiri (10)' },
      { value: 5, label: 'Butuh bantuan (5)' },
      { value: 0, label: 'Tergantung (0)' }
    ]
  },
  { 
    id: 'buangAirBesar', 
    label: 'Buang Air Besar',
    options: [
      { value: 10, label: 'Kontinen (10)' },
      { value: 5, label: 'Kadang inkontinen (5)' },
      { value: 0, label: 'Inkontinen (0)' }
    ]
  },
  { 
    id: 'buangAirKecil', 
    label: 'Buang Air Kecil',
    options: [
      { value: 10, label: 'Kontinen (10)' },
      { value: 5, label: 'Kadang inkontinen (5)' },
      { value: 0, label: 'Inkontinen/kateter (0)' }
    ]
  },
  { 
    id: 'toilet', 
    label: 'Menggunakan Toilet',
    options: [
      { value: 10, label: 'Mandiri (10)' },
      { value: 5, label: 'Butuh bantuan (5)' },
      { value: 0, label: 'Tergantung (0)' }
    ]
  },
  { 
    id: 'transfer', 
    label: 'Transfer (tempat tidur-kursi dan sebaliknya)',
    options: [
      { value: 15, label: 'Mandiri (15)' },
      { value: 10, label: 'Butuh sedikit bantuan (10)' },
      { value: 5, label: 'Butuh banyak bantuan (5)' },
      { value: 0, label: 'Tidak mampu (0)' }
    ]
  },
  { 
    id: 'mobilitas', 
    label: 'Mobilitas (berjalan di permukaan datar)',
    options: [
      { value: 15, label: 'Mandiri 50 meter (15)' },
      { value: 10, label: 'Dengan bantuan 50 meter (10)' },
      { value: 5, label: 'Kursi roda mandiri 50 meter (5)' },
      { value: 0, label: 'Tidak mampu (0)' }
    ]
  },
  { 
    id: 'tangga', 
    label: 'Naik Turun Tangga',
    options: [
      { value: 10, label: 'Mandiri (10)' },
      { value: 5, label: 'Butuh bantuan (5)' },
      { value: 0, label: 'Tidak mampu (0)' }
    ]
  },
];

export default function BarthelIndex({ scores, onChange }: BarthelIndexProps) {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const getInterpretation = (score: number) => {
    if (score === 100) return { level: 'Mandiri', color: 'bg-green-100 border-green-500', description: 'Pasien dapat melakukan aktivitas sehari-hari tanpa bantuan' };
    if (score >= 60) return { level: 'Ketergantungan Ringan', color: 'bg-blue-100 border-blue-500', description: 'Pasien memerlukan sedikit bantuan dalam beberapa aktivitas' };
    if (score >= 40) return { level: 'Ketergantungan Sedang', color: 'bg-yellow-100 border-yellow-500', description: 'Pasien memerlukan bantuan dalam banyak aktivitas' };
    if (score >= 20) return { level: 'Ketergantungan Berat', color: 'bg-orange-100 border-orange-500', description: 'Pasien sangat tergantung pada bantuan orang lain' };
    return { level: 'Ketergantungan Total', color: 'bg-red-100 border-red-500', description: 'Pasien sepenuhnya tergantung pada bantuan orang lain' };
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Barthel Index
        </CardTitle>
        <p className="text-sm text-gray-600">Indeks Barthel untuk mengukur kemandirian fungsional dalam aktivitas kehidupan sehari-hari</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {barthelItems.map((item) => (
          <div key={item.id} className="space-y-3 p-4 border rounded-lg">
            <Label className="text-lg font-semibold">{item.label}</Label>
            <RadioGroup
              value={scores[item.id]?.toString() || '0'}
              onValueChange={(value) => onChange(item.id, parseInt(value))}
            >
              {item.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`${item.id}-${option.value}`} />
                  <Label htmlFor={`${item.id}-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <Alert className={`${interpretation.color} border-2`}>
          <AlertDescription className="space-y-2">
            <div className="font-bold text-lg">Interpretasi Barthel Index:</div>
            <div>Total Skor: {totalScore} / 100</div>
            <div>Tingkat Kemandirian: {interpretation.level}</div>
            <div className="text-sm">{interpretation.description}</div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}