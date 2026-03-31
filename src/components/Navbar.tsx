import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/logo-sparkling.jpeg";

const navLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Layanan", href: "#layanan" },
  { label: "Tracking", href: "#tracking" },
  { label: "Booking", href: "#booking" },
  { label: "Tips", href: "#tips" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "Kontak", href: "#kontak" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <a href="#hero" className="flex items-center gap-2 text-primary font-bold text-lg">
          <Sparkles className="text-accent" size={24} />
          <span>Sparkling Cleaners</span>
        </a>

        <ul className="hidden lg:flex items-center gap-5">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#booking" className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground hover:brightness-110 transition">
              Booking Sekarang
            </a>
          </li>
        </ul>

        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass-strong border-t border-border px-4 pb-4">
          <ul className="flex flex-col gap-2 pt-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-foreground/70 hover:text-primary">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#booking" onClick={() => setOpen(false)} className="inline-block rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground mt-1">
                Booking Sekarang
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
