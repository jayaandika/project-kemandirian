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
    label: 'Dapat menggunakan telepon',
    options: [
      { value: 1, label: 'mengoperasikan telepon sendiri dan mencari dan menghubungi nomor' },
      { value: 1, label: 'menghubungi beberapa nomor yang diketahui' },
      { value: 1, label: 'menjawab telepon tetapi tidak menghubungi' },
      { value: 0, label: 'tidak bisa menggunakan telepon sama sekali' },
    ],
  },
  {
    id: 'transportasi',
    label: 'Mampu pergi ke suatu tempat',
    options: [
      { value: 1, label: 'Berpergian sendiri menggunakan kendaraan umum atau menyetir sendiri' },
      { value: 1, label: 'Mengatur perjalanan sendiri' },
      { value: 0, label: 'Perjalanan menggunakan transportasi umum jika ada yang menyertai' },
      { value: 0, label: 'Tidak melakukan perjalanan sama sekali' },
    ],
  },
  {
    id: 'belanja',
    label: 'Dapat berbelanja',
    options: [
      { value: 1, label: 'Mengatur semua kebutuhan belanja sendiri' },
      { value: 0, label: 'Perlu bantuan untuk mengantar belanja' },
      { value: 0, label: 'Sama sekali tidak mampu belanja' },
    ],
  },
  {
    id: 'persiapanMakanan',
    label: 'Dapat menyiapkan makanan',
    options: [
      { value: 1, label: 'Merencanakan, menyiapkan, dan menghidangkan makanan' },
      { value: 0, label: 'Menyiapkan makanan jika sudah tersedia bahan makanan' },
      { value: 0, label: 'Menyiapkan makanan tetapi tidak mengatur diet yang cukup' },
      { value: 0, label: 'Perlu disiapkan dan dilayani' },
    ],
  },
  {
    id: 'rumahTangga',
    label: 'Dapat melakukan pekerjaan rumah tangga',
    options: [
      { value: 1, label: 'Merawat rumah sendiri atau bantuan kadang-kadang' },
      { value: 1, label: 'Mengerjakan pekerjaan ringan sehari-hari (merapikan tempat tidur, mencuci piring)' },
      { value: 1, label: 'Perlu bantuan untuk semua perawatan rumah sehari-hari' },
      { value: 0, label: 'Tidak berpartisipasi dalam perawatan rumah' },
    ],
  },
  {
    id: 'laundry',
    label: 'Dapat mencuci pakaian',
    options: [
      { value: 1, label: 'Mencuci semua pakaian sendiri' },
      { value: 1, label: 'Mencuci pakaian yang kecil' },
      { value: 0, label: 'Semua pakaian dicuci oleh orang lain' },
    ],
  },
  {
    id: 'obat',
    label: 'Dapat mengatur obat - obatan',
    options: [
      { value: 1, label: 'Meminum obat secara tepat dosis dan waktu tanpa bantuan' },
      { value: 0, label: 'Tidak mampu menyiapkan obat sendiri' },
    ],
  },
  {
    id: 'keuangan',
    label: 'Dapat mengatur keuangan',
    options: [
      { value: 1, label: 'Mengatur masalah financial (tagihan, pergi ke bank)' },
      { value: 1, label: 'Mengatur pengeluaran sehari-hari, tapi perlu bantuan untuk ke bank untuk transaksi penting' },
      { value: 0, label: 'Tidak mampu mengambil keputusan financial atau memegang uang' },
    ],
  },
];

export default function AIKSAssessment({ scores, onChange }: AIKSAssessmentProps) {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const allFilled = aiksItems.every((item) => scores[item.id] !== undefined && scores[item.id] !== null);

  const getInterpretation = (score: number) => {
    if (score >= 3 && score <= 8) {
      return { level: 'Independen/Mandiri', category: 'Bukan PJP', color: 'bg-green-100 border-green-500' };
    }
    if (score === 2) {
      return { level: 'Perlu bantuan sesekali', category: 'PJP', color: 'bg-yellow-100 border-yellow-500' };
    }
    if (score === 1) {
      return { level: 'Perlu bantuan sepanjang waktu', category: 'PJP', color: 'bg-orange-100 border-orange-500' };
    }
    return { level: 'Tidak dapat melakukan apa-apa / Dikerjakan oleh orang lain', category: 'PJP', color: 'bg-red-100 border-red-500' };
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
              {item.options.map((option, optIdx) => (
                <div key={optIdx} className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option.value.toString()} id={`${item.id}-${optIdx}`} className="mt-1" />
                  <Label htmlFor={`${item.id}-${optIdx}`} className="font-normal cursor-pointer flex-1 leading-relaxed">
                    {option.label} <span className="text-gray-500">({option.value} poin)</span>
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
              <div>Total Skor: {totalScore} / 8</div>
              <div>Hasil Penilaian: {interpretation.level}</div>
              <div className="font-semibold">Kategori PJP: {interpretation.category}</div>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-sm font-semibold mb-2">Kriteria Hasil AIKS:</div>
          <div className="text-xs space-y-1 text-gray-700">
            <div>• Skor 0: Tidak dapat melakukan apa-apa / Dikerjakan oleh orang lain - <strong>PJP</strong></div>
            <div>• Skor 1: Perlu bantuan sepanjang waktu - <strong>PJP</strong></div>
            <div>• Skor 2: Perlu bantuan sesekali - <strong>PJP</strong></div>
            <div>• Skor 3-8: Independen/Mandiri - <strong>Bukan PJP</strong></div>
          </div>
          <div className="mt-3 text-xs text-gray-600 italic">
            Kondisi lansia yang memerlukan PJP adalah berdasarkan penilaian AKS tingkat ketergantungan sedang (B), berat (C), dan total serta
            berdasarkan AIKS dengan hasil: perlu bantuan dan tidak dapat melakukan apa-apa
          </div>
        </div>
      </CardContent>
    </Card>
  );
}