import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";

const LIST_KEY = "dpi_bookings";

type Booking = {
  id: string;
  email: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  time: string;
  mode: string;
  note?: string;
  createdAt: number;
  reply?: string;
};

function readAll(): Booking[] {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    const list: Booking[] = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

function writeAll(list: Booking[]) {
  try {
    localStorage.setItem(LIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new StorageEvent("storage", { key: LIST_KEY }));
  } catch {}
}

export default function Counselor() {
  const [list, setList] = useState<Booking[]>([]);

  const reload = () => setList(readAll());

  useEffect(() => {
    reload();
    const onStorage = (e: StorageEvent) => {
      if (e.key === LIST_KEY) reload();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const upcomingApproved = useMemo(
    () =>
      list
        .filter((b) => b.status === "approved")
        .sort((a, b) => a.date.localeCompare(b.date)),
    [list],
  );
  const pending = useMemo(
    () => list.filter((b) => b.status === "pending"),
    [list],
  );

  const setStatus = (id: string, status: Booking["status"]) => {
    const next = list.map((b) => (b.id === id ? { ...b, status } : b));
    setList(next);
    writeAll(next);
  };

  const setReply = (id: string, reply: string) => {
    const next = list.map((b) => (b.id === id ? { ...b, reply } : b));
    setList(next);
    writeAll(next);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Today's & Upcoming Sessions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Approved bookings ordered by date.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Reply</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingApproved.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.date}</TableCell>
                  <TableCell>{b.time}</TableCell>
                  <TableCell>{b.mode}</TableCell>
                  <TableCell className="truncate max-w-[160px]">
                    {b.email}
                  </TableCell>
                  <TableCell className="truncate max-w-[220px]">
                    {b.note || "—"}
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Optional message"
                      value={b.reply || ""}
                      onChange={(e) => setReply(b.id, e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>Manage your upcoming sessions.</TableCaption>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests ({pending.length})</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review and approve or reject requests.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.date}</TableCell>
                  <TableCell>{b.time}</TableCell>
                  <TableCell>{b.mode}</TableCell>
                  <TableCell className="truncate max-w-[160px]">
                    {b.email}
                  </TableCell>
                  <TableCell className="truncate max-w-[220px]">
                    {b.note || "—"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatus(b.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatus(b.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              Local-only for demo. Shares data with Booking/Admin.
            </TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
