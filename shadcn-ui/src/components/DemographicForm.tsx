import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DemographicFormProps {
  data: {
    nama: string;
    usia: string;
    jenisKelamin: string;
    alamat: string;
    noTelepon: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function DemographicForm({ data, onChange }: DemographicFormProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">1. Data Demografi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input
            id="nama"
            value={data.nama}
            onChange={(e) => onChange('nama', e.target.value)}
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="usia">Usia</Label>
          <Input
            id="usia"
            type="number"
            value={data.usia}
            onChange={(e) => onChange('usia', e.target.value)}
            placeholder="Masukkan usia"
          />
        </div>

        <div className="space-y-2">
          <Label>Jenis Kelamin</Label>
          <RadioGroup value={data.jenisKelamin} onValueChange={(value) => onChange('jenisKelamin', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="laki-laki" id="laki-laki" />
              <Label htmlFor="laki-laki" className="font-normal cursor-pointer">
                Laki-laki
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="perempuan" id="perempuan" />
              <Label htmlFor="perempuan" className="font-normal cursor-pointer">
                Perempuan
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="alamat">Alamat</Label>
          <Input
            id="alamat"
            value={data.alamat}
            onChange={(e) => onChange('alamat', e.target.value)}
            placeholder="Masukkan alamat lengkap"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="noTelepon">No. Telepon</Label>
          <Input
            id="noTelepon"
            value={data.noTelepon}
            onChange={(e) => onChange('noTelepon', e.target.value)}
            placeholder="Masukkan nomor telepon"
          />
        </div>
      </CardContent>
    </Card>
  );
}