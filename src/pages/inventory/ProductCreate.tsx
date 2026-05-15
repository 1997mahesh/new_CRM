import React, { useState, useEffect } from "react";
import { 
  ChevronLeft,
  Save,
  Package,
  Info,
  DollarSign,
  Layers,
  Activity,
  AlertCircle,
  Truck,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    type: "Product",
    categoryId: "",
    unit: "pc",
    description: "",
    costPrice: 0,
    sellingPrice: 0,
    currentStock: 0,
    minimumStock: 10,
    isTracked: true,
    isActive: true,
    warehouseId: ""
  });

  useEffect(() => {
    fetchMetadata();
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchMetadata = async () => {
    try {
      const [catRes, whRes] = await Promise.all([
        api.get("/inventory/categories"),
        api.get("/inventory/warehouses")
      ]);
      setCategories(catRes.data || []);
      setWarehouses(whRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/inventory/products/${id}`);
      if (res.data) {
        setForm({
          name: res.data.name || "",
          sku: res.data.sku || "",
          type: res.data.type || "Product",
          categoryId: res.data.categoryId || "",
          unit: res.data.unit || "pc",
          description: res.data.description || "",
          costPrice: res.data.costPrice || 0,
          sellingPrice: res.data.sellingPrice || 0,
          currentStock: res.data.currentStock || 0,
          minimumStock: res.data.minimumStock || 10,
          isTracked: res.data.isTracked !== false,
          isActive: res.data.isActive !== false,
          warehouseId: res.data.warehouseId || ""
        });
      }
    } catch (err) {
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isEdit) {
        await api.put(`/inventory/products/${id}`, form);
        toast.success("Product updated successfully");
      } else {
        await api.post("/inventory/products", form);
        toast.success("Product created successfully");
      }
      navigate("/inventory/products");
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center font-bold text-slate-400 italic">Unboxing Product Data...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full bg-white dark:bg-white/5 shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white italic">
              {isEdit ? "Edit Product" : "New Product"}
            </h1>
            <p className="text-xs font-medium text-slate-500 italic">
              {isEdit ? `Modifying ${form.name}` : "Create a new item in your inventory catalog."}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black italic gap-2 px-6 rounded-xl shadow-premium h-11"
        >
          {saving ? <Activity className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{isEdit ? "Save Changes" : "Save Product"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600">
                <Info className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 italic">Product Details</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">Product Name *</Label>
                  <Input 
                    value={form.name} 
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                    className="h-11 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-blue-500 font-medium italic"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">SKU (Stock Keeping Unit)</Label>
                  <Input 
                    value={form.sku} 
                    onChange={e => setForm(p => ({ ...p, sku: e.target.value }))}
                    placeholder="e.g. WH-1000XM5"
                    className="h-11 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 font-mono font-bold italic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 font-bold italic">
                      <SelectValue placeholder="Product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">Category</Label>
                  <Select value={form.categoryId} onValueChange={v => setForm(p => ({ ...p, categoryId: v }))}>
                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 font-bold italic">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">Unit</Label>
                  <Select value={form.unit} onValueChange={v => setForm(p => ({ ...p, unit: v }))}>
                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 font-bold italic">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pc">Piece (pc)</SelectItem>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="set">Set</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">Description</Label>
                <Textarea 
                  value={form.description} 
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Tell us more about this product..."
                  className="min-h-[120px] rounded-2xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 font-medium p-4"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600">
                <DollarSign className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 italic">Pricing</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">Purchase Price (Cost)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <Input 
                    type="number"
                    value={form.costPrice} 
                    onChange={e => setForm(p => ({ ...p, costPrice: parseFloat(e.target.value) }))}
                    className="h-11 pl-8 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 font-mono font-bold italic"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">Sale Price</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <Input 
                    type="number"
                    value={form.sellingPrice} 
                    onChange={e => setForm(p => ({ ...p, sellingPrice: parseFloat(e.target.value) }))}
                    className="h-11 pl-8 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 font-mono font-bold italic text-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Inventory & Status */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 italic">Inventory</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold italic text-slate-600 dark:text-slate-300">Track inventory</span>
                </div>
                <Switch 
                  checked={form.isTracked} 
                  onCheckedChange={v => setForm(p => ({ ...p, isTracked: v }))} 
                />
              </div>

              <div className="space-y-1.5 opacity-80">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">Warehouse Location</Label>
                <Select value={form.warehouseId} onValueChange={v => setForm(p => ({ ...p, warehouseId: v }))}>
                    <SelectTrigger className="h-10 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 font-bold italic">
                        <SelectValue placeholder="Primary Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                        {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">Initial Stock</Label>
                  <Input 
                    type="number"
                    disabled={isEdit}
                    value={form.currentStock} 
                    onChange={e => setForm(p => ({ ...p, currentStock: parseInt(e.target.value) }))}
                    className="h-10 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 font-mono font-bold italic"
                  />
                  {isEdit && <p className="text-[10px] text-slate-400 italic px-1 mt-1">Stock is managed via movements</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 italic">Low Stock Threshold</Label>
                  <Input 
                    type="number"
                    value={form.minimumStock} 
                    onChange={e => setForm(p => ({ ...p, minimumStock: parseInt(e.target.value) }))}
                    className="h-10 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 font-mono font-bold italic text-amber-600"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-white/5 dark:bg-[#1C1F26] rounded-2xl shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500">
                <Box className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 italic">Status</h3>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50/30 dark:bg-blue-500/5 rounded-xl border border-blue-100/50 dark:border-transparent">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-bold italic text-blue-600">Active Product</span>
              </div>
              <Switch 
                checked={form.isActive} 
                onCheckedChange={v => setForm(p => ({ ...p, isActive: v }))} 
              />
            </div>
            <p className="text-[10px] text-slate-400 italic mt-3 px-1 leading-relaxed">
              Inactive products are hidden from sales and purchase workflows but remain in inventory reports.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
