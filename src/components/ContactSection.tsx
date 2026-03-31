import { useState } from "react";
import { Phone, Mail, MapPin, Instagram, Send } from "lucide-react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", address: "", service: "", date: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Terima kasih! Permintaan Anda telah dikirim. Kami akan segera menghubungi Anda.");
    setForm({ name: "", phone: "", address: "", service: "", date: "" });
  };

  const inputClass = "w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

  return (
    <section id="kontak" className="py-24 bg-secondary/40">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Hubungi Kami</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Pesan Layanan Sekarang</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 flex flex-col gap-4">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Nama Lengkap" className={inputClass} />
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Nomor Telepon" className={inputClass} />
            <input name="address" value={form.address} onChange={handleChange} required placeholder="Alamat" className={inputClass} />
            <select name="service" value={form.service} onChange={handleChange} required className={inputClass}>
              <option value="">Pilih Jenis Layanan</option>
              <option value="rumah">Pembersihan Rumah</option>
              <option value="kantor">Pembersihan Kantor</option>
              <option value="konstruksi">Pasca Konstruksi</option>
              <option value="deep">Deep Cleaning</option>
              <option value="karpet">Cuci Karpet & Sofa</option>
            </select>
            <input name="date" type="date" value={form.date} onChange={handleChange} required className={inputClass} />
            <button type="submit" className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold text-accent-foreground hover:brightness-110 transition shadow-lg">
              <Send size={18} />
              Kirim Permintaan
            </button>
          </form>

          <div className="flex flex-col gap-6 justify-center">
            {[
              { icon: Phone, label: "+62 812 3456 7890" },
              { icon: Mail, label: "info@sparklingcleaners.id" },
              { icon: MapPin, label: "Jl. Kebersihan No. 10, Jakarta" },
              { icon: Instagram, label: "@sparklingcleaners.id" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <c.icon size={22} className="text-primary" />
                </div>
                <span className="text-foreground font-medium">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
