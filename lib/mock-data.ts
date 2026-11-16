export interface RepairService {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface DeviceModel {
  id: string;
  brand: "Apple" | "Samsung" | "Google";
  name: string;
  services: RepairService[];
}

export const DEVICES: DeviceModel[] = [
  {
    id: "iphone-15-pro",
    brand: "Apple",
    name: "iPhone 15 Pro",
    services: [
      {
        id: "screen-15p",
        name: "Screen Replacement",
        description: "Original-grade OLED display assembly with True Tone calibration",
        price: 299,
        durationMinutes: 45,
      },
      {
        id: "battery-15p",
        name: "Battery Replacement",
        description: "High-capacity zero-cycle battery with fresh water-resistant seal",
        price: 89,
        durationMinutes: 30,
      },
      {
        id: "port-15p",
        name: "USB-C Charging Port Repair",
        description: "Full charging flex replacement and fast-charge diagnostics",
        price: 110,
        durationMinutes: 60,
      },
    ],
  },
  {
    id: "iphone-14",
    brand: "Apple",
    name: "iPhone 14",
    services: [
      {
        id: "screen-14",
        name: "Screen Replacement",
        description: "Super Retina XDR OLED replacement with full touch testing",
        price: 219,
        durationMinutes: 45,
      },
      {
        id: "battery-14",
        name: "Battery Replacement",
        description: "Genuine-spec battery replacement with 12-month warranty",
        price: 79,
        durationMinutes: 30,
      },
    ],
  },
  {
    id: "galaxy-s24-ultra",
    brand: "Samsung",
    name: "Galaxy S24 Ultra",
    services: [
      {
        id: "screen-s24u",
        name: "Dynamic AMOLED Screen Replacement",
        description: "Includes new frame, ultrasonic fingerprint calibration & S-Pen test",
        price: 349,
        durationMinutes: 60,
      },
      {
        id: "battery-s24u",
        name: "Battery Replacement",
        description: "5000mAh OEM-spec battery with rear glass resealing",
        price: 95,
        durationMinutes: 45,
      },
    ],
  },
  {
    id: "pixel-8-pro",
    brand: "Google",
    name: "Google Pixel 8 Pro",
    services: [
      {
        id: "screen-p8p",
        name: "OLED Display Replacement",
        description: "120Hz LTPO display replacement with fingerprint sensor recalibration",
        price: 249,
        durationMinutes: 60,
      },
      {
        id: "battery-p8p",
        name: "Battery Replacement",
        description: "Replacement battery with thermal paste & adhesive renewal",
        price: 85,
        durationMinutes: 45,
      },
    ],
  },
];

export const TIME_SLOTS = [
  { id: "09:00", label: "09:00 AM", available: true },
  { id: "10:00", label: "10:00 AM", available: true },
  { id: "11:00", label: "11:00 AM", available: false }, // Simulated full slot
  { id: "12:00", label: "12:00 PM", available: true },
  { id: "14:00", label: "02:00 PM", available: true },
  { id: "15:00", label: "03:00 PM", available: false }, // Simulated full slot
  { id: "16:00", label: "04:00 PM", available: true },
  { id: "17:00", label: "05:00 PM", available: true },
];