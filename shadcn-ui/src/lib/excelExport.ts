import * as XLSX from 'xlsx';
import type { Assessment } from './supabase';

// AKS Questions - Updated to 9 items
const aksQuestions = [
  { id: 'bab', label: 'Mengendalikan rangsang BAB' },
  { id: 'bak', label: 'Mengendalikan rangsang BAK' },
  { id: 'membersihkanDiri', label: 'Membersihkan diri' },
  { id: 'makanMinum', label: 'Makan minum' },
  { id: 'bergerak', label: 'Bergerak dari kursi roda' },
  { id: 'berjalan', label: 'Berjalan di tempat rata' },
  { id: 'berpakaian', label: 'Berpakaian' },
  { id: 'tangga', label: 'Naik turun tangga' },
  { id: 'mandi', label: 'Mandi' },
];

// AIKS Questions - Updated to 8 items with detailed descriptions
const aiksQuestions = [
  { id: 'telepon', label: 'Menggunakan telepon' },
  { id: 'belanja', label: 'Berbelanja' },
  { id: 'persiapanMakanan', label: 'Menyiapkan makanan' },
  { id: 'rumahTangga', label: 'Mengurus rumah tangga' },
  { id: 'laundry', label: 'Mencuci pakaian' },
  { id: 'transportasi', label: 'Menggunakan transportasi' },
  { id: 'obat', label: 'Minum obat' },
  { id: 'keuangan', label: 'Mengelola keuangan' },
];

// Barthel Index Questions
const barthelQuestions = [
  { key: 'makan', label: 'Makan' },
  { key: 'mandi', label: 'Mandi' },
  { key: 'perawatanDiri', label: 'Perawatan Diri' },
  { key: 'berpakaian', label: 'Berpakaian' },
  { key: 'buangAirBesar', label: 'Buang Air Besar' },
  { key: 'buangAirKecil', label: 'Buang Air Kecil' },
  { key: 'toileting', label: 'Toileting' },
  { key: 'transfer', label: 'Transfer (Berpindah)' },
  { key: 'mobilitas', label: 'Mobilitas' },
  { key: 'tangga', label: 'Naik Turun Tangga' },
];

// Helper function to get AKS interpretation
const getAKSInterpretation = (score: number) => {
  if (score === 20) return 'Mandiri (A) - Bukan PJP';
  if (score >= 12) return 'Ketergantungan Ringan (B) - Bukan PJP';
  if (score >= 9) return 'Ketergantungan Sedang (C) - PJP';
  if (score >= 5) return 'Ketergantungan Sedang (C) - PJP';
  return 'Ketergantungan Total (E) - PJP';
};

// Helper function to get AIKS interpretation
const getAIKSInterpretation = (score: number) => {
  if (score >= 14) return 'Mandiri';
  if (score >= 8) return 'Perlu Bantuan - PJP';
  return 'Tidak Dapat Melakukan Apa-apa - PJP';
};

// Helper function to get AKS score description
const getAKSScoreDescription = (itemId: string, score: number) => {
  const descriptions: Record<string, Record<number, string>> = {
    bab: { 0: 'Inkontinen', 1: 'Kadang inkontinen', 2: 'Kontinen' },
    bak: { 0: 'Inkontinen', 1: 'Kadang inkontinen', 2: 'Kontinen' },
    membersihkanDiri: { 0: 'Perlu bantuan orang lain', 1: 'Mandiri' },
    makanMinum: { 0: 'Tidak mampu', 1: 'Perlu bantuan memotong makanan', 2: 'Mandiri' },
    bergerak: { 0: 'Tidak mampu', 1: 'Perlu banyak bantuan', 2: 'Bantuan minimal' },
    berjalan: { 0: 'Tidak mampu', 1: 'Bisa berjalan dengan bantuan 2 orang', 2: 'Bisa berjalan dengan bantuan 1 orang', 3: 'Mandiri' },
    berpakaian: { 0: 'Tergantung orang lain', 1: 'Sebagian dibantu', 2: 'Mandiri' },
    tangga: { 0: 'Tidak mampu', 1: 'Perlu bantuan', 2: 'Mandiri' },
    mandi: { 0: 'Tergantung orang lain', 1: 'Mandiri' },
  };
  return descriptions[itemId]?.[score] || '-';
};

