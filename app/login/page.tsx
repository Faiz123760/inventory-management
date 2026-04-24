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
import { ArrowRight, BarChart3, Boxes, Command, ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 flex items-center animate-in-fade">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="flex flex-col justify-center gap-10 animate-in-slide-up">
          <div className="space-y-6">
            <Badge className="w-fit rounded-full bg-blue-50 text-primary border-blue-100 px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] shadow-sm">
              InventoryPro Enterprise
            </Badge>
            <h1 className="max-w-2xl text-6xl font-extrabold tracking-tight text-slate-900 sm:text-7xl leading-[1.1]">
              The future of <br />
              <span className="text-primary italic">Stock Control.</span>
            </h1>
            <p className="max-w-lg text-xl leading-relaxed text-slate-500 font-medium">
              High-performance operations hub for modern supply chains. Monitor, procure, and analyze with enterprise-grade precision.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: BarChart3, title: "Analytics", desc: "Real-time health metrics" },
              { icon: Boxes, title: "Catalog", desc: "Precision SKU tracking" },
              { icon: ShieldCheck, title: "Security", desc: "Military-grade audits" },
            ].map((item, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-md p-6 rounded-md border border-white shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-500 group">
                <div className="h-10 w-10 rounded-md bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="mt-1 text-[11px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-in-slide-up [animation-delay:200ms]">
          <Card className="bg-white/80 backdrop-blur-xl border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-md overflow-hidden">
            <CardHeader className="space-y-6 p-10 pb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary text-white shadow-lg shadow-blue-200">
                <Command className="h-9 w-9" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">Welcome Back</CardTitle>
                <CardDescription className="text-slate-500 text-lg font-medium">
                  Enter your credentials to continue.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-4 space-y-8">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-slate-500 text-[11px] font-bold uppercase tracking-widest ml-1">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@inventorypro.com" 
                      className="pl-10 h-11 bg-slate-50 border-slate-200 text-slate-900 rounded-md focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <Label htmlFor="password" className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Password</Label>
                    <Link href="#" className="text-[10px] font-bold text-primary hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 text-slate-900 rounded-md focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button asChild className="h-14 w-full mt-2 rounded-md text-base font-bold shadow-xl shadow-blue-100 hover:shadow-2xl transition-all duration-300">
                  <Link href="/dashboard" className="flex items-center justify-center gap-2">
                    Sign In to Portal
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </form>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  <span className="bg-white px-4">New to our platform?</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-500 font-medium">
                  Secure your supply chain today.{" "}
                  <Link href="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

