import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { user: currentUser } = await auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadUserProfile(currentUser.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setSubscriptionStatus('free');
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const { data: userProfile, error } = await db.getUserProfile(userId);
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading user profile:', error);
        return;
      }

      if (userProfile) {
        setProfile(userProfile);
        setSubscriptionStatus(userProfile.subscription_status || 'free');
      } else {
        // Create initial profile if it doesn't exist
        const newProfile = {
          email: user?.email,
          preferred_language: 'english',
          subscription_status: 'free',
          created_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await db.createUserProfile(userId, newProfile);
        
        if (createError) {
          console.error('Error creating user profile:', createError);
        } else {
          setProfile(createdProfile?.[0] || newProfile);
          setSubscriptionStatus('free');
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signUp(email, password, metadata);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      if (data.user) {
        toast.success('Account created successfully! Please check your email to verify your account.');
        return { success: true, user: data.user };
      }

      return { success: false, error: new Error('Unknown error occurred') };
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      if (data.user) {
        toast.success('Signed in successfully!');
        return { success: true, user: data.user };
      }

      return { success: false, error: new Error('Unknown error occurred') };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      setUser(null);
      setProfile(null);
      setSubscriptionStatus('free');
      toast.success('Signed out successfully!');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) {
      toast.error('You must be signed in to update your profile');
      return { success: false, error: new Error('Not authenticated') };
    }

    try {
      const { data, error } = await db.updateUserProfile(user.id, updates);
      
      if (error) {
        toast.error('Failed to update profile');
        return { success: false, error };
      }

      // Reload profile
      await loadUserProfile(user.id);
      toast.success('Profile updated successfully!');
      return { success: true, data };
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return { success: false, error };
    }
  };

  const updateSubscriptionStatus = (status) => {
    setSubscriptionStatus(status);
    if (profile) {
      setProfile({ ...profile, subscription_status: status });
    }
  };

  const isPremium = () => {
    return subscriptionStatus === 'premium' || subscriptionStatus === 'active';
  };

  const value = {
    user,
    profile,
    loading,
    subscriptionStatus,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateSubscriptionStatus,
    isPremium,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
