import * as XLSX from 'xlsx';
import type { Assessment } from './supabase';

// AKS Questions
const aksQuestions = [
  'Mandi',
  'Berpakaian',
  'Toileting',
  'Berpindah',
  'Kontinensia (BAB/BAK)',
  'Makan/Minum',
];

// AIKS Questions
const aiksQuestions = [
  'Menggunakan telepon',
  'Belanja kebutuhan sehari-hari',
  'Menyiapkan makanan',
  'Melakukan pekerjaan rumah',
  'Mencuci pakaian',
  'Menggunakan transportasi',
  'Minum obat',
  'Mengelola keuangan',
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

export const exportToExcel = (assessments: Assessment[]) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // ========== SHEET 1: RINGKASAN ==========
  const summaryData = [
    ['LAPORAN ASSESSMENT KEMANDIRIAN LANSIA'],
    [''],
    ['No', 'Tanggal', 'Nama', 'Usia', 'Jenis Kelamin', 'Skor AKS', 'Skor AIKS', 'Skor Barthel', 'Status'],
  ];

  assessments.forEach((assessment, index) => {
    summaryData.push([
      index + 1,
      new Date(assessment.date).toLocaleDateString('id-ID'),
      assessment.demographic.nama,
      assessment.demographic.usia,
      assessment.demographic.jenisKelamin,
      assessment.aks_score,
      assessment.aiks_score,
      assessment.barthel_score,
      assessment.status,
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
    { wch: 10 }, // Skor AKS
    { wch: 12 }, // Skor AIKS
    { wch: 12 }, // Skor Barthel
    { wch: 20 }, // Status
  ];

  // Merge cells for title
  wsSummary['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Merge title row
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
      [`PENILAIAN AKS (ACTIVITY OF DAILY LIVING) - ${assessment.demographic.nama}`],
      [''],
      ['No', 'Aktivitas', 'Skor', 'Keterangan'],
    ];

    aksQuestions.forEach((question, qIdx) => {
      const score = assessment.aks_scores[`q${qIdx + 1}`] || 0;
      let keterangan = '';
      if (score === 1) keterangan = 'Mandiri';
      else if (score === 0.5) keterangan = 'Perlu Bantuan';
      else keterangan = 'Tergantung';

      aksData.push([qIdx + 1, question, score, keterangan]);
    });

    aksData.push(['']);
    aksData.push(['TOTAL SKOR AKS', '', assessment.aks_score, '']);
    aksData.push(['STATUS', '', '', assessment.aks_score >= 5 ? 'Mandiri' : 'Ketergantungan']);

    const wsAks = XLSX.utils.aoa_to_sheet(aksData);
    wsAks['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 10 }, { wch: 20 }];
    wsAks['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

    XLSX.utils.book_append_sheet(wb, wsAks, `AKS-${idx + 1}`);
  });

  // ========== SHEET 4: DETAIL PENILAIAN AIKS ==========
  assessments.forEach((assessment, idx) => {
    const aiksData = [
      [`PENILAIAN AIKS (INSTRUMENTAL ACTIVITY OF DAILY LIVING) - ${assessment.demographic.nama}`],
      [''],
      ['No', 'Aktivitas', 'Skor', 'Keterangan'],
    ];

    aiksQuestions.forEach((question, qIdx) => {
      const score = assessment.aiks_scores[`q${qIdx + 1}`] || 0;
      let keterangan = '';
      if (score === 1) keterangan = 'Mandiri';
      else if (score === 0.5) keterangan = 'Perlu Bantuan';
      else keterangan = 'Tergantung';

      aiksData.push([qIdx + 1, question, score, keterangan]);
    });

    aiksData.push(['']);
    aiksData.push(['TOTAL SKOR AIKS', '', assessment.aiks_score, '']);
    aiksData.push(['STATUS', '', '', assessment.aiks_score >= 7 ? 'Mandiri' : 'Ketergantungan']);

    const wsAiks = XLSX.utils.aoa_to_sheet(aiksData);
    wsAiks['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 10 }, { wch: 20 }];
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
    barthelData.push(['TOTAL SKOR BARTHEL', '', assessment.barthel_score, '']);
    
    let statusBarthel = '';
    if (assessment.barthel_score >= 80) statusBarthel = 'Mandiri';
    else if (assessment.barthel_score >= 60) statusBarthel = 'Ketergantungan Ringan';
    else if (assessment.barthel_score >= 40) statusBarthel = 'Ketergantungan Sedang';
    else if (assessment.barthel_score >= 20) statusBarthel = 'Ketergantungan Berat';
    else statusBarthel = 'Ketergantungan Total';
    
    barthelData.push(['STATUS', '', '', statusBarthel]);

    const wsBarthel = XLSX.utils.aoa_to_sheet(barthelData);
    wsBarthel['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 10 }, { wch: 25 }];
    wsBarthel['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

    XLSX.utils.book_append_sheet(wb, wsBarthel, `Barthel-${idx + 1}`);
  });

  // Generate Excel file
  const fileName = `Assessment_Lansia_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};