-- Move unaccent extension out of the public schema (Supabase Security Advisor: "Extension in Public")
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION unaccent SET SCHEMA extensions;
