"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEVICES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Wrench, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string>("Apple");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("iphone-15-pro");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  const brands = Array.from(new Set(DEVICES.map((d) => d.brand)));
  const filteredDevices = DEVICES.filter((d) => d.brand === selectedBrand);
  const activeDevice = DEVICES.find((d) => d.id === selectedDeviceId) || filteredDevices[0];
  const activeService = activeDevice?.services.find((s) => s.id === selectedServiceId);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const firstDevice = DEVICES.find((d) => d.brand === brand);
    if (firstDevice) {
      setSelectedDeviceId(firstDevice.id);
      setSelectedServiceId("");
    }
  };

  const handleContinue = () => {
    if (!activeDevice || !activeService) return;
    const params = new URLSearchParams({
      deviceId: activeDevice.id,
      serviceId: activeService.id,
    });
    router.push(`/book/slot?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none">QuickFix Mobile</h1>
              <p className="text-xs text-slate-500">Same-Day Device Repair</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>
            Admin
          </Button>
        </div>
      </header>

      {/* Main Mobile-First Container */}
      <main className="mx-auto max-w-2xl px-4 py-6 pb-28">
        {/* Progress Indicator */}
        <div className="mb-6 flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5 font-semibold text-slate-900">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white">1</span>
            Device & Issue
          </span>
          <div className="h-px flex-1 bg-slate-200 mx-2" />
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600">2</span>
            Time Slot
          </span>
          <div className="h-px flex-1 bg-slate-200 mx-2" />
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600">3</span>
            Confirm
          </span>
        </div>

        {/* Step 1: Select Brand & Model */}
        <Card className="mb-5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Smartphone className="h-5 w-5 text-slate-700" />
              1. Select Your Device
            </CardTitle>
            <CardDescription>Choose your phone brand and model for instant pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Brand Pills */}
            <div className="grid grid-cols-3 gap-2">
              {brands.map((brand) => (
                <Button
                  key={brand}
                  type="button"
                  variant={selectedBrand === brand ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleBrandChange(brand)}
                >
                  {brand}
                </Button>
              ))}
            </div>

            {/* Model Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Device Model</label>
              <Select
                value={activeDevice?.id}
                onValueChange={(val) => {
  if (val) {
    setSelectedDeviceId(val);
    setSelectedServiceId("");
  }
}}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose model" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDevices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Select Repair Service */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wrench className="h-5 w-5 text-slate-700" />
              2. What Needs Fixing?
            </CardTitle>
            <CardDescription>All repairs include a 12-month parts & labor warranty</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeDevice?.services.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-slate-900 bg-slate-900/5 ring-1 ring-slate-900"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{service.name}</h3>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-slate-900" />}
                      </div>
                      <p className="text-xs text-slate-500">{service.description}</p>
                      <div className="pt-1">
                        <Badge variant="secondary" className="text-xs font-normal">
                          <Clock className="mr-1 h-3 w-3" />
                          Est. {service.durationMinutes} mins
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900">${service.price}</span>
                      <p className="text-[11px] text-slate-400">NZD</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Trust Footer Note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>No fix, no fee • Pay in-store after repair is complete</span>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">
              {activeService ? `${activeDevice.name} • ${activeService.name}` : "Select a repair service"}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {activeService ? `$${activeService.price} NZD` : "$0 NZD"}
            </p>
          </div>
          <Button size="lg" disabled={!activeService} onClick={handleContinue} className="gap-2">
            Choose Slot
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}