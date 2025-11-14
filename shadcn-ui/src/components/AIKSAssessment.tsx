import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIKSAssessmentProps {
  scores: Record<string, number>;
  onChange: (field: string, value: number) => void;
}

const aiksItems = [
  {
    id: 'telepon',
    label: 'Menggunakan telepon',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'dengan bantuan (dapat menjawab telepon atau menekan nomor yang sudah dikenal)' },
      { value: 2, label: 'mandiri' },
    ],
  },
  {
    id: 'belanja',
    label: 'Berbelanja',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'perlu ditemani' },
      { value: 2, label: 'mandiri' },
    ],
  },
  {
    id: 'persiapanMakanan',
    label: 'Menyiapkan makanan',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'hanya menyiapkan makanan bila bahan tersedia' },
      { value: 2, label: 'mandiri' },
    ],
  },
  {
    id: 'rumahTangga',
    label: 'Mengurus rumah tangga',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'ringan saja' },
      { value: 2, label: 'sedang saja' },
      { value: 3, label: 'berat' },
    ],
  },
  {
    id: 'laundry',
    label: 'Mencuci pakaian',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'mandiri' },
    ],
  },
  {
    id: 'transportasi',
    label: 'Menggunakan transportasi',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'perlu ditemani' },
      { value: 2, label: 'mandiri' },
    ],
  },
  {
    id: 'obat',
    label: 'Minum obat',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'mandiri' },
    ],
  },
  {
    id: 'keuangan',
    label: 'Mengelola keuangan',
    options: [
      { value: 0, label: 'tidak mampu' },
      { value: 1, label: 'mandiri' },
    ],
  },
];

export default function AIKSAssessment({ scores, onChange }: AIKSAssessmentProps) {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const allFilled = aiksItems.every((item) => scores[item.id] !== undefined && scores[item.id] !== null);

  const getInterpretation = (score: number) => {
    if (score >= 14) {
      return { level: 'Mandiri', color: 'bg-green-100 border-green-500' };
    }
    if (score >= 8) {
      return { level: 'Perlu Bantuan', color: 'bg-yellow-100 border-yellow-500' };
    }
    return { level: 'Tidak Dapat Melakukan Apa-apa', color: 'bg-red-100 border-red-500' };
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="text-2xl font-bold text-primary">Penilaian AIKS (Aktivitas Instrumental Kehidupan Sehari-hari)</CardTitle>
        <p className="text-sm text-gray-600">Pilih tingkat kemandirian untuk setiap aktivitas instrumental</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {aiksItems.map((item, index) => (
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
              <div className="font-bold text-lg">Interpretasi AIKS:</div>
              <div>Total Skor: {totalScore} / 16</div>
              <div>Tingkat Kemandirian: {interpretation.level}</div>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-sm font-semibold mb-2">Kriteria Hasil AIKS:</div>
          <div className="text-xs space-y-1 text-gray-700">
            <div>• Skor 14-16: Mandiri</div>
            <div>• Skor 8-13: Perlu Bantuan</div>
            <div>• Skor 0-7: Tidak Dapat Melakukan Apa-apa</div>
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