// Helper function to get AIKS score description
const getAIKSScoreDescription = (itemId: string, score: number) => {
  const descriptions: Record<string, Record<number, string>> = {
    telepon: { 0: 'tidak mampu', 1: 'dengan bantuan', 2: 'mandiri' },
    belanja: { 0: 'tidak mampu', 1: 'perlu ditemani', 2: 'mandiri' },
    persiapanMakanan: { 0: 'tidak mampu', 1: 'hanya menyiapkan bila bahan tersedia', 2: 'mandiri' },
    rumahTangga: { 0: 'tidak mampu', 1: 'ringan saja', 2: 'sedang saja', 3: 'berat' },
    laundry: { 0: 'tidak mampu', 1: 'mandiri' },
    transportasi: { 0: 'tidak mampu', 1: 'perlu ditemani', 2: 'mandiri' },
    obat: { 0: 'tidak mampu', 1: 'mandiri' },
    keuangan: { 0: 'tidak mampu', 1: 'mandiri' },
  };
  return descriptions[itemId]?.[score] || '-';
};

export const exportToExcel = (assessments: Assessment[]) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // ========== SHEET 1: RINGKASAN ==========
  const summaryData = [
    ['LAPORAN ASSESSMENT KEMANDIRIAN LANSIA'],
    [''],
    ['No', 'Tanggal', 'Nama', 'Usia', 'Jenis Kelamin', 'Skor AKS', 'Status AKS', 'Skor AIKS', 'Status AIKS', 'Skor Barthel', 'Status Barthel'],
  ];

  assessments.forEach((assessment, index) => {
    const aksStatus = getAKSInterpretation(assessment.aks_score);
    const aiksStatus = getAIKSInterpretation(assessment.aiks_score);
    
    let barthelStatus = '';
    if (assessment.barthel_score >= 80) barthelStatus = 'Mandiri';
    else if (assessment.barthel_score >= 60) barthelStatus = 'Ketergantungan Ringan';
    else if (assessment.barthel_score >= 40) barthelStatus = 'Ketergantungan Sedang';
    else if (assessment.barthel_score >= 20) barthelStatus = 'Ketergantungan Berat';
    else barthelStatus = 'Ketergantungan Total';

    summaryData.push([
      index + 1,
      new Date(assessment.date).toLocaleDateString('id-ID'),
      assessment.demographic.nama,
      assessment.demographic.usia,
      assessment.demographic.jenisKelamin,
      `${assessment.aks_score} / 20`,
      aksStatus,
      `${assessment.aiks_score} / 16`,
      aiksStatus,
      `${assessment.barthel_score} / 100`,
      barthelStatus,
    ]);
  });

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

  // Set column widths
  wsSummary['!cols'] = [
    { wch: 5 },  // No
    { wch: 12 }, // Tanggal
    { wch: 25 }, // Nama
    { wch: 8 },  // Usia
    { wch: 15 }, // Jenis Kelamin
    { wch: 12 }, // Skor AKS
    { wch: 35 }, // Status AKS
    { wch: 12 }, // Skor AIKS
    { wch: 35 }, // Status AIKS
    { wch: 12 }, // Skor Barthel
    { wch: 25 }, // Status Barthel
  ];

  // Merge cells for title
  wsSummary['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }, // Merge title row
  ];

  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');

  // ========== SHEET 2: DATA DEMOGRAFIS ==========
  assessments.forEach((assessment, idx) => {
    const demoData = [
      [`DATA DEMOGRAFIS - ${assessment.demographic.nama}`],
      [''],
      ['Field', 'Value'],
      ['Nama', assessment.demographic.nama],
      ['Usia', assessment.demographic.usia],
      ['Jenis Kelamin', assessment.demographic.jenisKelamin],
      ['Alamat', assessment.demographic.alamat || '-'],
      ['No. Telepon', assessment.demographic.noTelepon || '-'],
      ['Tinggal Dengan', assessment.demographic.tinggalDengan || '-'],
      ['Pekerjaan', assessment.demographic.pekerjaan || '-'],
      ['Status Pernikahan', assessment.demographic.statusPernikahan || '-'],
      ['Pendidikan Terakhir', assessment.demographic.pendidikanTerakhir || '-'],
      ['Penyakit Kronis', assessment.demographic.penyakitKronis?.join(', ') || '-'],
      ['Penyakit Kronis Lainnya', assessment.demographic.penyakitKronisLainnya || '-'],
      ['Lama Penyakit Kronis', assessment.demographic.lamaPenyakitKronis || '-'],
      ['Kontrol Rutin', assessment.demographic.kontrolRutin || '-'],
      ['Frekuensi Kontrol', assessment.demographic.frekuensiKontrol || '-'],
      ['Kepemilikan Asuransi', assessment.demographic.kepemilikanAsuransi || '-'],
      ['Kepemilikan Kendaraan', assessment.demographic.kepemilikanKendaraan || '-'],
      ['Kendala Transportasi', assessment.demographic.kendalaTransportasi || '-'],
      ['Detail Kendala', assessment.demographic.detailKendalaTransportasi || '-'],
    ];

    const wsDemographic = XLSX.utils.aoa_to_sheet(demoData);
    wsDemographic['!cols'] = [{ wch: 25 }, { wch: 40 }];
    wsDemographic['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

    XLSX.utils.book_append_sheet(wb, wsDemographic, `Demo-${idx + 1}`);
  });

  // ========== SHEET 3: DETAIL PENILAIAN AKS ==========
  assessments.forEach((assessment, idx) => {
    const aksData = [
      [`PENILAIAN AKS (AKTIVITAS KEHIDUPAN SEHARI-HARI) - ${assessment.demographic.nama}`],
      [''],
      ['No', 'Fungsi', 'Skor', 'Keterangan'],
    ];

    aksQuestions.forEach((question, qIdx) => {
      const score = assessment.aks_scores[question.id] || 0;
      const keterangan = getAKSScoreDescription(question.id, score);

      aksData.push([qIdx + 1, question.label, score, keterangan]);
    });

    aksData.push(['']);
    aksData.push(['TOTAL SKOR AKS', '', `${assessment.aks_score} / 20`, '']);
    aksData.push(['STATUS', '', '', getAKSInterpretation(assessment.aks_score)]);
    aksData.push(['']);
    aksData.push(['KRITERIA AKS:', '', '', '']);
    aksData.push(['', 'Skor 20', '', 'Mandiri (A) - Bukan PJP']);
    aksData.push(['', 'Skor 12-19', '', 'Ketergantungan Ringan (B) - Bukan PJP']);
    aksData.push(['', 'Skor 9-11', '', 'Ketergantungan Sedang (C) - PJP']);
    aksData.push(['', 'Skor 5-8', '', 'Ketergantungan Sedang (C) - PJP']);
    aksData.push(['', 'Skor 0-4', '', 'Ketergantungan Total (E) - PJP']);

    const wsAks = XLSX.utils.aoa_to_sheet(aksData);
    wsAks['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 12 }, { wch: 40 }];
    wsAks['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

    XLSX.utils.book_append_sheet(wb, wsAks, `AKS-${idx + 1}`);
  });

  // ========== SHEET 4: DETAIL PENILAIAN AIKS ==========
  assessments.forEach((assessment, idx) => {
    const aiksData = [
      [`PENILAIAN AIKS (AKTIVITAS INSTRUMENTAL KEHIDUPAN SEHARI-HARI) - ${assessment.demographic.nama}`],
      [''],
      ['No', 'Aktivitas', 'Skor', 'Keterangan'],
    ];

    aiksQuestions.forEach((question, qIdx) => {
      const score = assessment.aiks_scores[question.id] || 0;
      const keterangan = getAIKSScoreDescription(question.id, score);

      aiksData.push([qIdx + 1, question.label, score, keterangan]);
    });

    aiksData.push(['']);
    aiksData.push(['TOTAL SKOR AIKS', '', `${assessment.aiks_score} / 16`, '']);
    aiksData.push(['STATUS', '', '', getAIKSInterpretation(assessment.aiks_score)]);
    aiksData.push(['']);
    aiksData.push(['KRITERIA AIKS:', '', '', '']);
    aiksData.push(['', 'Skor 14-16', '', 'Mandiri']);
    aiksData.push(['', 'Skor 8-13', '', 'Perlu Bantuan - PJP']);
    aiksData.push(['', 'Skor 0-7', '', 'Tidak Dapat Melakukan Apa-apa - PJP']);

    const wsAiks = XLSX.utils.aoa_to_sheet(aiksData);
    wsAiks['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 12 }, { wch: 40 }];
    wsAiks['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

    XLSX.utils.book_append_sheet(wb, wsAiks, `AIKS-${idx + 1}`);
  });

  // ========== SHEET 5: DETAIL BARTHEL INDEX ==========
  assessments.forEach((assessment, idx) => {
    const barthelData = [
      [`BARTHEL INDEX - ${assessment.demographic.nama}`],
      [''],
      ['No', 'Aktivitas', 'Skor', 'Keterangan'],
    ];

    barthelQuestions.forEach((question, qIdx) => {
      const score = assessment.barthel_scores[question.key] || 0;
      let keterangan = '';
      
      // Keterangan berdasarkan skor untuk setiap aktivitas
      if (question.key === 'makan') {
        if (score === 10) keterangan = 'Mandiri';
        else if (score === 5) keterangan = 'Perlu Bantuan';
        else keterangan = 'Tergantung';
      } else if (question.key === 'mandi') {
        if (score === 5) keterangan = 'Mandiri';
        else keterangan = 'Tergantung';
      } else if (question.key === 'perawatanDiri') {
        if (score === 5) keterangan = 'Mandiri';
        else keterangan = 'Tergantung';
      } else if (question.key === 'berpakaian') {
        if (score === 10) keterangan = 'Mandiri';
        else if (score === 5) keterangan = 'Perlu Bantuan';
        else keterangan = 'Tergantung';
      } else if (question.key === 'buangAirBesar' || question.key === 'buangAirKecil') {
        if (score === 10) keterangan = 'Kontinen';
        else if (score === 5) keterangan = 'Kadang Inkontinen';
        else keterangan = 'Inkontinen';
      } else if (question.key === 'toileting') {
        if (score === 10) keterangan = 'Mandiri';
        else if (score === 5) keterangan = 'Perlu Bantuan';
        else keterangan = 'Tergantung';
      } else if (question.key === 'transfer') {
        if (score === 15) keterangan = 'Mandiri';
        else if (score === 10) keterangan = 'Bantuan Minimal';
        else if (score === 5) keterangan = 'Perlu Bantuan';
        else keterangan = 'Tergantung';
      } else if (question.key === 'mobilitas') {
        if (score === 15) keterangan = 'Mandiri';
        else if (score === 10) keterangan = 'Bantuan Minimal';
        else if (score === 5) keterangan = 'Kursi Roda';
        else keterangan = 'Immobile';
      } else if (question.key === 'tangga') {
        if (score === 10) keterangan = 'Mandiri';
        else if (score === 5) keterangan = 'Perlu Bantuan';
        else keterangan = 'Tidak Mampu';
      }

      barthelData.push([qIdx + 1, question.label, score, keterangan]);
    });

    barthelData.push(['']);
    barthelData.push(['TOTAL SKOR BARTHEL', '', `${assessment.barthel_score} / 100`, '']);
    
    let statusBarthel = '';
    if (assessment.barthel_score >= 80) statusBarthel = 'Mandiri';
    else if (assessment.barthel_score >= 60) statusBarthel = 'Ketergantungan Ringan';
    else if (assessment.barthel_score >= 40) statusBarthel = 'Ketergantungan Sedang';
    else if (assessment.barthel_score >= 20) statusBarthel = 'Ketergantungan Berat';
    else statusBarthel = 'Ketergantungan Total';
    
    barthelData.push(['STATUS', '', '', statusBarthel]);

    const wsBarthel = XLSX.utils.aoa_to_sheet(barthelData);
    wsBarthel['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 12 }, { wch: 25 }];
    wsBarthel['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

    XLSX.utils.book_append_sheet(wb, wsBarthel, `Barthel-${idx + 1}`);
  });

  // Generate Excel file
  const fileName = `Assessment_Lansia_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};