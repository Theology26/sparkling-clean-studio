import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, RefreshCw, Sparkles } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderStatus = Database["public"]["Enums"]["order_status"];

const statusLabels: Record<OrderStatus, string> = {
  diterima: "Diterima",
  cuci: "Cuci",
  kering: "Kering",
  finishing: "Finishing",
  siap_ambil: "Siap Ambil",
};

const statusColors: Record<OrderStatus, string> = {
  diterima: "bg-muted text-muted-foreground",
  cuci: "bg-primary/10 text-primary",
  kering: "bg-primary/20 text-primary",
  finishing: "bg-accent/20 text-accent-foreground",
  siap_ambil: "bg-green-100 text-green-800",
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  diterima: "cuci",
  cuci: "kering",
  kering: "finishing",
  finishing: "siap_ambil",
  siap_ambil: null,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer_name: "", customer_phone: "", service_name: "", notes: "" });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/admin");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("orders").insert({
        order_code: "TEMP",
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        service_name: form.service_name,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setForm({ customer_name: "", customer_phone: "", service_name: "", notes: "" });
      setShowForm(false);
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="min-h-screen bg-secondary/40">
      {/* Header */}
      <header className="glass-strong border-b border-border sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent" size={20} />
            <span className="font-bold text-primary">Admin Dashboard</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground">Daftar Pesanan</h1>
          <div className="flex gap-2">
            <button onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-orders"] })} className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition">
              <RefreshCw size={16} />
            </button>
            <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground flex items-center gap-1 hover:bg-primary/90 transition">
              <Plus size={16} /> Tambah
            </button>
          </div>
        </div>

        {/* New Order Form */}
        {showForm && (
          <div className="glass-strong rounded-xl p-5 mb-6">
            <h3 className="font-semibold text-foreground mb-3">Pesanan Baru</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="Nama Customer" className={inputClass} />
              <input value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} placeholder="No WA" className={inputClass} />
              <input value={form.service_name} onChange={(e) => setForm({ ...form, service_name: e.target.value })} placeholder="Jenis Layanan" className={inputClass} />
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Catatan" className={inputClass} />
            </div>
            <button
              onClick={() => createOrderMutation.mutate()}
              disabled={!form.customer_name || !form.customer_phone || !form.service_name || createOrderMutation.isPending}
              className="mt-3 rounded-lg bg-accent px-5 py-2 text-sm font-bold text-accent-foreground hover:brightness-110 transition disabled:opacity-50"
            >
              {createOrderMutation.isPending ? "Menyimpan..." : "Simpan Pesanan"}
            </button>
          </div>
        )}

        {/* Orders table */}
        {isLoading ? (
          <p className="text-muted-foreground text-center py-10">Memuat...</p>
        ) : !orders?.length ? (
          <p className="text-muted-foreground text-center py-10">Belum ada pesanan.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const next = nextStatus[order.status];
              return (
                <div key={order.id} className="glass rounded-xl p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">{order.order_code}</span>
                      <h4 className="font-semibold text-foreground">{order.customer_name}</h4>
                      <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{order.service_name} {order.notes ? `• ${order.notes}` : ""}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {next && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: next })}
                        disabled={updateStatusMutation.isPending}
                        className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition disabled:opacity-50"
                      >
                        → {statusLabels[next]}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
