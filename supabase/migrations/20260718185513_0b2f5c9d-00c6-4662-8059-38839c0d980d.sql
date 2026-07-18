DO $$
DECLARE
  p RECORD;
  v_name text;
BEGIN
  FOR p IN SELECT id, name FROM public.products WHERE name ~* '^https?://' LOOP
    v_name := regexp_replace(p.name, '^https?://', '');
    v_name := regexp_replace(v_name, '\?.*$', '');
    v_name := regexp_replace(v_name, '/+$', '');
    IF v_name ~ '/' THEN
      v_name := regexp_replace(v_name, '^.*/', '');
    ELSE
      v_name := regexp_replace(v_name, '^www\.', '');
      v_name := split_part(v_name, '.', 1);
    END IF;
    v_name := regexp_replace(v_name, '\.[a-z0-9]+$', '', 'i');
    v_name := trim(regexp_replace(v_name, '[-_]+', ' ', 'g'));
    IF length(v_name) < 2 THEN CONTINUE; END IF;
    v_name := initcap(v_name);
    BEGIN
      UPDATE public.products SET name = v_name, url = coalesce(url, p.name) WHERE id = p.id;
    EXCEPTION WHEN unique_violation THEN
      NULL;
    END;
  END LOOP;
END $$;