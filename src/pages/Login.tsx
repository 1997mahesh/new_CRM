import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Quote 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ... Left Pane ... */}
      <div className="hidden lg:flex flex-col bg-slate-900 text-white p-12 justify-between relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-slate-100/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">t</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">tpdCRM</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 max-w-lg"
          >
            <h1 className="text-5xl font-bold leading-tight">
              Manage your business with <span className="text-blue-500">precision.</span>
            </h1>
            <p className="text-slate-400 text-lg">
              The ultimate SaaS CRM + ERP hybrid for modern enterprises. Scalable, secure, and built for growth.
            </p>
            
            <ul className="space-y-4 pt-6">
              {[
                "Advanced Sales Pipeline & Kanban",
                "Automated Financial Workflows",
                "Real-time Inventory Tracking",
                "AI-Powered Insights & Analytics"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl"
        >
          <Quote className="h-10 w-10 text-blue-500 mb-4 opacity-50" />
          <p className="text-xl italic text-slate-200 mb-6 font-light leading-relaxed">
            "tpdCRM transformed how we handle our sales cycle. The pipeline visibility and automated invoicing saved our team 20+ hours a week."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg">
              JD
            </div>
            <div>
              <p className="font-bold text-white">John Doe</p>
              <p className="text-sm text-slate-500 font-medium lowercase">CEO, TechFlow Solutions</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[420px] p-10 bg-white rounded-3xl shadow-premium border border-slate-100"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Access your secure enterprise dashboard</p>
          </div>

          <div className="space-y-6">
            <Button 
              onClick={login}
              className="w-full h-12 bg-white border-2 border-slate-100 hover:bg-slate-50 text-slate-700 rounded-xl font-bold shadow-soft flex items-center justify-center gap-3 transition-all duration-300"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">or traditional access</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  disabled
                  placeholder="admin@tpdcrm.com" 
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  disabled
                  type="password" 
                  placeholder="••••••••" 
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 opacity-50"
                />
              </div>

              <Button disabled className="w-full h-12 bg-slate-200 text-slate-400 rounded-xl font-bold uppercase tracking-widest text-xs">
                Email Sign In (Restricted)
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 leading-relaxed italic">
              Access restricted to authorized personnel only. All activities are monitored and logged for security compliance.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
