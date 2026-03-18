// Hosted endpoint for LLM suggestions (Supabase Edge Function)
export const HOSTED_SUGGESTIONS_ENDPOINT: string | null =
  'https://iwyauvhrwpoqcrlbtsbn.supabase.co/functions/v1/suggest';

// Public anon key for calling Supabase Edge Functions with JWT verification enabled
// This key is safe to use in the browser.
export const SUPABASE_ANON_KEY: string | null =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eWF1dmhyd3BvcWNybGJ0c2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NjAyMTEsImV4cCI6MjA4OTMzNjIxMX0.KJ1vFRUF-Cu-LF7k9Od6YQzD9d4Is5-gep4ITFcpNz4';
