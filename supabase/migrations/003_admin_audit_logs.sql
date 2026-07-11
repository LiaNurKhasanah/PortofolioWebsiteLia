CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id serial PRIMARY KEY,
  admin_user text NOT NULL,
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete', 'upload', 'login')),
  table_name text,
  record_id text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin audit logs for service_role"
ON public.admin_audit_logs
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
