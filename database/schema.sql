-- LegalShield AI Database Schema for Supabase
-- Run this SQL in your Supabase SQL editor to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    preferred_language TEXT DEFAULT 'english',
    subscription_status TEXT DEFAULT 'free',
    stripe_customer_id TEXT,
    saved_states TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- State legal information table
CREATE TABLE public.state_legal_info (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    state TEXT NOT NULL UNIQUE,
    state_name TEXT NOT NULL,
    rights_summary JSONB,
    donts JSONB,
    script_english TEXT,
    script_spanish TEXT,
    legal_alerts JSONB,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incident reports table
CREATE TABLE public.incident_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_id TEXT UNIQUE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location TEXT,
    state TEXT,
    city TEXT,
    coordinates JSONB, -- {latitude, longitude}
    scenario TEXT,
    details TEXT,
    audio_blob_url TEXT,
    audio_ipfs_hash TEXT,
    generated_card_url TEXT,
    report_ipfs_hash TEXT,
    shareable_link TEXT,
    is_shared BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions/activity log
CREATE TABLE public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    location_data JSONB
);

-- Legal updates/alerts table
CREATE TABLE public.legal_updates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    state TEXT,
    title TEXT NOT NULL,
    description TEXT,
    update_type TEXT, -- 'law_change', 'court_decision', 'policy_update'
    severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    effective_date DATE,
    source_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    notification_settings JSONB DEFAULT '{"email": true, "push": false, "legal_updates": true}',
    privacy_settings JSONB DEFAULT '{"share_location": false, "anonymous_reports": true}',
    ui_preferences JSONB DEFAULT '{"theme": "dark", "language": "english"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription history table
CREATE TABLE public.subscription_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT,
    status TEXT, -- 'active', 'canceled', 'past_due', 'unpaid'
    plan_name TEXT,
    amount INTEGER, -- in cents
    currency TEXT DEFAULT 'usd',
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_user_id ON public.users(user_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription_status ON public.users(subscription_status);

CREATE INDEX idx_incident_reports_user_id ON public.incident_reports(user_id);
CREATE INDEX idx_incident_reports_timestamp ON public.incident_reports(timestamp);
CREATE INDEX idx_incident_reports_state ON public.incident_reports(state);
CREATE INDEX idx_incident_reports_is_shared ON public.incident_reports(is_shared);

CREATE INDEX idx_legal_updates_state ON public.legal_updates(state);
CREATE INDEX idx_legal_updates_is_active ON public.legal_updates(is_active);
CREATE INDEX idx_legal_updates_effective_date ON public.legal_updates(effective_date);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Incident reports policies
CREATE POLICY "Users can view own incident reports" ON public.incident_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own incident reports" ON public.incident_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incident reports" ON public.incident_reports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own incident reports" ON public.incident_reports
    FOR DELETE USING (auth.uid() = user_id);

-- Allow public read access to shared incident reports
CREATE POLICY "Public can view shared incident reports" ON public.incident_reports
    FOR SELECT USING (is_shared = true);

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Subscription history policies
CREATE POLICY "Users can view own subscription history" ON public.subscription_history
    FOR SELECT USING (auth.uid() = user_id);

-- State legal info and legal updates are publicly readable
ALTER TABLE public.state_legal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view state legal info" ON public.state_legal_info
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view active legal updates" ON public.legal_updates
    FOR SELECT USING (is_active = true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON public.incident_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial state data
INSERT INTO public.state_legal_info (state, state_name, rights_summary, donts, script_english, script_spanish, legal_alerts) VALUES
('CA', 'California', 
 '["You have the right to remain silent", "You have the right to refuse searches without a warrant", "You have the right to ask if you''re free to leave", "You have the right to an attorney"]',
 '["Don''t resist, even if you believe the stop is unfair", "Don''t argue or be confrontational", "Don''t consent to searches", "Don''t provide false information"]',
 'Officer, I am exercising my right to remain silent. I do not consent to any searches. Am I free to leave?',
 'Oficial, estoy ejerciendo mi derecho a permanecer en silencio. No consiento a ningún registro. ¿Soy libre de irme?',
 '["New body camera requirements for all traffic stops", "Updated police accountability measures effective 2024"]'),

('NY', 'New York',
 '["You have the right to remain silent", "You have the right to refuse consent to search", "You have the right to ask for a lawyer", "You have the right to record police interactions"]',
 '["Don''t run or resist arrest", "Don''t touch the officer", "Don''t lie or provide false documents", "Don''t consent to vehicle searches"]',
 'I invoke my right to remain silent and my right to an attorney. I do not consent to any search.',
 'Invoco mi derecho a permanecer en silencio y mi derecho a un abogado. No consiento a ningún registro.',
 '["Stop and frisk guidelines updated", "New civilian complaint review process"]'),

('TX', 'Texas',
 '["You have the right to remain silent", "You have the right to refuse consent to search", "You have the right to ask if you''re detained", "You have the right to an attorney"]',
 '["Don''t reach for anything without permission", "Don''t make sudden movements", "Don''t argue about the law", "Don''t consent to searches"]',
 'I am exercising my right to remain silent. I do not consent to searches. Am I being detained?',
 'Estoy ejerciendo mi derecho a permanecer en silencio. No consiento registros. ¿Estoy siendo detenido?',
 '["Open carry laws updated", "New dashboard camera requirements"]'),

('FL', 'Florida',
 '["You have the right to remain silent", "You have the right to refuse searches", "You have the right to record interactions", "You have the right to ask for identification"]',
 '["Don''t interfere with the investigation", "Don''t provide false information", "Don''t consent to searches", "Don''t resist or flee"]',
 'I choose to exercise my right to remain silent. I do not consent to any searches.',
 'Elijo ejercer mi derecho a permanecer en silencio. No consiento a ningún registro.',
 '["Stand Your Ground law clarifications", "New police transparency requirements"]');

-- Create storage buckets (run these in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('incident-reports', 'incident-reports', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('audio-recordings', 'audio-recordings', false);

-- Storage policies (uncomment and run after creating buckets)
-- CREATE POLICY "Users can upload their own incident reports" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'incident-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view their own incident reports" ON storage.objects
--   FOR SELECT USING (bucket_id = 'incident-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can upload their own audio recordings" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'audio-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view their own audio recordings" ON storage.objects
--   FOR SELECT USING (bucket_id = 'audio-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
