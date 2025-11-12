import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface DemographicFormProps {
  data: {
    nama: string;
    usia: string;
    jenisKelamin: string;
    alamat: string;
    noTelepon: string;
    tinggalDengan: string;
    pekerjaan: string;
    statusPernikahan: string;
    pendidikanTerakhir: string;
    penyakitKronis: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function DemographicForm({ data, onChange }: DemographicFormProps) {
  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
        <CardTitle className="text-2xl font-bold text-primary">Data Demografi</CardTitle>
        <p className="text-sm text-gray-600">Informasi dasar pasien</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4">
            <Label htmlFor="nama" className="text-base font-semibold">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama"
              placeholder="Masukkan nama lengkap"
              value={data.nama}
              onChange={(e) => onChange('nama', e.target.value)}
              className="transition-all focus:scale-[1.02]"
            />
          </div>

          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '50ms' }}>
            <Label htmlFor="usia" className="text-base font-semibold">
              Usia <span className="text-red-500">*</span>
            </Label>
            <Input
              id="usia"
              type="number"
              placeholder="Masukkan usia"
              value={data.usia}
              onChange={(e) => onChange('usia', e.target.value)}
              className="transition-all focus:scale-[1.02]"
            />
          </div>
        </div>

        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '100ms' }}>
          <Label className="text-base font-semibold">
            Jenis Kelamin <span className="text-red-500">*</span>
          </Label>
          <RadioGroup value={data.jenisKelamin} onValueChange={(value) => onChange('jenisKelamin', value)}>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="laki-laki" id="laki-laki" />
              <Label htmlFor="laki-laki" className="font-normal cursor-pointer flex-1">
                Laki-laki
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="perempuan" id="perempuan" />
              <Label htmlFor="perempuan" className="font-normal cursor-pointer flex-1">
                Perempuan
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '150ms' }}>
          <Label htmlFor="alamat" className="text-base font-semibold">Alamat</Label>
          <Textarea
            id="alamat"
            placeholder="Masukkan alamat lengkap"
            value={data.alamat}
            onChange={(e) => onChange('alamat', e.target.value)}
            className="transition-all focus:scale-[1.02]"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>
            <Label htmlFor="noTelepon" className="text-base font-semibold">No. Telepon</Label>
            <Input
              id="noTelepon"
              placeholder="Masukkan nomor telepon"
              value={data.noTelepon}
              onChange={(e) => onChange('noTelepon', e.target.value)}
              className="transition-all focus:scale-[1.02]"
            />
          </div>

          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '250ms' }}>
            <Label htmlFor="tinggalDengan" className="text-base font-semibold">Tinggal Dengan</Label>
            <Input
              id="tinggalDengan"
              placeholder="Contoh: Keluarga, Sendiri, Panti"
              value={data.tinggalDengan}
              onChange={(e) => onChange('tinggalDengan', e.target.value)}
              className="transition-all focus:scale-[1.02]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms' }}>
            <Label htmlFor="pekerjaan" className="text-base font-semibold">Pekerjaan</Label>
            <Input
              id="pekerjaan"
              placeholder="Masukkan pekerjaan"
              value={data.pekerjaan}
              onChange={(e) => onChange('pekerjaan', e.target.value)}
              className="transition-all focus:scale-[1.02]"
            />
          </div>

          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '350ms' }}>
            <Label htmlFor="penyakitKronis" className="text-base font-semibold">Penyakit Kronis</Label>
            <Input
              id="penyakitKronis"
              placeholder="Contoh: Diabetes, Hipertensi"
              value={data.penyakitKronis}
              onChange={(e) => onChange('penyakitKronis', e.target.value)}
              className="transition-all focus:scale-[1.02]"
            />
          </div>
        </div>

        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '400ms' }}>
          <Label className="text-base font-semibold">Status Pernikahan</Label>
          <RadioGroup value={data.statusPernikahan} onValueChange={(value) => onChange('statusPernikahan', value)}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="belum-menikah" id="belum-menikah" />
                <Label htmlFor="belum-menikah" className="font-normal cursor-pointer">
                  Belum Menikah
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="menikah" id="menikah" />
                <Label htmlFor="menikah" className="font-normal cursor-pointer">
                  Menikah
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="cerai" id="cerai" />
                <Label htmlFor="cerai" className="font-normal cursor-pointer">
                  Cerai
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="janda-duda" id="janda-duda" />
                <Label htmlFor="janda-duda" className="font-normal cursor-pointer">
                  Janda/Duda
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '450ms' }}>
          <Label className="text-base font-semibold">Pendidikan Terakhir</Label>
          <RadioGroup value={data.pendidikanTerakhir} onValueChange={(value) => onChange('pendidikanTerakhir', value)}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="tidak-sekolah" id="tidak-sekolah" />
                <Label htmlFor="tidak-sekolah" className="font-normal cursor-pointer">
                  Tidak Sekolah
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="sd" id="sd" />
                <Label htmlFor="sd" className="font-normal cursor-pointer">
                  SD
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="smp" id="smp" />
                <Label htmlFor="smp" className="font-normal cursor-pointer">
                  SMP
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="sma" id="sma" />
                <Label htmlFor="sma" className="font-normal cursor-pointer">
                  SMA
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="diploma" id="diploma" />
                <Label htmlFor="diploma" className="font-normal cursor-pointer">
                  Diploma
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="s1" id="s1" />
                <Label htmlFor="s1" className="font-normal cursor-pointer">
                  S1
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="s2" id="s2" />
                <Label htmlFor="s2" className="font-normal cursor-pointer">
                  S2
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="s3" id="s3" />
                <Label htmlFor="s3" className="font-normal cursor-pointer">
                  S3
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}