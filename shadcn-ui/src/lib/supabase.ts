import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lbbbefuxddhxvibjmtuh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYmJlZnV4ZGRoeHZpYmptdHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5Mjk2MTUsImV4cCI6MjA3ODUwNTYxNX0.auvpFOlERbSY2GNZmOcHx3NDnl6UGbRsnUDnelj3tU0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TABLE_NAME = 'app_d799d0ed4d_assessments';

// Fixed user_id for all devices - everyone shares the same data
const GLOBAL_USER_ID = 'admin_user_001';

export interface Assessment {
  id: string;
  user_id: string;
  date: string;
  demographic: {
    nama: string;
    usia: string;
    jenisKelamin: string;
    alamat?: string;
    noTelepon?: string;
    tinggalDengan?: string;
    pekerjaan?: string;
    statusPernikahan?: string;
    pendidikanTerakhir?: string;
    penyakitKronis?: string[];
    penyakitKronisLainnya?: string;
    lamaPenyakitKronis?: string;
    kontrolRutin?: string;
    frekuensiKontrol?: string;
    kepemilikanAsuransi?: string;
    kepemilikanKendaraan?: string;
    kendalaTransportasi?: string;
    detailKendalaTransportasi?: string;
  };
  aks_scores: Record<string, number>;
  aiks_scores: Record<string, number>;
  barthel_scores: Record<string, number>;
  aks_score: number;
  aiks_score: number;
  barthel_score: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface LocalStorageAssessment {
  id: string;
  date: string;
  demographic: Assessment['demographic'];
  aksScores?: Record<string, number>;
  aks_scores?: Record<string, number>;
  aiksScores?: Record<string, number>;
  aiks_scores?: Record<string, number>;
  barthelScores?: Record<string, number>;
  barthel_scores?: Record<string, number>;
  aksScore?: number;
  aks_score?: number;
  aiksScore?: number;
  aiks_score?: number;
  barthelScore?: number;
  barthel_score?: number;
  status: string;
}

// Helper function to get current user ID - now returns fixed global ID
export const getCurrentUserId = (): string => {
  return GLOBAL_USER_ID;
};

// Fetch all assessments for current user
export const fetchAssessments = async (): Promise<Assessment[]> => {
  const userId = getCurrentUserId();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching assessments:', error);
    throw error;
  }

  return data || [];
};

// Save a new assessment
export const saveAssessment = async (assessment: Omit<Assessment, 'created_at' | 'updated_at'>): Promise<Assessment> => {
  const userId = getCurrentUserId();
  const assessmentData = {
    ...assessment,
    user_id: userId,
  };

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([assessmentData])
    .select()
    .single();

  if (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }

  return data;
};

// Update an existing assessment
export const updateAssessment = async (id: string, assessment: Partial<Assessment>): Promise<Assessment> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(assessment)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating assessment:', error);
    throw error;
  }

  return data;
};

// Delete an assessment
export const deleteAssessment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting assessment:', error);
    throw error;
  }
};

// Migrate localStorage data to Supabase
export const migrateLocalStorageToSupabase = async (): Promise<number> => {
  const localData = localStorage.getItem('assessments');
  if (!localData) return 0;

  try {
    const assessments: LocalStorageAssessment[] = JSON.parse(localData);
    if (!Array.isArray(assessments) || assessments.length === 0) return 0;

    const userId = getCurrentUserId();

    // Check if data already migrated by checking if any of the IDs exist
    const localIds = assessments.map(a => a.id);
    const { data: existingData } = await supabase
      .from(TABLE_NAME)
      .select('id')
      .eq('user_id', userId)
      .in('id', localIds);

    if (existingData && existingData.length > 0) {
      console.log('Data already migrated');
      return 0;
    }

    // Prepare data for insertion
    const dataToInsert = assessments.map((assessment) => ({
      id: assessment.id,
      user_id: userId,
      date: assessment.date,
      demographic: assessment.demographic,
      aks_scores: assessment.aksScores || assessment.aks_scores,
      aiks_scores: assessment.aiksScores || assessment.aiks_scores,
      barthel_scores: assessment.barthelScores || assessment.barthel_scores,
      aks_score: assessment.aksScore || assessment.aks_score,
      aiks_score: assessment.aiksScore || assessment.aiks_score,
      barthel_score: assessment.barthelScore || assessment.barthel_score,
      status: assessment.status,
    }));

    const { error } = await supabase
      .from(TABLE_NAME)
      .insert(dataToInsert);

    if (error) {
      console.error('Error migrating data:', error);
      throw error;
    }

    console.log(`Successfully migrated ${assessments.length} assessments`);
    return assessments.length;
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
};