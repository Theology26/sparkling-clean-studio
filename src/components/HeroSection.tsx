import heroBg from "@/assets/hero-bg.jpg";
import { Sparkles } from "lucide-react";

const HeroSection = () => (
  <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <img src={heroBg} alt="Sparkling Cleaners Malang" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
    <div className="absolute inset-0" style={{ background: "var(--hero-gradient)" }} />

    <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl animate-fade-up pt-16">
      <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 backdrop-blur-sm px-4 py-1.5 mb-6 border border-accent/30">
        <Sparkles size={16} className="text-accent" />
        <span className="text-sm font-medium text-primary-foreground/90">Sparkling Cleaners Malang</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-tight mb-5">
        Spesialis Perawatan Sepatu, Tas, Helm & Karpet
      </h1>

      <p className="text-base sm:text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
        Layanan cuci & perawatan profesional untuk barang kesayangan Anda. Bersih, wangi, dan seperti baru lagi!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="#booking" className="rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-accent-foreground shadow-lg hover:brightness-110 transition">
          Booking Sekarang
        </a>
        <a href="#tracking" className="rounded-xl glass-dark px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition">
          Lacak Pesanan
        </a>
      </div>
    </div>
  </section>
);

export default HeroSection;
