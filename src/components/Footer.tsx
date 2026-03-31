import { Sparkles, Instagram, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary py-10">
    <div className="container mx-auto px-4 text-center">
      <a href="#hero" className="inline-flex items-center gap-2 text-primary-foreground font-bold text-lg mb-3">
        <Sparkles size={22} className="text-accent" />
        Sparkling Cleaners Malang
      </a>
      <p className="text-primary-foreground/60 text-sm mb-5">Kebersihan Barang Anda, Prioritas Kami.</p>

      <div className="flex items-center justify-center gap-3 mb-6">
        {[Instagram, Phone].map((Icon, i) => (
          <a key={i} href="#" className="rounded-full bg-primary-foreground/10 p-2.5 text-primary-foreground/70 hover:bg-primary-foreground/20 transition">
            <Icon size={18} />
          </a>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-primary-foreground/40">
        <span>&copy; 2024 Sparkling Cleaners Malang</span>
        <a href="/admin" className="hover:text-primary-foreground/60 transition">Admin</a>
      </div>
    </div>
  </footer>
);

export default Footer;
