"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Download,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  FileSpreadsheet,
  FileText,
  MousePointer2
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { stockTrendsData } from "@/lib/snack-mock-data";

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background animate-in-fade">
      <PageHeader
        title="Business Reports"
        breadcrumbs={[{ title: "Analysis" }, { title: "Reports" }]}
      />

      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 animate-in-slide-up">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-500">Analytics & Insights</h2>
            <p className="text-slate-500 font-medium">Comprehensive overview of your supply chain and order performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4 text-primary" /> This Year
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Full Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 animate-in-slide-up [animation-delay:100ms]">
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-7 border-b border-slate-50">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Monthly Stock Inflow
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">Comparison of material acquisition</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <MousePointer2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: '#1e293b' }} />
                    <Bar dataKey="raw" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-7 border-b border-slate-50">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Revenue Growth
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">Order performance over time</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stockTrendsData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: '#1e293b' }} />
                    <Area type="monotone" dataKey="finished" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-primary rounded-2xl p-8 text-white relative overflow-hidden  animate-in-slide-up [animation-delay:200ms]">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Available Downloads</h3>
            <p className="text-blue-50 text-sm mb-8 max-w-md font-medium">Your data is processed daily at 12:00 AM.
              Download standardized formats for auditing and accounting.</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-11 px-6 font-bold rounded-xl backdrop-blur-sm">
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel Inventory
              </Button>
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-11 px-6 font-bold rounded-xl backdrop-blur-sm">
                <FileText className="mr-2 h-4 w-4" /> PDF Financial Summary
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <BarChart3 className="h-48 w-48" />
          </div>
        </div>
      </main>
    </div>
  );
}
