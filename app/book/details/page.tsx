"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEVICES, TIME_SLOTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, User, Phone, Mail, FileText, ShieldCheck } from "lucide-react";

function DetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const deviceId = searchParams.get("deviceId") || "iphone-15-pro";
  const serviceId = searchParams.get("serviceId") || "screen-15p";
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const slotId = searchParams.get("slot") || "10:00";

  const device = DEVICES.find((d) => d.id === deviceId) || DEVICES[0];
  const service = device.services.find((s) => s.id === serviceId) || device.services[0];
  const slotLabel = TIME_SLOTS.find((s) => s.id === slotId)?.label || slotId;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const isFormValid = name.trim().length >= 2 && phone.trim().length >= 6 && email.includes("@");

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Generate a random 4-digit tracking code for the prototype
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `FIX-${randomNum}`;

    const params = new URLSearchParams({
      device: device.name,
      service: service.name,
      price: service.price.toString(),
      date,
      slot: slotLabel,
      name,
    });

    router.push(`/track/${trackingCode}?${params.toString()}`);
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
            <h1 className="text-base font-bold leading-none">Confirm Your Booking</h1>
            <p className="text-xs text-slate-500">Step 3 of 3 • No payment required now</p>
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
          <div className="mx-2 h-px flex-1 bg-emerald-600" />
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">✓</span>
            Time Slot
          </span>
          <div className="mx-2 h-px flex-1 bg-slate-900" />
          <span className="flex items-center gap-1.5 font-semibold text-slate-900">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white">3</span>
            Confirm
          </span>
        </div>

        {/* Booking Summary Box */}
        <Card className="mb-5 border-slate-300 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Repair Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Device</span>
              <span className="font-medium">{device.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service</span>
              <span className="font-medium">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Appointment</span>
              <span className="font-medium">
                {date} at {slotLabel}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Estimated Total</span>
              <span>${service.price} NZD</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Contact Form */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Contact Details</CardTitle>
            <CardDescription>We will send live repair status updates to your phone and email</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="booking-form" onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <User className="h-3.5 w-3.5" /> Full Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Alex Taylor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <Phone className="h-3.5 w-3.5" /> Mobile Number (for SMS alerts) *
                </label>
                <Input
                  required
                  type="tel"
                  placeholder="e.g. +64 21 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <Mail className="h-3.5 w-3.5" /> Email Address *
                </label>
                <Input
                  required
                  type="email"
                  placeholder="e.g. alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <FileText className="h-3.5 w-3.5" /> Issue Notes / Passcode (Optional)
                </label>
                <Input
                  placeholder="Any extra details about the damage..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Your data is encrypted and only used for repair updates</span>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Pay after repair</p>
            <p className="text-lg font-bold text-slate-900">${service.price} NZD</p>
          </div>
          <Button type="submit" form="booking-form" size="lg" disabled={!isFormValid} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DetailsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-slate-500">Loading booking details...</div>}>
      <DetailsContent />
    </Suspense>
  );
}