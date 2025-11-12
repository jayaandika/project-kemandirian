import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AKSAssessmentProps {
  scores: Record<string, number>;
  onChange: (field: string, value: number) => void;
}

const aksItems = [
  { id: 'mandi', label: 'Mandi' },
  { id: 'berpakaian', label: 'Berpakaian' },
  { id: 'toileting', label: 'Toileting (BAB/BAK)' },
  { id: 'berpindah', label: 'Berpindah' },
  { id: 'kontinensia', label: 'Kontinensia (mengontrol BAB/BAK)' },
  { id: 'makan', label: 'Makan' },
];

export default function AKSAssessment({ scores, onChange }: AKSAssessmentProps) {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const allFilled = aksItems.every(item => scores[item.id] !== undefined && scores[item.id] !== null);

  const getInterpretation = (score: number) => {
    if (score >= 10) return { level: 'Mandiri', color: 'bg-green-100 border-green-500' };
    if (score >= 6) return { level: 'Ketergantungan Ringan', color: 'bg-yellow-100 border-yellow-500' };
    return { level: 'Ketergantungan Berat', color: 'bg-red-100 border-red-500' };
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-2xl font-bold text-primary">
          Penilaian AKS (Aktivitas Kehidupan Sehari-hari)
        </CardTitle>
        <p className="text-sm text-gray-600">Pilih tingkat kemandirian untuk setiap aktivitas</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {aksItems.map((item, index) => (
          <div 
            key={item.id} 
            className="space-y-3 p-4 border rounded-lg transition-all duration-300 hover:border-primary hover:shadow-md animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Label className="text-lg font-semibold">{item.label}</Label>
            <RadioGroup
              value={scores[item.id]?.toString() || ''}
              onValueChange={(value) => onChange(item.id, parseInt(value))}
            >
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="2" id={`${item.id}-2`} />
                <Label htmlFor={`${item.id}-2`} className="font-normal cursor-pointer flex-1">
                  Mandiri (2 poin)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="1" id={`${item.id}-1`} />
                <Label htmlFor={`${item.id}-1`} className="font-normal cursor-pointer flex-1">
                  Perlu Bantuan (1 poin)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="0" id={`${item.id}-0`} />
                <Label htmlFor={`${item.id}-0`} className="font-normal cursor-pointer flex-1">
                  Tergantung Total (0 poin)
                </Label>
              </div>
            </RadioGroup>
          </div>
        ))}

        {allFilled && (
          <Alert className={`${interpretation.color} border-2 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <AlertDescription className="space-y-2">
              <div className="font-bold text-lg">Interpretasi AKS:</div>
              <div>Total Skor: {totalScore} / 12</div>
              <div>Tingkat Kemandirian: {interpretation.level}</div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}