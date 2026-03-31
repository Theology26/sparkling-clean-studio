import { MapPin, Clock, Phone, Instagram } from "lucide-react";

const ContactSection = () => (
  <section id="kontak" className="py-20">
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Kontak & Lokasi</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Temukan Kami di Malang</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-border h-72 md:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126220.60364755148!2d112.5637697!3d-7.9778384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62822d4ccb12b%3A0x3027a76e35280de0!2sMalang%2C%20Kota%20Malang%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "280px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Sparkling Cleaners Malang"
          />
        </div>

        {/* Info */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8 flex flex-col gap-5">
          {[
            { icon: MapPin, label: "Jl. Soekarno Hatta No. 123, Malang" },
            { icon: Clock, label: "Senin - Sabtu: 08.00 - 20.00 WIB" },
            { icon: Phone, label: "+62 812-3456-7890" },
            { icon: Instagram, label: "@sparklingcleaners.mlg" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3 shrink-0">
                <c.icon size={20} className="text-primary" />
              </div>
              <span className="text-foreground font-medium text-sm">{c.label}</span>
            </div>
          ))}

          <a
            href="#booking"
            className="mt-auto rounded-xl bg-accent px-6 py-3 font-bold text-accent-foreground text-center hover:brightness-110 transition shadow-lg"
          >
            Booking Sekarang
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;
