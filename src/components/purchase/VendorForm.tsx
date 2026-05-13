import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Building2, Mail, Phone, Globe, Hash, CreditCard, Clock, MapPin, X } from "lucide-react";

const vendorSchema = z.object({
  name: z.string().min(2, "Vendor name is required"),
  email: z.string().optional(),
  phone: z.string().optional(),
  contactPerson: z.string().optional(),
  website: z.string().optional(),
  taxNumber: z.string().optional(),
  currency: z.string().min(1),
  paymentTerms: z.number().min(0),
  billingAddressLine1: z.string().optional(),
  billingAddressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
  status: z.string().min(1)
});

type VendorFormValues = z.infer<typeof vendorSchema>;

interface VendorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: any;
  onSuccess: () => void;
}

export function VendorForm({ open, onOpenChange, vendor, onSuccess }: VendorFormProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      contactPerson: "",
      website: "",
      taxNumber: "",
      currency: "USD",
      paymentTerms: 30,
      billingAddressLine1: "",
      billingAddressLine2: "",
      city: "",
      state: "",
      country: "",
      postcode: "",
      status: "Active"
    }
  });

  useEffect(() => {
    if (vendor) {
      reset({
        name: vendor.name || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        contactPerson: vendor.contactPerson || "",
        website: vendor.website || "",
        taxNumber: vendor.taxNumber || "",
        currency: vendor.currency || "USD",
        paymentTerms: vendor.paymentTerms || 30,
        billingAddressLine1: vendor.billingAddressLine1 || "",
        billingAddressLine2: vendor.billingAddressLine2 || "",
        city: vendor.city || "",
        state: vendor.state || "",
        country: vendor.country || "",
        postcode: vendor.postcode || "",
        status: vendor.status || "Active"
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        contactPerson: "",
        website: "",
        taxNumber: "",
        currency: "USD",
        paymentTerms: 30,
        billingAddressLine1: "",
        billingAddressLine2: "",
        city: "",
        state: "",
        country: "",
        postcode: "",
        status: "Active"
      });
    }
  }, [vendor, reset]);

  const onSubmit = async (data: VendorFormValues) => {
    try {
      if (vendor?.id) {
        const res = await api.put(`/vendors/${vendor.id}`, data);
        if (res.success) {
          toast.success("Vendor updated successfully");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(res.message || "Failed to update vendor");
        }
      } else {
        const res = await api.post("/vendors", data);
        if (res.success) {
          toast.success("Vendor created successfully");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(res.message || "Failed to create vendor");
        }
      }
    } catch (error: any) {
      console.error("Vendor save error:", error);
      toast.error(error.message || "Failed to save vendor. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        showCloseButton={false} 
        className="sm:max-w-none w-[92vw] lg:w-[980px] h-[90vh] max-h-[820px] rounded-2xl dark:bg-[#1a1619] dark:border-white/5 overflow-hidden p-0 flex flex-col border-none shadow-2xl z-[100]"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white dark:bg-[#1a1619]">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {vendor ? "Edit Vendor Profile" : "Create New Vendor"}
            </h2>
            <p className="text-slate-500 text-[11px] font-medium mt-1 uppercase tracking-widest italic">Configure supplier details and billing information.</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)} 
            className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-white/10 rounded-full transition-all"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vendor Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input {...register("name")} placeholder="e.g. TechSupplies Ltd" className="h-11 pl-10 rounded-xl border-slate-200 dark:border-white/10 italic" />
                      </div>
                      {errors.name && <p className="text-[10px] text-red-500 italic mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input {...register("email")} placeholder="vendor@example.com" className="h-11 pl-10 rounded-xl border-slate-200 dark:border-white/10 italic" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact Person</Label>
                      <Input {...register("contactPerson")} placeholder="Primary contact name" className="h-11 rounded-xl border-slate-200 dark:border-white/10 italic" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tax Number (GST/VAT)</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input {...register("taxNumber")} placeholder="Tax ID" className="h-11 pl-10 rounded-xl border-slate-200 dark:border-white/10 font-mono" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Payment Terms (Days)</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input type="number" {...register("paymentTerms", { valueAsNumber: true })} className="h-11 pl-10 rounded-xl border-slate-200 dark:border-white/10 font-mono" />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                       <Label className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest block mb-2 underline underline-offset-4 decoration-emerald-500/20">Billing Address</Label>
                       <div className="space-y-4">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase">Address Line 1</Label>
                            <Input {...register("billingAddressLine1")} placeholder="Street address, P.O. box" className="h-11 rounded-xl border-slate-200 dark:border-white/10 italic" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase">City</Label>
                              <Input {...register("city")} placeholder="City" className="h-11 rounded-xl border-slate-200 dark:border-white/10 italic" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase">Country</Label>
                              <Input {...register("country")} placeholder="United States" className="h-11 rounded-xl border-slate-200 dark:border-white/10 italic" />
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input {...register("phone")} placeholder="+1 555 000 0000" className="h-11 pl-10 rounded-xl border-slate-200 dark:border-white/10 font-mono" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Website URL</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input {...register("website")} placeholder="https://www.vendor.com" className="h-11 pl-10 rounded-xl border-slate-200 dark:border-white/10 italic" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preferred Currency</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                        <Select value={watch("currency")} onValueChange={(val) => setValue("currency", val)}>
                          <SelectTrigger className="h-11 pl-10 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-transparent font-bold italic">
                            <SelectValue placeholder="Select Currency" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200 dark:border-white/10">
                            <SelectItem value="USD" className="italic font-medium">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR" className="italic font-medium">EUR - Euro</SelectItem>
                            <SelectItem value="GBP" className="italic font-medium">GBP - British Pound</SelectItem>
                            <SelectItem value="INR" className="italic font-medium">INR - Indian Rupee</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</Label>
                      <Select value={watch("status")} onValueChange={(val) => setValue("status", val)}>
                        <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-transparent font-bold italic">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 dark:border-white/10">
                          <SelectItem value="Active" className="italic font-medium">Active Supplier</SelectItem>
                          <SelectItem value="Inactive" className="italic font-medium">Inactive / On-Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 pt-2">
                       <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 opacity-0">Address Cont.</Label>
                       <div className="space-y-4">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase">Address Line 2 (Optional)</Label>
                            <Input {...register("billingAddressLine2")} placeholder="Apartment, suite, unit, etc." className="h-11 rounded-xl border-slate-200 dark:border-white/10 italic" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase">State / Province</Label>
                              <Input {...register("state")} placeholder="e.g. California" className="h-11 rounded-xl border-slate-200 dark:border-white/10 italic" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase">Zip / Postcode</Label>
                              <Input {...register("postcode")} placeholder="Zip code" className="h-11 rounded-xl border-slate-200 dark:border-white/10 font-mono uppercase" />
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className="px-6 py-5 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#1a1619] flex items-center justify-end gap-3 shrink-0 relative z-[20]">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="h-11 px-6 rounded-lg font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors italic"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-11 px-8 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : vendor ? "Update Vendor Profile" : "Create Vendor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
