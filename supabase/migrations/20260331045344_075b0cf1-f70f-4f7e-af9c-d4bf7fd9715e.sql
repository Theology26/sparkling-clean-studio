
-- Add estimated_completion column to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_completion timestamp with time zone;

-- Create inventory table for cleaning supplies
CREATE TABLE public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pcs',
  min_stock integer NOT NULL DEFAULT 5,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and owners can manage inventory" ON public.inventory
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role));

CREATE POLICY "Inventory viewable by authenticated" ON public.inventory
  FOR SELECT TO authenticated
  USING (true);

-- Trigger for updated_at on inventory
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
