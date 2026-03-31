import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Footprints, ShoppingBag, HardHat, Sparkles } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  shoe: Footprints,
  bag: ShoppingBag,
  helmet: HardHat,
  carpet: Sparkles,
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const ServicesSection = () => {
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const regular = services?.filter((s) => s.category === "regular") ?? [];
  const special = services?.filter((s) => s.category === "special") ?? [];

  const ServiceCard = ({ s }: { s: typeof regular[0] }) => {
    const Icon = iconMap[s.icon ?? ""] ?? Sparkles;
    return (
      <div className="glass rounded-2xl p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-primary/10 p-3">
            <Icon size={24} className="text-primary" />
          </div>
          <span className="text-sm font-bold text-primary">{formatPrice(s.price)}</span>
        </div>
        <h3 className="font-bold text-foreground">{s.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.description}</p>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Est. {s.estimated_days} hari</span>
          <a href="#booking" className="text-xs font-semibold text-accent-foreground bg-accent rounded-md px-3 py-1 hover:brightness-110 transition">
            Pesan
          </a>
        </div>
      </div>
    );
  };

  return (
    <section id="layanan" className="py-20 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Katalog Layanan</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Layanan Regular & Special</h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="h-1 w-8 rounded bg-primary inline-block" /> Regular
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {regular.map((s) => <ServiceCard key={s.id} s={s} />)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="h-1 w-8 rounded bg-accent inline-block" /> Special
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {special.map((s) => <ServiceCard key={s.id} s={s} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
