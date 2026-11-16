"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEVICES, TIME_SLOTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
//import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Clock } from "lucide-react";

function SlotSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const deviceId = searchParams.get("deviceId") || "iphone-15-pro";
  const serviceId = searchParams.get("serviceId") || "screen-15p";

  const device = DEVICES.find((d) => d.id === deviceId) || DEVICES[0];
  const service = device.services.find((s) => s.id === serviceId) || device.services[0];

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const handleContinue = () => {
    if (!selectedDate || !selectedSlot) return;
    const params = new URLSearchParams({
      deviceId: device.id,
      serviceId: service.id,
      date: selectedDate.toISOString().split("T")[0],
      slot: selectedSlot,
    });
    router.push(`/book/details?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-base font-bold leading-none">Select Date & Time</h1>
            <p className="text-xs text-slate-500">
              {device.name} • {service.name}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 pb-28">
        {/* Progress Indicator */}
        <div className="mb-6 flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">✓</span>
            Device
          </span>
          <div className="mx-2 h-px flex-1 bg-slate-900" />
          <span className="flex items-center gap-1.5 font-semibold text-slate-900">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white">2</span>
            Time Slot
          </span>
          <div className="mx-2 h-px flex-1 bg-slate-200" />
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600">3</span>
            Confirm
          </span>
        </div>

        {/* Date Picker Card */}
        <Card className="mb-5 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarIcon className="h-5 w-5 text-slate-700" />
              1. Pick a Drop-off Date
            </CardTitle>
            <CardDescription>Select a convenient day for your repair</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Time Slots Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-slate-700" />
              2. Available Time Slots
            </CardTitle>
            <CardDescription>
              Real-time technician availability ({service.durationMinutes} min estimated repair)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot.id;
                return (
                  <Button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-11 justify-center ${
                      !slot.available ? "cursor-not-allowed opacity-40 line-through" : ""
                    }`}
                    onClick={() => setSelectedSlot(slot.id)}
                  >
                    {slot.label}
                  </Button>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-slate-400 bg-white" /> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-900" /> Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Booked
              </span>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">
              {selectedDate && selectedSlot
                ? `${selectedDate.toLocaleDateString()} at ${
                    TIME_SLOTS.find((s) => s.id === selectedSlot)?.label
                  }`
                : "Select a date & time slot"}
            </p>
            <p className="text-lg font-bold text-slate-900">${service.price} NZD</p>
          </div>
          <Button size="lg" disabled={!selectedDate || !selectedSlot} onClick={handleContinue} className="gap-2">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SlotPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-slate-500">Loading slots...</div>}>
      <SlotSelectionContent />
    </Suspense>
  );
}