import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, CheckCircle2, Circle } from "lucide-react";

const steps = [
  { key: "diterima", label: "Diterima" },
  { key: "cuci", label: "Cuci" },
  { key: "kering", label: "Kering" },
  { key: "finishing", label: "Finishing" },
  { key: "siap_ambil", label: "Siap Ambil" },
] as const;

type OrderResult = {
  order_code: string;
  customer_name: string;
  service_name: string;
  status: string;
  created_at: string;
};

const TrackingSection = () => {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    const trimmed = query.trim();
    let result;

    // Search by order code or phone
    if (trimmed.startsWith("SC-") || trimmed.startsWith("sc-")) {
      const { data, error: err } = await supabase
        .from("orders")
        .select("order_code, customer_name, service_name, status, created_at")
        .ilike("order_code", trimmed)
        .maybeSingle();
      if (err) { setError("Terjadi kesalahan."); setLoading(false); return; }
      result = data;
    } else {
      const { data, error: err } = await supabase
        .from("orders")
        .select("order_code, customer_name, service_name, status, created_at")
        .eq("customer_phone", trimmed)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (err) { setError("Terjadi kesalahan."); setLoading(false); return; }
      result = data;
    }

    if (!result) {
      setError("Pesanan tidak ditemukan. Periksa kode order atau nomor WA Anda.");
    } else {
      setOrder(result);
    }
    setLoading(false);
  };

  const currentStepIndex = order ? steps.findIndex((s) => s.key === order.status) : -1;

  return (
    <section id="tracking" className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Tracking</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Lacak Status Pesanan</h2>
          <p className="text-muted-foreground mt-2 text-sm">Masukkan kode order (SC-XXXXXXXX) atau nomor WhatsApp Anda</p>
        </div>

        <div className="glass-strong rounded-2xl p-6 sm:p-8">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="SC-XXXXXXXX atau 08xxxxxxxxxx"
              className="flex-1 rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="rounded-xl bg-primary px-5 py-3 text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Search size={20} />
            </button>
          </div>

          {error && <p className="text-destructive text-sm mt-4 text-center">{error}</p>}

          {order && (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <span><span className="text-muted-foreground">Kode:</span> <span className="font-bold text-foreground">{order.order_code}</span></span>
                <span><span className="text-muted-foreground">Nama:</span> <span className="font-semibold text-foreground">{order.customer_name}</span></span>
                <span><span className="text-muted-foreground">Layanan:</span> <span className="font-semibold text-foreground">{order.service_name}</span></span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
                <div
                  className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />
                {steps.map((step, i) => {
                  const done = i <= currentStepIndex;
                  const active = i === currentStepIndex;
                  return (
                    <div key={step.key} className="relative flex flex-col items-center z-10" style={{ width: `${100 / steps.length}%` }}>
                      {done ? (
                        <CheckCircle2 size={28} className={`${active ? "text-accent" : "text-primary"}`} fill={active ? "hsl(45 95% 55%)" : "hsl(210 70% 45%)"} />
                      ) : (
                        <Circle size={28} className="text-border" />
                      )}
                      <span className={`text-[10px] sm:text-xs mt-2 font-medium text-center ${done ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrackingSection;
