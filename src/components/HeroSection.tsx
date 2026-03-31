import heroBg from "@/assets/hero-bg.jpg";
import { Sparkles } from "lucide-react";

const HeroSection = () => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
    <div className="absolute inset-0" style={{ background: "var(--hero-gradient)" }} />

    <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl animate-fade-up">
      <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 mb-6">
        <Sparkles size={16} className="text-accent" />
        <span className="text-sm font-medium text-primary-foreground/90">Layanan Pembersihan Profesional</span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
        Kebersihan Tanpa Kompromi untuk Rumah & Kantor Anda
      </h1>

      <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
        Jadikan ruang Anda bersinar dan nyaman dengan layanan pembersihan profesional kami.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#kontak" className="rounded-xl bg-accent px-8 py-3.5 text-base font-bold text-accent-foreground shadow-lg hover:brightness-110 transition">
          Pesan Sekarang
        </a>
        <a href="#layanan" className="rounded-xl border border-primary-foreground/30 px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition">
          Cek Layanan
        </a>
      </div>
    </div>
  </section>
);

export default HeroSection;
