import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Send, MapPin, Truck, User } from "lucide-react";

const ADMIN_WA = "6281234567890";

type DeliveryMethod = "antar" | "jemput";

const BookingSection = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    notes: "",
    delivery: "antar" as DeliveryMethod,
    address: "",
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, price")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedService = services?.find((s) => s.id === form.service);
    const serviceName = selectedService?.name ?? form.service;
    const deliveryLabel = form.delivery === "jemput" ? "Dijemput" : "Antar Sendiri";

    const message = encodeURIComponent(
      `Halo Sparkling Cleaners Malang! 🧼\n\nSaya ingin booking layanan:\n\n` +
        `📋 *Nama:* ${form.name}\n` +
        `📱 *No WA:* ${form.phone}\n` +
        `🧹 *Layanan:* ${serviceName}\n` +
        `🚚 *Metode:* ${deliveryLabel}\n` +
        (form.delivery === "jemput" ? `📍 *Alamat:* ${form.address}\n` : "") +
        `📝 *Catatan:* ${form.notes || "-"}\n\n` +
        `Mohon konfirmasi dan info ${form.delivery === "jemput" ? "penjemputan" : "selanjutnya"}. Terima kasih! 🙏`
    );

    window.open(`https://wa.me/${ADMIN_WA}?text=${message}`, "_blank");
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

  return (
    <section id="booking" className="py-20 bg-secondary/40">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
            Booking
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Pesan Layanan via WhatsApp
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Isi form di bawah, lalu langsung terhubung ke admin kami
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-strong rounded-2xl p-6 sm:p-8 flex flex-col gap-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Nama Lengkap"
            className={inputClass}
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Nomor WhatsApp (08xxx)"
            className={inputClass}
          />
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Pilih Jenis Layanan</option>
            {services?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — Rp {s.price.toLocaleString("id-ID")}
              </option>
            ))}
          </select>

          {/* Delivery method */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Metode Pengiriman</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, delivery: "antar", address: "" })}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                  form.delivery === "antar"
                    ? "border-primary bg-primary/10 text-primary shadow-md"
                    : "border-border bg-background/60 text-muted-foreground hover:border-primary/40"
                }`}
              >
                <User size={18} />
                Antar Sendiri
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, delivery: "jemput" })}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                  form.delivery === "jemput"
                    ? "border-primary bg-primary/10 text-primary shadow-md"
                    : "border-border bg-background/60 text-muted-foreground hover:border-primary/40"
                }`}
              >
                <Truck size={18} />
                Dijemput
              </button>
            </div>
          </div>

          {/* Address field - shown when pickup selected */}
          {form.delivery === "jemput" && (
            <div className="animate-fade-up">
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60"
                />
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Alamat lengkap untuk penjemputan"
                  className={`${inputClass} pl-11`}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                Sertakan nama jalan, nomor rumah, dan patokan lokasi
              </p>
            </div>
          )}

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Catatan tambahan (opsional)"
            rows={3}
            className={inputClass}
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold text-accent-foreground hover:brightness-110 transition shadow-lg"
          >
            <Send size={18} />
            Kirim via WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingSection;
