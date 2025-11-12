import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIKSAssessmentProps {
  scores: Record<string, number>;
  onChange: (field: string, value: number) => void;
}

const aiksItems = [
  { id: 'telepon', label: 'Menggunakan Telepon' },
  { id: 'belanja', label: 'Berbelanja' },
  { id: 'persiapanMakanan', label: 'Persiapan Makanan' },
  { id: 'rumahTangga', label: 'Pekerjaan Rumah Tangga' },
  { id: 'laundry', label: 'Mencuci Pakaian (Laundry)' },
  { id: 'transportasi', label: 'Menggunakan Transportasi' },
  { id: 'obat', label: 'Tanggung Jawab Obat' },
  { id: 'keuangan', label: 'Mengelola Keuangan' },
];

export default function AIKSAssessment({ scores, onChange }: AIKSAssessmentProps) {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const getInterpretation = (score: number) => {
    if (score >= 16) return { level: 'Mandiri', color: 'bg-green-100 border-green-500' };
    if (score >= 12) return { level: 'Ketergantungan Ringan', color: 'bg-yellow-100 border-yellow-500' };
    if (score >= 8) return { level: 'Ketergantungan Sedang', color: 'bg-orange-100 border-orange-500' };
    return { level: 'Ketergantungan Berat', color: 'bg-red-100 border-red-500' };
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          3. Penilaian AIKS (Aktivitas Instrumental Kehidupan Sehari-hari)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {aiksItems.map((item) => (
          <div key={item.id} className="space-y-3 p-4 border rounded-lg">
            <Label className="text-lg font-semibold">{item.label}</Label>
            <RadioGroup
              value={scores[item.id]?.toString() || '0'}
              onValueChange={(value) => onChange(item.id, parseInt(value))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id={`${item.id}-2`} />
                <Label htmlFor={`${item.id}-2`} className="font-normal cursor-pointer">
                  Mandiri (2 poin)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id={`${item.id}-1`} />
                <Label htmlFor={`${item.id}-1`} className="font-normal cursor-pointer">
                  Membutuhkan Bantuan (1 poin)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id={`${item.id}-0`} />
                <Label htmlFor={`${item.id}-0`} className="font-normal cursor-pointer">
                  Tergantung Penuh (0 poin)
                </Label>
              </div>
            </RadioGroup>
          </div>
        ))}

        <Alert className={`${interpretation.color} border-2`}>
          <AlertDescription className="space-y-2">
            <div className="font-bold text-lg">Interpretasi AIKS:</div>
            <div>Total Skor: {totalScore} / 16</div>
            <div>Tingkat Kemandirian: {interpretation.level}</div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}