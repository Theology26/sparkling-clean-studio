
-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('diterima', 'cuci', 'kering', 'finishing', 'siap_ambil');

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'owner');

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Only owners can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'owner'));

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'regular',
  description TEXT,
  price INTEGER NOT NULL,
  estimated_days INTEGER NOT NULL DEFAULT 3,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id),
  service_name TEXT NOT NULL,
  notes TEXT,
  status order_status NOT NULL DEFAULT 'diterima',
  photo_before TEXT,
  photo_after TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders are viewable by everyone for tracking" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Admins can insert orders" ON public.orders FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

-- Articles table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles are viewable by everyone" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage articles" ON public.articles FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

-- Testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  review TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published testimonials are viewable by everyone" ON public.testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

-- Triggers
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generate order code function
CREATE OR REPLACE FUNCTION public.generate_order_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_code = 'SC-' || UPPER(SUBSTRING(NEW.id::text, 1, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_order_code BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.generate_order_code();

-- Storage bucket for order photos
INSERT INTO storage.buckets (id, name, public) VALUES ('order-photos', 'order-photos', true);
CREATE POLICY "Order photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'order-photos');
CREATE POLICY "Admins can upload order photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'order-photos');
CREATE POLICY "Admins can update order photos" ON storage.objects FOR UPDATE USING (bucket_id = 'order-photos');
CREATE POLICY "Admins can delete order photos" ON storage.objects FOR DELETE USING (bucket_id = 'order-photos');

-- Seed services data
INSERT INTO public.services (name, category, description, price, estimated_days, icon, sort_order) VALUES
('Cuci Sepatu Regular', 'regular', 'Pembersihan menyeluruh bagian luar sepatu dengan teknik khusus', 35000, 3, 'shoe', 1),
('Cuci Sepatu Deep Clean', 'special', 'Pembersihan mendalam hingga bagian dalam sepatu, termasuk deodorizing', 55000, 4, 'shoe', 2),
('Cuci Tas Regular', 'regular', 'Pembersihan lembut untuk tas berbagai bahan', 40000, 3, 'bag', 3),
('Cuci Tas Premium', 'special', 'Perawatan khusus untuk tas branded/kulit dengan conditioning', 75000, 5, 'bag', 4),
('Cuci Helm Full', 'regular', 'Pembersihan menyeluruh helm termasuk bagian dalam', 30000, 2, 'helmet', 5),
('Cuci Karpet', 'regular', 'Pencucian karpet dengan deep extraction', 50000, 4, 'carpet', 6),
('Repaint Sepatu', 'special', 'Restorasi warna sepatu dengan cat premium', 100000, 7, 'shoe', 7),
('Unyellowing Sole', 'special', 'Mengembalikan warna putih pada sole sepatu yang menguning', 45000, 5, 'shoe', 8);

-- Seed articles
INSERT INTO public.articles (title, content, excerpt, is_published) VALUES
('5 Tips Merawat Sepatu Sneakers Agar Awet', '1. Simpan di tempat kering\n2. Gunakan shoe tree\n3. Bersihkan setelah digunakan\n4. Rotasi pemakaian\n5. Cuci profesional secara berkala', 'Tips penting menjaga sneakers favorit Anda tetap bersih dan awet.', true),
('Cara Merawat Tas Kulit Agar Tidak Cepat Rusak', '1. Jauhkan dari air\n2. Conditioning rutin\n3. Simpan dengan dust bag\n4. Hindari sinar matahari langsung\n5. Isi dengan kertas untuk jaga bentuk', 'Panduan lengkap merawat tas kulit agar tetap awet dan terlihat baru.', true),
('Pentingnya Mencuci Helm Secara Rutin', 'Helm yang kotor bisa menyebabkan bau tidak sedap, iritasi kulit, dan pertumbuhan bakteri. Disarankan mencuci helm minimal sebulan sekali.', 'Ketahui alasan penting mengapa helm harus dicuci secara rutin.', true);

-- Seed testimonials
INSERT INTO public.testimonials (customer_name, rating, review, is_published) VALUES
('Andi Pratama', 5, 'Sepatu Nike AF1 saya jadi seperti baru lagi! Hasilnya luar biasa bersih. Pasti bakal langganan.', true),
('Sari Dewi', 5, 'Tas kulit saya ditangani dengan sangat hati-hati. Hasilnya memuaskan dan wangi. Terima kasih Sparkling Cleaners!', true),
('Rizky Aditya', 4, 'Helm saya bersih total, bagian dalamnya wangi. Proses cepat cuma 2 hari. Recommended!', true),
('Maya Putri', 5, 'Karpet rumah yang sudah kotor banget jadi bersih dan segar. Harga juga terjangkau. Top!', true);
