import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Hash, 
  Clock, 
  CreditCard, 
  ArrowLeft,
  Edit2,
  FileText,
  History,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Plus,
  RefreshCcw,
  Settings,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { VendorForm } from "@/components/purchase/VendorForm";
import { toast } from "sonner";

export default function VendorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";
  
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/vendors/${id}`);
      setVendor(response.data);
    } catch (error) {
      console.error("Fetch vendor error:", error);
      toast.error("Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800 italic">Vendor Not Found</h2>
        <Button onClick={() => navigate("/purchase/vendors")} variant="outline">
          Back to Vendors
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/purchase/vendors")}
            className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 italic">{vendor.name}</h1>
              <Badge className={cn(
                "text-[9px] font-bold uppercase py-0.5 px-2 border-none h-5 tracking-widest italic shadow-sm",
                vendor.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
              )}>
                {vendor.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Building2 className="h-3.5 w-3.5" />
                <span>{vendor.contactPerson || 'No contact person'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                <span>{vendor.email || 'No email'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsFormOpen(true)}
            className="h-10 px-4 rounded-xl font-bold gap-2"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit Vendor</span>
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-premium gap-2 tracking-wide"
            onClick={() => navigate(`/purchase/orders/new?vendorId=${vendor.id}`)}
          >
            <Plus className="h-4 w-4" />
            <span>New Order</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Orders</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white font-mono italic">{vendor.purchaseOrders?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-600/10 flex items-center justify-center text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Spend</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white font-mono italic">
                ${vendor.purchaseOrders?.reduce((acc: number, po: any) => acc + (po.totalAmount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 dark:bg-orange-600/10 flex items-center justify-center text-orange-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Outstanding</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white font-mono italic">
                ${vendor.bills?.filter((b: any) => b.status !== 'paid').reduce((acc: number, b: any) => acc + (b.balance || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-600/10 flex items-center justify-center text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg. Lead Time</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white font-mono italic">12 Days</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vendor info */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-l-4 border-blue-600 pl-3">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Email</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{vendor.email || 'Not available'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Phone</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{vendor.phone || 'Not available'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Website</p>
                    <a href={vendor.website} target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600 flex items-center gap-1">
                      {vendor.website || 'Not available'}
                      {vendor.website && <ExternalLink className="h-3 w-3" />}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-l-4 border-emerald-600 pl-3">Billing & Tax</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <Hash className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tax Number</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{vendor.taxNumber || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Currency</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{vendor.currency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Payment Terms</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{vendor.paymentTerms} Days</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-l-4 border-orange-600 pl-3">Address</h3>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p>{vendor.billingAddressLine1}</p>
                  {vendor.billingAddressLine2 && <p>{vendor.billingAddressLine2}</p>}
                  <p>{vendor.city}, {vendor.state} {vendor.postcode}</p>
                  <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400 mt-2">{vendor.country}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: History Tabs */}
        <div className="lg:col-span-2">
          <Card className="border-slate-100 dark:border-white/5 bg-white dark:bg-[#211c1f] rounded-2xl shadow-soft overflow-hidden h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start bg-slate-50 dark:bg-white/5 p-4 h-auto rounded-none border-b border-slate-100 dark:border-white/5 gap-2">
                <TabsTrigger value="orders" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-[#1f1a1d] data-[state=active]:shadow-sm">
                  Orders
                </TabsTrigger>
                <TabsTrigger value="bills" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-[#1f1a1d] data-[state=active]:shadow-sm">
                  Bills
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-[#1f1a1d] data-[state=active]:shadow-sm">
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="p-0 m-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                        <th className="px-6 py-4">PO Number</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                      {vendor.purchaseOrders?.map((po: any) => (
                        <tr key={po.id} className="text-xs group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400 italic">#{po.number}</td>
                          <td className="px-6 py-4 text-slate-500">{format(new Date(po.issueDate), 'MMM dd, yyyy')}</td>
                          <td className="px-6 py-4">
                            <Badge className="text-[9px] font-bold uppercase py-0 px-2 rounded-lg bg-slate-100 text-slate-500 border-none italic">
                              {po.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right font-bold font-mono">${po.totalAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                      {(vendor.purchaseOrders?.length || 0) === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No purchase orders found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="bills" className="p-0 m-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                        <th className="px-6 py-4">Bill Number</th>
                        <th className="px-6 py-4">Due Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                      {vendor.bills?.map((bill: any) => (
                        <tr key={bill.id} className="text-xs group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200 italic">#{bill.number}</td>
                          <td className="px-6 py-4 text-slate-500">{format(new Date(bill.dueDate), 'MMM dd, yyyy')}</td>
                          <td className="px-6 py-4">
                            <Badge className={cn(
                              "text-[9px] font-bold uppercase py-0 px-2 rounded-lg border-none italic",
                              bill.status === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                            )}>
                              {bill.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right font-bold font-mono text-slate-900 dark:text-white">${bill.balance.toLocaleString()}</td>
                        </tr>
                      ))}
                      {(vendor.bills?.length || 0) === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No bills found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="p-6">
                <div className="space-y-6">
                  <div className="relative pl-8 border-l border-slate-100 dark:border-white/5 space-y-8">
                    {vendor.activities?.map((activity: any) => (
                      <div key={activity.id} className="relative">
                        <div className="absolute -left-[41px] top-0 h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-600/20 flex items-center justify-center border-4 border-white dark:border-[#211c1f]">
                          {activity.type === 'Created' ? (
                            <CheckCircle2 className="h-3 w-3 text-blue-600" />
                          ) : activity.type === 'Updated' ? (
                            <RefreshCcw className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Clock className="h-3 w-3 text-slate-400" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{activity.message}</p>
                          <p className="text-[10px] text-slate-400">{format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                        </div>
                      </div>
                    ))}
                    {(vendor.activities?.length || 0) === 0 && (
                      <div className="relative">
                         <div className="absolute -left-[41px] top-0 h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-600/20 flex items-center justify-center border-4 border-white dark:border-[#211c1f]">
                          <CheckCircle2 className="h-3 w-3 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Vendor Created</p>
                          <p className="text-[10px] text-slate-400">{format(new Date(vendor.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      <VendorForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        vendor={vendor}
        onSuccess={fetchVendor}
      />
    </div>
  );
}
