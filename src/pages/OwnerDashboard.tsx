import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, Sparkles, Package, ShoppingBag, CheckCircle2, Clock, Plus, Minus, AlertTriangle, BarChart3 } from "lucide-react";

type OrderStatus = "diterima" | "cuci" | "kering" | "finishing" | "siap_ambil";

const statusLabels: Record<OrderStatus, string> = {
  diterima: "Diterima",
  cuci: "Cuci",
  kering: "Kering",
  finishing: "Finishing",
  siap_ambil: "Siap Ambil",
};

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState({ item_name: "", quantity: "", unit: "pcs", min_stock: "5" });
  const [showAddItem, setShowAddItem] = useState(false);

  const { data: orders } = useQuery({
    queryKey: ["owner-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: inventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inventory").select("*").order("item_name");
      if (error) throw error;
      return data as any[];
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("inventory").insert({
        item_name: newItem.item_name,
        quantity: parseInt(newItem.quantity),
        unit: newItem.unit,
        min_stock: parseInt(newItem.min_stock),
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setNewItem({ item_name: "", quantity: "", unit: "pcs", min_stock: "5" });
      setShowAddItem(false);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { error } = await supabase.from("inventory").update({ quantity } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  // Analytics
  const totalOrders = orders?.length ?? 0;
  const statusCounts = orders?.reduce((acc, o) => {
    acc[o.status as OrderStatus] = (acc[o.status as OrderStatus] || 0) + 1;
    return acc;
  }, {} as Record<OrderStatus, number>) ?? {};

  const thisMonth = orders?.filter((o) => {
    const d = new Date(o.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length ?? 0;

  const completedOrders = statusCounts.siap_ambil ?? 0;
  const activeOrders = totalOrders - completedOrders;
  const lowStockItems = inventory?.filter((i) => i.quantity <= i.min_stock) ?? [];

  // Service popularity
  const serviceCounts = orders?.reduce((acc, o) => {
    acc[o.service_name] = (acc[o.service_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) ?? {};
  const topServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="glass-strong border-b border-border sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent" size={20} />
            <span className="font-bold text-primary">Owner Dashboard</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Pesanan", value: totalOrders, icon: ShoppingBag, color: "text-primary" },
            { label: "Bulan Ini", value: thisMonth, icon: BarChart3, color: "text-primary" },
            { label: "Sedang Proses", value: activeOrders, icon: Clock, color: "text-accent-foreground" },
            { label: "Selesai", value: completedOrders, icon: CheckCircle2, color: "text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <div className="glass-strong rounded-xl p-5">
            <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" /> Status Pesanan
            </h2>
            <div className="space-y-2">
              {(Object.keys(statusLabels) as OrderStatus[]).map((status) => {
                const count = statusCounts[status] ?? 0;
                const pct = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className="text-sm text-foreground w-24">{statusLabels[status]}</span>
                    <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-foreground w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Services */}
          <div className="glass-strong rounded-xl p-5">
            <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary" /> Layanan Populer
            </h2>
            {topServices.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada data.</p>
            ) : (
              <div className="space-y-2">
                {topServices.map(([name, count], i) => (
                  <div key={name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">
                      <span className="text-muted-foreground mr-2">#{i + 1}</span>
                      {name}
                    </span>
                    <span className="text-sm font-bold text-primary">{count} order</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inventory Management */}
        <div className="glass-strong rounded-xl p-5 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Package size={18} className="text-primary" /> Stok Bahan Pembersih
            </h2>
            <button onClick={() => setShowAddItem(!showAddItem)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground flex items-center gap-1 hover:bg-primary/90 transition">
              <Plus size={14} /> Tambah Item
            </button>
          </div>

          {lowStockItems.length > 0 && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 mb-4">
              <p className="text-sm font-semibold text-destructive flex items-center gap-1">
                <AlertTriangle size={14} /> Stok Menipis:
              </p>
              <p className="text-xs text-destructive/80 mt-1">
                {lowStockItems.map((i) => `${i.item_name} (${i.quantity} ${i.unit})`).join(", ")}
              </p>
            </div>
          )}

          {showAddItem && (
            <div className="rounded-lg border border-border p-3 mb-4 grid sm:grid-cols-4 gap-2">
              <input value={newItem.item_name} onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })} placeholder="Nama Bahan" className={inputClass} />
              <input type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} placeholder="Jumlah" className={inputClass} />
              <select value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} className={inputClass}>
                <option value="pcs">pcs</option>
                <option value="liter">liter</option>
                <option value="kg">kg</option>
                <option value="botol">botol</option>
              </select>
              <button
                onClick={() => addItemMutation.mutate()}
                disabled={!newItem.item_name || !newItem.quantity || addItemMutation.isPending}
                className="rounded-lg bg-accent px-3 py-2 text-sm font-bold text-accent-foreground hover:brightness-110 transition disabled:opacity-50"
              >
                Simpan
              </button>
            </div>
          )}

          {!inventory?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada data stok.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Bahan</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Stok</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Min</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} className={`border-b border-border/50 ${item.quantity <= item.min_stock ? "bg-destructive/5" : ""}`}>
                      <td className="py-2 text-foreground">{item.item_name}</td>
                      <td className="py-2 text-center font-semibold text-foreground">{item.quantity} {item.unit}</td>
                      <td className="py-2 text-center text-muted-foreground">{item.min_stock}</td>
                      <td className="py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => updateQuantityMutation.mutate({ id: item.id, quantity: Math.max(0, item.quantity - 1) })}
                            className="rounded border border-border p-1 text-muted-foreground hover:text-foreground transition"
                          >
                            <Minus size={12} />
                          </button>
                          <button
                            onClick={() => updateQuantityMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                            className="rounded border border-border p-1 text-muted-foreground hover:text-foreground transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
