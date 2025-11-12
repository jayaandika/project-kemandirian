# Website Penilaian Kemandirian - Todo List

## Struktur Aplikasi
Website ini akan memiliki 3 bagian utama dalam satu halaman:

### 1. Data Demografi
- Form dengan checkbox untuk data demografi
- Fields: Nama, Usia, Jenis Kelamin, Alamat, dll

### 2. Penilaian AKS (Aktivitas Kehidupan Sehari-hari)
- Form penilaian dengan skoring
- Interpretasi otomatis berdasarkan skor
- Kategori: Mandi, Berpakaian, Toileting, Berpindah, Kontinensia, Makan

### 3. Penilaian AIKS (Aktivitas Instrumental Kehidupan Sehari-hari)
- Form penilaian dengan skoring
- Interpretasi otomatis berdasarkan skor
- Kategori: Telepon, Belanja, Persiapan Makanan, Rumah Tangga, Laundry, Transportasi, Obat, Keuangan

### 4. Kesimpulan
- Total skor AKS dan AIKS
- Tingkat kemandirian
- Kriteria PJP (Klien PJP / Bukan Klien PJP)

## File yang Perlu Dibuat/Modifikasi:
1. ✅ todo.md - Perencanaan (file ini)
2. ⬜ src/pages/Index.tsx - Halaman utama dengan form penilaian
3. ⬜ src/components/DemographicForm.tsx - Komponen form demografi
4. ⬜ src/components/AKSAssessment.tsx - Komponen penilaian AKS
5. ⬜ src/components/AIKSAssessment.tsx - Komponen penilaian AIKS
6. ⬜ src/components/AssessmentResult.tsx - Komponen hasil/kesimpulan
7. ⬜ index.html - Update title

## Logika Skoring:
- AKS: Setiap item dinilai (mandiri/bantuan/tergantung)
- AIKS: Setiap item dinilai (mandiri/bantuan/tergantung)
- Interpretasi berdasarkan total skor
- Kriteria PJP ditentukan dari tingkat kemandirian