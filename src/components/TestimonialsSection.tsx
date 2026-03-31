import { Star } from "lucide-react";

const testimonials = [
  { name: "Rina Susanti", role: "Pemilik Rumah", text: "Rumah saya jadi terasa seperti baru setelah deep cleaning dari Sparkling Cleaners. Sangat puas!" },
  { name: "Budi Hartono", role: "Manajer Kantor", text: "Tim mereka sangat profesional dan tepat waktu. Kantor kami selalu bersih berkat layanan rutin mereka." },
  { name: "Dewi Lestari", role: "Pemilik Apartemen", text: "Harga terjangkau dengan kualitas premium. Karpet dan sofa saya jadi wangi dan bersih sempurna." },
];

const TestimonialsSection = () => (
  <section id="testimoni" className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Testimoni</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Apa Kata Pelanggan Kami</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t) => (
          <div key={t.name} className="glass rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="text-accent fill-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.text}"</p>
            <div className="mt-auto pt-4 border-t border-border">
              <p className="font-semibold text-foreground text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
