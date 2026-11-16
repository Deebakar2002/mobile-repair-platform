"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEVICES, TIME_SLOTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wrench,
  Calendar,
  DollarSign,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Bell,
} from "lucide-react";

type BookingStatus = "Confirmed" | "In Repair" | "Ready for Pickup" | "Completed";

interface MockBooking {
  id: string;
  customer: string;
  phone: string;
  device: string;
  service: string;
  price: number;
  date: string;
  slot: string;
  status: BookingStatus;
}

const INITIAL_BOOKINGS: MockBooking[] = [
  {
    id: "FIX-8492",
    customer: "Sarah Jenkins",
    phone: "+64 21 555 0192",
    device: "iPhone 15 Pro",
    service: "Screen Replacement",
    price: 299,
    date: "Today",
    slot: "10:00 AM",
    status: "In Repair",
  },
  {
    id: "FIX-8495",
    customer: "Liam O'Connor",
    phone: "+64 22 419 8831",
    device: "Galaxy S24 Ultra",
    service: "Battery Replacement",
    price: 95,
    date: "Today",
    slot: "12:00 PM",
    status: "Confirmed",
  },
  {
    id: "FIX-8499",
    customer: "Priya Patel",
    phone: "+64 27 890 1124",
    device: "iPhone 14",
    service: "Screen Replacement",
    price: 219,
    date: "Tomorrow",
    slot: "09:00 AM",
    status: "Confirmed",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"bookings" | "services" | "slots">("bookings");

  // 1. Bookings State
  const [bookings, setBookings] = useState<MockBooking[]>(INITIAL_BOOKINGS);
  const [toastMsg, setToastMsg] = useState<string>("");

  // 2. Services & Pricing State (Editable in UI)
  const [servicesList, setServicesList] = useState(
    DEVICES.flatMap((d) =>
      d.services.map((s) => ({
        ...s,
        deviceName: d.name,
        brand: d.brand,
      }))
    )
  );
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDevice, setNewServiceDevice] = useState("iPhone 15 Pro");
  const [newServicePrice, setNewServicePrice] = useState("");

  // 3. Time Slots State
  const [slots, setSlots] = useState(TIME_SLOTS);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    const target = bookings.find((b) => b.id === bookingId);
    showToast(`Status updated to "${newStatus}" — Auto-SMS/Email sent to ${target?.customer}`);
  };

  const handlePriceUpdate = (serviceId: string, updatedPrice: string) => {
    const num = Number(updatedPrice);
    if (isNaN(num)) return;
    setServicesList((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, price: num } : s))
    );
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServicePrice) return;
    setServicesList((prev) => [
      {
        id: `custom-${Date.now()}`,
        deviceName: newServiceDevice,
        brand: "Apple",
        name: newServiceName.trim(),
        description: "Custom added repair service",
        price: Number(newServicePrice),
        durationMinutes: 45,
      },
      ...prev,
    ]);
    setNewServiceName("");
    setNewServicePrice("");
    showToast("New repair service added to customer catalog!");
  };

  const toggleSlotAvailability = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, available: !s.available } : s))
    );
    showToast("Slot availability updated in real time.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-10 border-b bg-slate-900 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Wrench className="h-5 w-5 text-emerald-400" />
            <div>
              <h1 className="text-base font-bold leading-none">QuickFix Admin Panel</h1>
              <p className="text-[11px] text-slate-400">No-Code Shop Management</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Customer View
          </Button>
        </div>
      </header>

      {/* Notification Banner */}
      {toastMsg && (
        <div className="bg-emerald-600 px-4 py-2.5 text-center text-xs font-medium text-white shadow">
          <span className="inline-flex items-center gap-1.5">
            <Bell className="h-3.5 w-3.5" /> {toastMsg}
          </span>
        </div>
      )}

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6 grid grid-cols-3 gap-2 rounded-xl bg-slate-200/70 p-1">
          <Button
            variant={activeTab === "bookings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("bookings")}
            className="gap-1.5"
          >
            <Calendar className="h-4 w-4" /> Bookings ({bookings.length})
          </Button>
          <Button
            variant={activeTab === "services" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("services")}
            className="gap-1.5"
          >
            <DollarSign className="h-4 w-4" /> Services & Prices
          </Button>
          <Button
            variant={activeTab === "slots" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("slots")}
            className="gap-1.5"
          >
            <Clock className="h-4 w-4" /> Time Slots
          </Button>
        </div>

        {/* TAB 1: BOOKINGS QUEUE */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="shadow-sm">
                <CardContent className="flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {booking.id}
                      </Badge>
                      <span className="font-bold text-slate-900">{booking.customer}</span>
                      <span className="text-xs text-slate-500">({booking.phone})</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {booking.device} — {booking.service} (${booking.price} NZD)
                    </p>
                    <p className="text-xs text-slate-500">
                      Scheduled: {booking.date} at {booking.slot}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={booking.status}
                      onValueChange={(val) => {
                        if (val) handleStatusChange(booking.id, val as BookingStatus);
                      }}
                    >
                      <SelectTrigger className="w-[170px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="In Repair">In Repair</SelectItem>
                        <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* TAB 2: SERVICES & PRICING EDITOR */}
        {activeTab === "services" && (
          <div className="space-y-5">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Add New Repair Service</CardTitle>
                <CardDescription>Instantly publish a new repair option to the booking page</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddService} className="grid gap-3 sm:grid-cols-4">
                  <Input
                    placeholder="Device (e.g. iPhone 15)"
                    value={newServiceDevice}
                    onChange={(e) => setNewServiceDevice(e.target.value)}
                  />
                  <Input
                    placeholder="Repair (e.g. Back Glass)"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Price (NZD)"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                  />
                  <Button type="submit" className="gap-1.5">
                    <Plus className="h-4 w-4" /> Add Service
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Edit Existing Prices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {servicesList.map((srv) => (
                  <div
                    key={srv.id}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-white p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{srv.deviceName}</p>
                      <p className="text-xs text-slate-500">{srv.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">$ NZD</span>
                      <Input
                        type="number"
                        className="w-24 text-right font-semibold"
                        value={srv.price}
                        onChange={(e) => handlePriceUpdate(srv.id, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: TIME SLOT AVAILABILITY MANAGER */}
        {activeTab === "slots" && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Manage Daily Time Slots</CardTitle>
              <CardDescription>
                Click any slot to open or block bookings for technicians
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => toggleSlotAvailability(slot.id)}
                    className={`cursor-pointer rounded-xl border p-3.5 text-center transition-all ${
                      slot.available
                        ? "border-emerald-300 bg-emerald-50/60 text-emerald-950"
                        : "border-slate-200 bg-slate-100 text-slate-400"
                    }`}
                  >
                    <p className="font-bold">{slot.label}</p>
                    <p className="mt-1 flex items-center justify-center gap-1 text-xs">
                      {slot.available ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Open
                        </>
                      ) : (
                        "Blocked / Full"
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
