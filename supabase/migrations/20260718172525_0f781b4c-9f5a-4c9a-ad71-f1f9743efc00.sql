-- Pin search_path on the domain-normalization helper (linter: mutable search_path).
CREATE OR REPLACE FUNCTION public._normalize_domain(website text)
RETURNS text LANGUAGE sql IMMUTABLE
SET search_path = public
AS $$
  SELECT NULLIF(
    regexp_replace(
      regexp_replace(lower(coalesce(website,'')), '^https?://', ''),
      '^www\.|/.*$', '', 'g'
    ), ''
  )
$$;