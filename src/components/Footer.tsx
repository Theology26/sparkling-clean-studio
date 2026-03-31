import { Sparkles, Instagram, Mail, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary py-12">
    <div className="container mx-auto px-4 text-center">
      <a href="#hero" className="inline-flex items-center gap-2 text-primary-foreground font-bold text-xl mb-4">
        <Sparkles size={24} className="text-accent" />
        Sparkling Cleaners
      </a>
      <p className="text-primary-foreground/70 text-sm mb-6">Kebersihan Anda, Prioritas Kami.</p>

      <div className="flex items-center justify-center gap-4 mb-8">
        {[Instagram, Mail, Phone].map((Icon, i) => (
          <a key={i} href="#" className="rounded-full bg-primary-foreground/10 p-2.5 text-primary-foreground/80 hover:bg-primary-foreground/20 transition">
            <Icon size={18} />
          </a>
        ))}
      </div>

      <p className="text-primary-foreground/50 text-xs">&copy; 2024 Sparkling Cleaners. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
