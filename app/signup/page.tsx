"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, CheckCircle2, ShieldCheck, Zap, Globe, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 flex items-center animate-in-fade">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1fr_0.8fr] items-center">
        <div className="flex flex-col justify-center gap-8 animate-in-slide-up">
          <Badge className="w-fit rounded-full bg-blue-50 text-primary border-blue-100 px-4 py-1 font-bold uppercase tracking-wider text-[10px]">
            Join InventoryPro
          </Badge>
          <div className="space-y-6">
            <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-tight">
              Scale your <span className="text-primary">Business</span> with better tools.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600 font-medium">
              Join thousands of businesses optimizing their operations with our high-performance inventory management platform.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Instant Setup</p>
                <p className="text-xs text-slate-500 font-medium">Get up and running in less than 5 minutes.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Global Reach</p>
                <p className="text-xs text-slate-500 font-medium">Manage multiple warehouses across different regions.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Secure by Default</p>
                <p className="text-xs text-slate-500 font-medium">Your data is encrypted and backed up 24/7.</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-white border-slate-200 shadow-2xl rounded-[2rem] overflow-hidden animate-in-slide-up [animation-delay:200ms]">
          <CardHeader className="space-y-6 border-b border-slate-100 bg-slate-50/50 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-blue-200">
              <User className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Create Account</CardTitle>
              <CardDescription className="mt-2 text-slate-500 text-base font-medium">
                Start your 14-day free trial today.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-600 text-xs font-bold uppercase tracking-wider pl-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="pl-10 h-11 bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-primary/20" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-600 text-xs font-bold uppercase tracking-wider pl-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    className="pl-10 h-11 bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-primary/20" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-600 text-xs font-bold uppercase tracking-wider pl-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-primary/20 transition-all" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <div className="h-4 w-4 rounded border border-slate-300 bg-slate-50 flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                </div>
                <p className="text-[10px] font-medium text-slate-500">
                  I agree to the <Link href="#" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
                </p>
              </div>

              <Button asChild className="h-12 w-full mt-2">
                <Link href="/dashboard">
                  Create My Account
                </Link>
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-sm text-slate-500 font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline">Sign in instead</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
