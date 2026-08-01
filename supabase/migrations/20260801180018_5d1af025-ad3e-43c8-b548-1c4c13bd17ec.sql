GRANT SELECT (
  brand_name, rrp, case_size, gtin, has_liability_insurance, readiness_declarations
) ON public.source_products TO anon;

GRANT SELECT (
  brand_name, rrp, case_size, gtin, has_liability_insurance, readiness_declarations
) ON public.source_products TO authenticated;