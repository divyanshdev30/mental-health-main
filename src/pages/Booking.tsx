import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

const LIST_KEY = "dpi_bookings";

export default function Booking() {
  const { user } = useAuth();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("Online");
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
    try {
      const payload = {
        id: crypto.randomUUID(),
        userId: user?.id || "",
        email: user?.email ?? "student@college.edu",
        status: "pending" as const,
        date,
        time,
        mode,
        note,
        createdAt: Date.now(),
      };
      localStorage.setItem("dpi_last_booking", JSON.stringify(payload));
      const raw = localStorage.getItem(LIST_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(payload);
      localStorage.setItem(LIST_KEY, JSON.stringify(arr));
      window.dispatchEvent(new StorageEvent("storage", { key: LIST_KEY }));
    } catch {}
  };

  const reset = () => setConfirmed(false);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Book a Counseling Session</CardTitle>
          <p className="text-sm text-muted-foreground">
            Local-only for prototype. Admin can review and respond from the
            Admin page.
          </p>
        </CardHeader>
        {confirmed ? (
          <CardContent className="space-y-2">
            <p className="font-semibold">Request submitted</p>
            <div className="rounded-lg bg-accent/20 p-4">
              <p>
                <span className="font-medium">Date:</span> {date}
              </p>
              <p>
                <span className="font-medium">Time:</span> {time}
              </p>
              <p>
                <span className="font-medium">Mode:</span> {mode}
              </p>
              <p>
                <span className="font-medium">Status:</span> pending
              </p>
              {note && (
                <p>
                  <span className="font-medium">Note:</span> {note}
                </p>
              )}
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Mode</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Input
                  id="note"
                  placeholder="Anything you'd like your counselor to know"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <Button type="submit">Submit request</Button>
            </form>
          </CardContent>
        )}
        <CardFooter className="justify-between">
          <Button variant="outline" onClick={reset}>
            New request
          </Button>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
