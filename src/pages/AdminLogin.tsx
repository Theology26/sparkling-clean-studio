import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const redirectByRole = async (userId: string) => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const userRoles = roles?.map((r) => r.role) ?? [];

    if (userRoles.includes("owner")) {
      navigate("/admin/owner");
    } else if (userRoles.includes("admin")) {
      navigate("/admin/dashboard");
    } else {
      setError("Akun Anda tidak memiliki akses admin.");
      await supabase.auth.signOut();
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && event === "SIGNED_IN") {
        await redirectByRole(session.user.id);
      }
    });
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) await redirectByRole(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError("Email atau password salah.");
    }
    setLoading(false);
  };

  const inputClass = "w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/40 px-4">
      <div className="glass-strong rounded-2xl p-8 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="text-accent" size={24} />
          <span className="font-bold text-lg text-primary">Admin Panel</span>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className={inputClass} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className={inputClass} />
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50">
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        <a href="/" className="block text-center text-xs text-muted-foreground mt-4 hover:text-primary transition">
          ← Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
