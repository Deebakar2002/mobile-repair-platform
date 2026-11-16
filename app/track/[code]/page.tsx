"use client";

import { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Wrench, PackageCheck, Home, Bell } from "lucide-react";

const STAGES = [
  { id: 0, title: "Booking Confirmed", desc: "Your time slot is reserved with our technician.", icon: CheckCircle2 },
  { id: 1, title: "Device Checked In", desc: "Diagnostics completed at the repair bench.", icon: Clock },
  { id: 2, title: "In Repair", desc: "Technician is installing replacement parts & testing.", icon: Wrench },
  { id: 3, title: "Ready for Pickup", desc: "Quality check passed! Ready for collection.", icon: PackageCheck },
];

function TrackingContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = (params.code as string) || "FIX-4821";
  const device = searchParams.get("device") || "iPhone 15 Pro";
  const service = searchParams.get("service") || "Screen Replacement";
  const price = searchParams.get("price") || "299";
  const date = searchParams.get("date") || "Today";
  const slot = searchParams.get("slot") || "10:00 AM";
  const name = searchParams.get("name") || "Customer";

  // Interactive demo state so the client can simulate status updates during prototype review
  const [currentStage, setCurrentStage] = useState<number>(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-base font-bold">Live Repair Tracker</h1>
            <p className="text-xs text-slate-500">Reference: {code}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/")} className="gap-1.5">
            <Home className="h-4 w-4" /> Home
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        {/* Confirmation Banner */}
        <Card className="border-emerald-200 bg-emerald-50/70 shadow-sm">
          <CardContent className="flex items-start gap-3 pt-5">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
            <div>
              <h2 className="font-bold text-emerald-950">Booking Confirmed, {name}!</h2>
              <p className="text-xs text-emerald-800">
                Confirmation SMS & email sent. Bookmark this page to track your repair live.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Timeline */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Repair Progress</CardTitle>
              <Badge>{STAGES[currentStage].title}</Badge>
            </div>
            <CardDescription>
              {device} • {service} (${price} NZD)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isCompleted = index <= currentStage;
              const isCurrent = index === currentStage;
              return (
                <div key={stage.id} className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      isCompleted
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                        {stage.title}
                      </p>
                      {isCurrent && (
                        <Badge variant="secondary" className="text-[10px]">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{stage.desc}</p>
                  </div>
                </div>
              );
            })}

            {/* Prototype Interactive Simulator */}
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Bell className="h-3.5 w-3.5" /> Prototype Demo: Simulate Technician Status Update
              </p>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <Button
                    key={s.id}
                    size="sm"
                    variant={currentStage === s.id ? "default" : "outline"}
                    onClick={() => setCurrentStage(s.id)}
                  >
                    {s.title}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Info */}
        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-between py-4 text-sm">
            <span className="text-slate-500">Scheduled Drop-off</span>
            <span className="font-semibold">
              {date} at {slot}
            </span>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-slate-500">Loading tracking status...</div>}>
      <TrackingContent />
    </Suspense>
  );
}