-- Clean legacy product names that are raw URLs: derive a readable name from the URL slug.
-- e.g. "https://lumiedibles.com/products/cocodates" -> "Cocodates"
DO $$
DECLARE
  p RECORD;
  v_name text;
BEGIN
  FOR p IN SELECT id, name FROM public.products WHERE name ~* '^https?://' LOOP
    v_name := regexp_replace(p.name, '^https?://', '');
    v_name := regexp_replace(v_name, '\?.*$', '');            -- strip query
    v_name := regexp_replace(v_name, '/+$', '');              -- strip trailing slash
    IF v_name ~ '/' THEN
      v_name := regexp_replace(v_name, '^.*/', '');           -- last path segment
    ELSE
      v_name := regexp_replace(v_name, '^www\.', '');         -- bare domain
      v_name := split_part(v_name, '.', 1);
    END IF;
    v_name := regexp_replace(v_name, '\.[a-z0-9]+$', '', 'i'); -- strip extension
    v_name := trim(regexp_replace(v_name, '[-_]+', ' ', 'g'));
    IF length(v_name) < 2 THEN CONTINUE; END IF;
    v_name := initcap(v_name);
    BEGIN
      UPDATE public.products SET name = v_name, url = coalesce(url, p.name) WHERE id = p.id;
    EXCEPTION WHEN unique_violation THEN
      -- A product with this name already exists for the user; keep the URL name rather than merge silently.
      NULL;
    END;
  END LOOP;
END $$;
