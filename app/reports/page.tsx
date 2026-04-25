"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Download, TrendingUp, BarChart3, Calendar, FileSpreadsheet, FileText,
  ArrowUpRight, IndianRupee, Package,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { stockTrendsData } from "@/lib/snack-mock-data";

const revenueData = [
  { month: "Nov", revenue: 42000 },
  { month: "Dec", revenue: 58000 },
  { month: "Jan", revenue: 51000 },
  { month: "Feb", revenue: 67000 },
  { month: "Mar", revenue: 73000 },
  { month: "Apr", revenue: 84200 },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader title="Reports" breadcrumbs={[{ title: "Analytics" }, { title: "Reports" }]} />

      <main className="flex-1 p-3 space-y-3">
        {/* ── Header ── */}
        <div className="page-section-header animate-in-slide-up">
          <div>
            <h1 className="page-title">Analytics & Insights</h1>
            <p className="page-subtitle">Comprehensive overview of supply chain and order performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md">
              <Calendar className="h-3.5 w-3.5 text-primary" /> This Year
            </Button>
            <Button size="sm" className="h-9 gap-1.5 bg-primary hover:bg-primary/90 text-white rounded-md shadow-sm shadow-primary/20">
              <Download className="h-3.5 w-3.5" /> Full Report
            </Button>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-in-slide-up [animation-delay:50ms]">
          <div className="stat-card"><div className="stat-icon bg-blue-50"><IndianRupee className="h-5 w-5 text-primary" /></div><div><p className="stat-label">Total Revenue</p><p className="stat-value text-xl">INR 5.4L</p><p className="stat-change-up">+22% YoY</p></div></div>
          <div className="stat-card"><div className="stat-icon bg-emerald-50"><TrendingUp className="h-5 w-5 text-emerald-600" /></div><div><p className="stat-label">Monthly Growth</p><p className="stat-value text-xl">18%</p><p className="stat-change-up">+6% vs last mo.</p></div></div>
          <div className="stat-card"><div className="stat-icon bg-orange-50"><Package className="h-5 w-5 text-orange-500" /></div><div><p className="stat-label">Units Sold</p><p className="stat-value text-xl">12.8K</p><p className="stat-change-up">+5% this week</p></div></div>
          <div className="stat-card"><div className="stat-icon bg-violet-50"><BarChart3 className="h-5 w-5 text-violet-600" /></div><div><p className="stat-label">Avg. Order Value</p><p className="stat-value text-xl">INR 2,840</p><p className="stat-change-up">+9% this month</p></div></div>
        </div>

        {/* ── Charts ── */}
        <div className="grid gap-3 md:grid-cols-2 animate-in-slide-up [animation-delay:100ms]">
          {/* Monthly Revenue */}
          <Card className="surface">
            <CardHeader className="surface-header flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-[14px] font-semibold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" /> Revenue Growth
                </CardTitle>
                <CardDescription className="text-[12px] text-slate-400 mt-0.5">Month-over-month order performance</CardDescription>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-700">+22%</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 8px 20px -4px rgba(0,0,0,0.08)", fontSize: 12 }} itemStyle={{ color: "#10b981" }} labelStyle={{ color: "#64748b", marginBottom: 4 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#gRev)" dot={false} activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Stock Inflow */}
          <Card className="surface">
            <CardHeader className="surface-header flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-[14px] font-semibold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" /> Monthly Stock Inflow
                </CardTitle>
                <CardDescription className="text-[12px] text-slate-400 mt-0.5">Material acquisition volume per week</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockTrendsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 8px 20px -4px rgba(0,0,0,0.08)", fontSize: 12 }} cursor={{ fill: "rgba(26,157,249,0.04)" }} itemStyle={{ color: "#1a9df9" }} />
                    <Bar dataKey="raw" name="Raw Materials" fill="#1a9df9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

       
      </main>
    </div>
  );
}
