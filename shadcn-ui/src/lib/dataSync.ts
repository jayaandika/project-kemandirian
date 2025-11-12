// Data synchronization utilities for export/import functionality

export interface AssessmentData {
  id: string;
  timestamp: string;
  demographic: {
    name: string;
    age: string;
    gender: string;
    address: string;
    education: string;
    maritalStatus: string;
    occupation: string;
    religion: string;
    chronicDiseases: string[];
    otherDisease: string;
    healthInsurance: string;
    phoneNumber: string;
  };
  barthel: {
    feeding: number;
    bathing: number;
    grooming: number;
    dressing: number;
    bowels: number;
    bladder: number;
    toiletUse: number;
    transfers: number;
    mobility: number;
    stairs: number;
    totalScore: number;
    category: string;
  };
}

interface ExportData {
  version: string;
  exportDate: string;
  assessments: AssessmentData[];
  count: number;
}

export const exportAssessments = (): string => {
  try {
    const assessments = localStorage.getItem('assessments');
    if (!assessments) {
      throw new Error('Tidak ada data assessment untuk diekspor');
    }

    const data = JSON.parse(assessments);
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      assessments: data,
      count: data.length,
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting assessments:', error);
    throw error;
  }
};

export const downloadAssessments = () => {
  try {
    const jsonData = exportAssessments();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `assessments-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading assessments:', error);
    throw error;
  }
};

export const validateImportData = (data: unknown): data is ExportData => {
  try {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const exportData = data as Record<string, unknown>;

    if (!exportData.version || !exportData.assessments || !Array.isArray(exportData.assessments)) {
      return false;
    }

    // Validate each assessment has required fields
    for (const assessment of exportData.assessments) {
      if (!assessment.id || !assessment.timestamp || !assessment.demographic || !assessment.barthel) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error validating import data:', error);
    return false;
  }
};

export const importAssessments = (jsonData: string, mergeMode: 'replace' | 'merge' = 'merge'): number => {
  try {
    const importData = JSON.parse(jsonData);

    if (!validateImportData(importData)) {
      throw new Error('Format data tidak valid. Pastikan file yang diimport adalah file export yang benar.');
    }

    const newAssessments = importData.assessments;

    if (mergeMode === 'replace') {
      localStorage.setItem('assessments', JSON.stringify(newAssessments));
      return newAssessments.length;
    } else {
      // Merge mode: combine with existing data, avoiding duplicates
      const existingData = localStorage.getItem('assessments');
      const existingAssessments = existingData ? JSON.parse(existingData) : [];

      const existingIds = new Set(existingAssessments.map((a: AssessmentData) => a.id));
      const uniqueNewAssessments = newAssessments.filter(
        (a: AssessmentData) => !existingIds.has(a.id)
      );

      const mergedAssessments = [...existingAssessments, ...uniqueNewAssessments];
      localStorage.setItem('assessments', JSON.stringify(mergedAssessments));
      
      return uniqueNewAssessments.length;
    }
  } catch (error) {
    console.error('Error importing assessments:', error);
    throw error;
  }
};