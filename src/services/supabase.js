import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Some features may not work.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Auth helpers
export const auth = {
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // User operations
  createUserProfile: async (userId, profileData) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{ user_id: userId, ...profileData }]);
    return { data, error };
  },

  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId);
    return { data, error };
  },

  // Incident report operations
  createIncidentReport: async (reportData) => {
    const { data, error } = await supabase
      .from('incident_reports')
      .insert([reportData]);
    return { data, error };
  },

  getUserIncidentReports: async (userId) => {
    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  updateIncidentReport: async (reportId, updates) => {
    const { data, error } = await supabase
      .from('incident_reports')
      .update(updates)
      .eq('id', reportId);
    return { data, error };
  },

  // State legal info operations
  getStateLegalInfo: async (state) => {
    const { data, error } = await supabase
      .from('state_legal_info')
      .select('*')
      .eq('state', state)
      .single();
    return { data, error };
  },

  getAllStatesLegalInfo: async () => {
    const { data, error } = await supabase
      .from('state_legal_info')
      .select('*');
    return { data, error };
  }
};

// Storage helpers
export const storage = {
  uploadFile: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  deleteFile: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    return { data, error };
  }
};
