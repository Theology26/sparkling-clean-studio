import { ShieldCheck, Users, ThumbsUp } from "lucide-react";

const AboutSection = () => (
  <section id="tentang" className="py-24">
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Tentang Kami</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Siapa Kami?</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Sparkling Cleaners adalah tim profesional yang berdedikasi untuk menghadirkan kebersihan terbaik dengan standar tertinggi. Kami percaya bahwa ruangan yang bersih menciptakan kenyamanan dan kebahagiaan.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Dengan pengalaman bertahun-tahun, peralatan modern, dan produk ramah lingkungan, kami memastikan setiap sudut ruangan Anda bersinar sempurna. Kepercayaan, keandalan, dan kepuasan pelanggan adalah prioritas utama kami.
          </p>
        </div>

        <div className="grid gap-4">
          {[
            { icon: ShieldCheck, title: "Terpercaya", desc: "Ratusan pelanggan puas mempercayakan kebersihan kepada kami." },
            { icon: Users, title: "Tim Profesional", desc: "Staf terlatih dan berpengalaman di bidang kebersihan." },
            { icon: ThumbsUp, title: "Kepuasan Terjamin", desc: "Garansi layanan jika hasil tidak sesuai harapan." },
          ].map((item) => (
            <div key={item.title} className="glass rounded-xl p-5 flex items-start gap-4">
              <div className="rounded-lg bg-accent/20 p-2.5 shrink-0">
                <item.icon size={22} className="text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
