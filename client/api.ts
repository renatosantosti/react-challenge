import type { Slot, Booking } from "./types";

export async function fetchSlots(): Promise<Slot[]> {
  const r = await fetch("/api/slots");
  const data = await r.json();
  return data.slots;
}

export async function createBooking(input: {
  slotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}): Promise<Booking> {
  const r = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error ?? "booking failed");
  }
  return r.json();
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatUtcOffset(date: Date): string {
  // getTimezoneOffset: minutes to add to local to get UTC (e.g. BRT => 180)
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  return `UTC${sign}${pad2(Math.floor(abs / 60))}:${pad2(abs % 60)}`;
}

export function formatSlot(startsAtIso: string): string {
  const d = new Date(startsAtIso);
  if (Number.isNaN(d.getTime())) return startsAtIso;

  const local = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  return `${local} (${formatUtcOffset(d)})`;
}
