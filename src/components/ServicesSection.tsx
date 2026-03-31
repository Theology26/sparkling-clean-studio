import { Home, Building2, HardHat, SprayCan, Sofa } from "lucide-react";

const services = [
  { icon: Home, title: "Pembersihan Rumah", desc: "Layanan pembersihan menyeluruh untuk kenyamanan rumah Anda, dari ruang tamu hingga kamar tidur." },
  { icon: Building2, title: "Pembersihan Kantor", desc: "Lingkungan kerja bersih dan profesional untuk meningkatkan produktivitas tim Anda." },
  { icon: HardHat, title: "Pembersihan Pasca Konstruksi", desc: "Bersihkan debu dan sisa material konstruksi agar ruangan siap digunakan." },
  { icon: SprayCan, title: "Deep Cleaning", desc: "Pembersihan mendalam di setiap sudut ruangan untuk hasil yang maksimal." },
  { icon: Sofa, title: "Cuci Karpet & Sofa", desc: "Perawatan khusus untuk karpet dan sofa agar tetap bersih, wangi, dan awet." },
];

const ServicesSection = () => (
  <section id="layanan" className="py-24 bg-secondary/40">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Layanan Kami</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Solusi Kebersihan untuk Setiap Kebutuhan</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((s) => (
          <div key={s.title} className="glass rounded-2xl p-6 flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform">
            <div className="rounded-xl bg-primary/10 p-3">
              <s.icon size={28} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            <a href="#kontak" className="mt-auto text-sm font-semibold text-primary hover:underline">
              Dapatkan Penawaran →
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
