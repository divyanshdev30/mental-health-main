import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "@/context/AuthContext";

const LIST_KEY = "dpi_bookings";

type StoredBooking = {
  id: string;
  email: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  time: string;
  mode: string;
  note?: string;
  createdAt: number;
};

export default function UpcomingBooking() {
  const { user } = useAuth();
  const [booking, setBooking] = useState<null | {
    date: string;
    time: string;
    mode: string;
    note?: string;
  }>(null);

  const load = () => {
    if (!user?.id) return setBooking(null);
    try {
      const raw = localStorage.getItem(LIST_KEY);
      const list: StoredBooking[] = raw ? JSON.parse(raw) : [];
      const mine = list
        .filter((b) => b.userId === user.id)
        .sort((a, b) => b.createdAt - a.createdAt)[0];
      setBooking(
        mine
          ? {
              date: mine.date,
              time: mine.time,
              mode: mine.mode,
              note: mine.note,
            }
          : null,
      );
    } catch {
      setBooking(null);
    }
  };

  useEffect(() => {
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === LIST_KEY) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Booking</CardTitle>
      </CardHeader>
      <CardContent>
        {booking ? (
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Date:</span> {booking.date}
            </p>
            <p>
              <span className="font-medium">Time:</span> {booking.time}
            </p>
            <p>
              <span className="font-medium">Mode:</span> {booking.mode}
            </p>
            {booking.note && (
              <p>
                <span className="font-medium">Note:</span> {booking.note}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No booking yet. Create one in the Booking page.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
