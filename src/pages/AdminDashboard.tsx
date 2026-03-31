import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus, RefreshCw, Sparkles, Camera, Calendar, ChevronDown, X, Image } from "lucide-react";

type OrderStatus = "diterima" | "cuci" | "kering" | "finishing" | "siap_ambil";

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

const statusFlow: OrderStatus[] = ["diterima", "cuci", "kering", "finishing", "siap_ambil"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer_name: "", customer_phone: "", service_name: "", notes: "" });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [editingEstimation, setEditingEstimation] = useState<string | null>(null);
  const [estimationDate, setEstimationDate] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: services } = useQuery({
    queryKey: ["services-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("id, name").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const updateEstimationMutation = useMutation({
    mutationFn: async ({ id, estimated_completion }: { id: string; estimated_completion: string }) => {
      const { error } = await supabase.from("orders").update({ estimated_completion } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setEditingEstimation(null);
      setEstimationDate("");
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      let photoUrl: string | null = null;

      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const path = `before/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("order-photos").upload(path, photoFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("order-photos").getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("orders").insert({
        order_code: "TEMP",
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        service_name: form.service_name,
        notes: form.notes || null,
        photo_before: photoUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setForm({ customer_name: "", customer_phone: "", service_name: "", notes: "" });
      setPhotoFile(null);
      setPhotoPreview(null);
      setShowForm(false);
    },
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="min-h-screen bg-secondary/40">
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

        {/* New Order Form with Photo Upload */}
        {showForm && (
          <div className="glass-strong rounded-xl p-5 mb-6">
            <h3 className="font-semibold text-foreground mb-3">Pesanan Baru</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="Nama Customer" className={inputClass} />
              <input value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} placeholder="No WA" className={inputClass} />
              <select value={form.service_name} onChange={(e) => setForm({ ...form, service_name: e.target.value })} className={inputClass}>
                <option value="">Pilih Layanan</option>
                {services?.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Catatan" className={inputClass} />
            </div>

            {/* Photo Upload */}
            <div className="mt-3">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition">
                  <Camera size={16} /> Foto Kondisi Awal
                </button>
                {photoPreview && (
                  <div className="relative">
                    <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover border border-border" />
                    <button onClick={() => { setPhotoFile(null); setPhotoPreview(null); }} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5">
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
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

        {/* Orders List */}
        {isLoading ? (
          <p className="text-muted-foreground text-center py-10">Memuat...</p>
        ) : !orders?.length ? (
          <p className="text-muted-foreground text-center py-10">Belum ada pesanan.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const currentIdx = statusFlow.indexOf(order.status as OrderStatus);
              const nextStatus = currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : null;
              const estimatedCompletion = (order as any).estimated_completion;

              return (
                <div key={order.id} className="glass rounded-xl p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">{order.order_code}</span>
                      <h4 className="font-semibold text-foreground">{order.customer_name}</h4>
                      <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status as OrderStatus]}`}>
                        {statusLabels[order.status as OrderStatus]}
                      </span>
                      {/* Status dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                        className="text-xs rounded border border-border bg-background px-2 py-1 text-foreground"
                      >
                        {statusFlow.map((s) => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{order.service_name}{order.notes ? ` • ${order.notes}` : ""}</p>

                  {/* Photo Before */}
                  {order.photo_before && (
                    <div className="mb-2">
                      <a href={order.photo_before} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        <Image size={12} /> Foto Kondisi Awal
                      </a>
                    </div>
                  )}

                  {/* Estimation */}
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar size={12} />
                      {estimatedCompletion
                        ? `Est: ${new Date(estimatedCompletion).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`
                        : "Belum ada estimasi"
                      }
                    </span>
                    {editingEstimation === order.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="date"
                          value={estimationDate}
                          onChange={(e) => setEstimationDate(e.target.value)}
                          className="text-xs rounded border border-border bg-background px-2 py-1"
                        />
                        <button
                          onClick={() => updateEstimationMutation.mutate({ id: order.id, estimated_completion: new Date(estimationDate).toISOString() })}
                          disabled={!estimationDate}
                          className="text-xs bg-primary text-primary-foreground rounded px-2 py-1 disabled:opacity-50"
                        >
                          Simpan
                        </button>
                        <button onClick={() => setEditingEstimation(null)} className="text-xs text-muted-foreground">Batal</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingEstimation(order.id); setEstimationDate(""); }} className="text-xs text-primary hover:underline">
                        Edit Estimasi
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {nextStatus && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: nextStatus })}
                        disabled={updateStatusMutation.isPending}
                        className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition disabled:opacity-50"
                      >
                        → {statusLabels[nextStatus]}
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
