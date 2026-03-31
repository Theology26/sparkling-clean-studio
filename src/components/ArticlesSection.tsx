import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen } from "lucide-react";

const ArticlesSection = () => {
  const { data: articles } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (!articles?.length) return null;

  return (
    <section id="tips" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Tips & Edukasi</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Cara Merawat Barang Kesayangan</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {articles.map((a) => (
            <article key={a.id} className="glass rounded-2xl p-6 flex flex-col gap-3 hover:scale-[1.02] transition-transform">
              <div className="rounded-xl bg-primary/10 p-3 w-fit">
                <BookOpen size={22} className="text-primary" />
              </div>
              <h3 className="font-bold text-foreground leading-snug">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{a.excerpt}</p>
              <details className="text-sm">
                <summary className="text-primary font-semibold cursor-pointer hover:underline">Baca Selengkapnya</summary>
                <div className="mt-3 text-muted-foreground whitespace-pre-line leading-relaxed">{a.content}</div>
              </details>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
