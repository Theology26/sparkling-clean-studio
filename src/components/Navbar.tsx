import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Layanan", href: "#layanan" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Kelebihan", href: "#kelebihan" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "Kontak", href: "#kontak" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <a href="#hero" className="flex items-center gap-2 text-primary font-bold text-xl">
          <Sparkles className="text-accent" size={28} />
          Sparkling Cleaners
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#kontak" className="inline-block rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground hover:brightness-110 transition">
              Pesan Sekarang
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-strong border-t border-border px-4 pb-4">
          <ul className="flex flex-col gap-3 pt-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#kontak" onClick={() => setOpen(false)} className="inline-block rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground hover:brightness-110 transition">
                Pesan Sekarang
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
