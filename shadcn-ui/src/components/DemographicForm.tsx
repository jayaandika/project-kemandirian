import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

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
    penyakitKronis: string[];
    penyakitKronisLainnya: string;
    lamaPenyakitKronis: string;
    kontrolRutin: string;
    frekuensiKontrol: string;
    kepemilikanAsuransi: string;
    kepemilikanKendaraan: string;
    kendalaTransportasi: string;
    detailKendalaTransportasi: string;
  };
  onChange: (field: string, value: string | string[]) => void;
}

const penyakitKronisOptions = [
  'Hipertensi',
  'Diabetes Melitus',
  'Riwayat Stroke/Jantung',
  'Gagal Ginjal',
  'Kanker',
  'Penyakit Paru-paru',
  'Lainnya',
];

export default function DemographicForm({ data, onChange }: DemographicFormProps) {
  const handlePenyakitKronisChange = (value: string, checked: boolean) => {
    const currentValues = data.penyakitKronis || [];
    if (checked) {
      onChange('penyakitKronis', [...currentValues, value]);
    } else {
      onChange('penyakitKronis', currentValues.filter((v) => v !== value));
    }
  };

  const hasPenyakitKronis = data.penyakitKronis && data.penyakitKronis.length > 0;
  const hasKendalaTransportasi = data.kendalaTransportasi === 'ya';
  const needsKontrolRutin = data.kontrolRutin === 'ya';
  const hasLainnya = data.penyakitKronis && data.penyakitKronis.includes('Lainnya');

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
        <CardTitle className="text-2xl font-bold text-primary">Data Demografi</CardTitle>
        <p className="text-sm text-gray-600">Informasi dasar pasien</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Informasi Dasar */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Informasi Dasar</h3>
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
        </div>

        {/* Informasi Kesehatan */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Informasi Kesehatan</h3>
          
          <div className="space-y-3">
            <Label className="text-base font-semibold">Penyakit Kronis (dapat memilih lebih dari satu)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {penyakitKronisOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={`penyakit-${option}`}
                    checked={data.penyakitKronis?.includes(option)}
                    onCheckedChange={(checked) => handlePenyakitKronisChange(option, checked as boolean)}
                  />
                  <Label htmlFor={`penyakit-${option}`} className="font-normal cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </div>

            {hasLainnya && (
              <div className="space-y-2 ml-6 animate-in fade-in slide-in-from-left-4">
                <Label htmlFor="penyakitKronisLainnya" className="text-sm">Sebutkan penyakit lainnya:</Label>
                <Input
                  id="penyakitKronisLainnya"
                  placeholder="Sebutkan penyakit kronis lainnya"
                  value={data.penyakitKronisLainnya}
                  onChange={(e) => onChange('penyakitKronisLainnya', e.target.value)}
                  className="transition-all focus:scale-[1.02]"
                />
              </div>
            )}
          </div>

          {hasPenyakitKronis && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
              <Label className="text-base font-semibold">Berapa lama memiliki penyakit kronis?</Label>
              <RadioGroup value={data.lamaPenyakitKronis} onValueChange={(value) => onChange('lamaPenyakitKronis', value)}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="kurang-1-tahun" id="kurang-1-tahun" />
                    <Label htmlFor="kurang-1-tahun" className="font-normal cursor-pointer">
                      {'< 1 tahun'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="1-5-tahun" id="1-5-tahun" />
                    <Label htmlFor="1-5-tahun" className="font-normal cursor-pointer">
                      1-5 tahun
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="5-10-tahun" id="5-10-tahun" />
                    <Label htmlFor="5-10-tahun" className="font-normal cursor-pointer">
                      5-10 tahun
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="lebih-10-tahun" id="lebih-10-tahun" />
                    <Label htmlFor="lebih-10-tahun" className="font-normal cursor-pointer">
                      {'> 10 tahun'}
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-base font-semibold">Apakah membutuhkan kontrol rutin ke RS atau Puskesmas?</Label>
            <RadioGroup value={data.kontrolRutin} onValueChange={(value) => onChange('kontrolRutin', value)}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="ya" id="kontrol-ya" />
                  <Label htmlFor="kontrol-ya" className="font-normal cursor-pointer">
                    Ya
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="tidak" id="kontrol-tidak" />
                  <Label htmlFor="kontrol-tidak" className="font-normal cursor-pointer">
                    Tidak
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {needsKontrolRutin && (
            <div className="space-y-2 ml-6 animate-in fade-in slide-in-from-left-4">
              <Label htmlFor="frekuensiKontrol" className="text-base font-semibold">
                Berapa frekuensi kontrol dan kemana?
              </Label>
              <Textarea
                id="frekuensiKontrol"
                placeholder="Contoh: Setiap bulan ke Puskesmas Kelurahan"
                value={data.frekuensiKontrol}
                onChange={(e) => onChange('frekuensiKontrol', e.target.value)}
                className="transition-all focus:scale-[1.02]"
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Informasi Asuransi & Transportasi */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Informasi Asuransi & Transportasi</h3>
          
          <div className="space-y-3">
            <Label className="text-base font-semibold">Kepemilikan Asuransi</Label>
            <RadioGroup value={data.kepemilikanAsuransi} onValueChange={(value) => onChange('kepemilikanAsuransi', value)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="bpjs-mandiri" id="bpjs-mandiri" />
                  <Label htmlFor="bpjs-mandiri" className="font-normal cursor-pointer">
                    BPJS Kesehatan Mandiri
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="bpjs-pegawai" id="bpjs-pegawai" />
                  <Label htmlFor="bpjs-pegawai" className="font-normal cursor-pointer">
                    BPJS Kesehatan Pegawai/Pensiunan
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="bpjs-kis" id="bpjs-kis" />
                  <Label htmlFor="bpjs-kis" className="font-normal cursor-pointer">
                    BPJS KIS
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="asuransi-lain" id="asuransi-lain" />
                  <Label htmlFor="asuransi-lain" className="font-normal cursor-pointer">
                    Asuransi Lain
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Kepemilikan Kendaraan</Label>
            <RadioGroup value={data.kepemilikanKendaraan} onValueChange={(value) => onChange('kepemilikanKendaraan', value)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="mobil" id="kendaraan-mobil" />
                  <Label htmlFor="kendaraan-mobil" className="font-normal cursor-pointer">
                    Memiliki Mobil
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="motor" id="kendaraan-motor" />
                  <Label htmlFor="kendaraan-motor" className="font-normal cursor-pointer">
                    Memiliki Sepeda Motor
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="mobil-motor" id="kendaraan-mobil-motor" />
                  <Label htmlFor="kendaraan-mobil-motor" className="font-normal cursor-pointer">
                    Memiliki Mobil dan Sepeda Motor
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="tidak-memiliki" id="kendaraan-tidak" />
                  <Label htmlFor="kendaraan-tidak" className="font-normal cursor-pointer">
                    Tidak Memiliki
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Apakah ada kendala transportasi?</Label>
            <RadioGroup value={data.kendalaTransportasi} onValueChange={(value) => onChange('kendalaTransportasi', value)}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="ya" id="kendala-ya" />
                  <Label htmlFor="kendala-ya" className="font-normal cursor-pointer">
                    Ya
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="tidak" id="kendala-tidak" />
                  <Label htmlFor="kendala-tidak" className="font-normal cursor-pointer">
                    Tidak
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {hasKendalaTransportasi && (
            <div className="space-y-2 ml-6 animate-in fade-in slide-in-from-left-4">
              <Label htmlFor="detailKendalaTransportasi" className="text-base font-semibold">
                Sebutkan kendala transportasi:
              </Label>
              <Textarea
                id="detailKendalaTransportasi"
                placeholder="Jelaskan kendala transportasi yang dihadapi"
                value={data.detailKendalaTransportasi}
                onChange={(e) => onChange('detailKendalaTransportasi', e.target.value)}
                className="transition-all focus:scale-[1.02]"
                rows={3}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}