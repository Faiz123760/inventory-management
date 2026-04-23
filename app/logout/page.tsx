"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut as LogOutIcon, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate clearing session
    const timer = setTimeout(() => {
      // Uncomment the line below to auto-redirect
      // router.push("/login");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-in-fade">
      <div className="w-full max-w-md">
        <Card className="bg-white border-slate-200 shadow-2xl rounded-[2rem] overflow-hidden animate-in-slide-up">
          <CardHeader className="text-center space-y-4 pt-10 pb-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-500 shadow-inner">
              <LogOutIcon className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Successfully Logged Out</CardTitle>
              <CardDescription className="text-slate-500 font-medium">
                You have been safely signed out of your account.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8 text-center">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span>Session cleared securely</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>No active connections remaining</span>
              </div>
            </div>

            <div className="space-y-4">
              <Button asChild className="w-full h-12 shadow-lg shadow-blue-100">
                <Link href="/login" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </Button>
              <p className="text-xs text-slate-400 font-medium italic">
                You will be redirected automatically in 5 seconds...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
