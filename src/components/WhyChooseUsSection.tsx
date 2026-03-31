import { GraduationCap, Wrench, BadgeCheck, DollarSign, Clock } from "lucide-react";

const reasons = [
  { icon: GraduationCap, title: "Tim Profesional & Terlatih", desc: "Setiap anggota tim kami terlatih dengan standar kebersihan internasional." },
  { icon: Wrench, title: "Peralatan Modern & Aman", desc: "Kami menggunakan peralatan terkini dan produk ramah lingkungan." },
  { icon: BadgeCheck, title: "Garansi Kepuasan", desc: "Jika Anda tidak puas, kami akan membersihkan ulang tanpa biaya tambahan." },
  { icon: DollarSign, title: "Harga Transparan", desc: "Tidak ada biaya tersembunyi. Harga jelas sebelum pekerjaan dimulai." },
  { icon: Clock, title: "Fleksibilitas Waktu", desc: "Jadwal yang fleksibel sesuai kebutuhan dan kenyamanan Anda." },
];

const WhyChooseUsSection = () => (
  <section id="kelebihan" className="py-24 bg-secondary/40">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Kelebihan Kami</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Mengapa Memilih Sparkling Cleaners?</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reasons.map((r) => (
          <div key={r.title} className="glass rounded-2xl p-6 text-center flex flex-col items-center gap-3">
            <div className="rounded-full bg-primary/10 p-4 mb-2">
              <r.icon size={28} className="text-primary" />
            </div>
            <h3 className="font-bold text-foreground">{r.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUsSection;
