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
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Input } from "../components/ui/input";

const LIST_KEY = "dpi_bookings";
const APPS_KEY = "dpi_counselor_apps";
const ROLES_KEY = "dpi_roles";

type RoleMap = Record<
  string,
  { role: "student" | "admin" | "counselor"; name?: string }
>;

const usage = [
  { day: "Mon", chats: 24, screenings: 10 },
  { day: "Tue", chats: 30, screenings: 12 },
  { day: "Wed", chats: 28, screenings: 14 },
  { day: "Thu", chats: 36, screenings: 18 },
  { day: "Fri", chats: 22, screenings: 9 },
  { day: "Sat", chats: 12, screenings: 5 },
  { day: "Sun", chats: 15, screenings: 6 },
];

const stress = [
  { level: "Minimal", count: 48 },
  { level: "Mild", count: 32 },
  { level: "Moderate", count: 20 },
  { level: "Severe", count: 6 },
];

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
};

export default function Admin() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = () => {
    try {
      const raw = localStorage.getItem(LIST_KEY);
      const list: Booking[] = raw ? JSON.parse(raw) : [];
      list.sort((a, b) => b.createdAt - a.createdAt);
      setBookings(list);
    } catch {
      setBookings([]);
    }
  };

  useEffect(() => {
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === LIST_KEY) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const counts = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      approved: bookings.filter((b) => b.status === "approved").length,
      rejected: bookings.filter((b) => b.status === "rejected").length,
    }),
    [bookings],
  );

  const setStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, status } : b));
      try {
        localStorage.setItem(LIST_KEY, JSON.stringify(next));
        window.dispatchEvent(new StorageEvent("storage", { key: LIST_KEY }));
      } catch {}
      return next;
    });
  };

  function readApps() {
    try {
      const raw = localStorage.getItem(APPS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  function readRoles(): RoleMap {
    try {
      const raw = localStorage.getItem(ROLES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  function writeRoles(map: RoleMap) {
    try {
      localStorage.setItem(ROLES_KEY, JSON.stringify(map));
    } catch {}
  }

  const [apps, setApps] = useState<any[]>(readApps());
  const [roles, setRoles] = useState<RoleMap>(readRoles());
  const [newCounselor, setNewCounselor] = useState({ name: "", email: "" });

  const approveApp = (id: string) => {
    const app = apps.find((a) => a.id === id);
    if (!app) return;
    const lower = String(app.email || "").toLowerCase();
    const next = { ...roles, [lower]: { role: "counselor", name: app.name } };
    setRoles(next);
    writeRoles(next);
    setApps(apps.filter((a) => a.id !== id));
    localStorage.setItem(
      APPS_KEY,
      JSON.stringify(apps.filter((a) => a.id !== id)),
    );
  };

  const rejectApp = (id: string) => {
    const nxt = apps.filter((a) => a.id !== id);
    setApps(nxt);
    localStorage.setItem(APPS_KEY, JSON.stringify(nxt));
  };

  const addCounselor = () => {
    const email = newCounselor.email.trim();
    const name = newCounselor.name.trim();
    if (!email || !name) return;
    const lower = email.toLowerCase();
    const next = { ...roles, [lower]: { role: "counselor", name } };
    setRoles(next);
    writeRoles(next);
    setNewCounselor({ name: "", email: "" });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-80">
          <CardHeader>
            <CardTitle>Weekly Usage</CardTitle>
            <p className="text-sm text-muted-foreground">
              Dummy data for sessions and screenings.
            </p>
          </CardHeader>
          <CardContent className="h-[calc(100%-88px)]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={usage}
                margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <RTooltip />
                <Line
                  type="monotone"
                  dataKey="chats"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="screenings"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-80">
          <CardHeader>
            <CardTitle>Stress Severity Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              Aggregated from latest screenings (mocked).
            </p>
          </CardHeader>
          <CardContent className="h-[calc(100%-88px)]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stress}
                margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <RTooltip />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Requests ({counts.total})</CardTitle>
          <p className="text-sm text-muted-foreground">
            Local-only demo. Approvals update the same local storage the Booking
            page writes to.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            <div className="rounded-md border p-3">
              Pending: {counts.pending}
            </div>
            <div className="rounded-md border p-3">
              Approved: {counts.approved}
            </div>
            <div className="rounded-md border p-3">
              Rejected: {counts.rejected}
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
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
                  <TableCell>{b.status}</TableCell>
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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setStatus(b.id, "pending")}
                    >
                      Reset
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              Reading and writing to localStorage: {LIST_KEY}
            </TableCaption>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Become-a-Counselor Applications ({apps.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Approve to grant counselor role.
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      {a.email}
                    </TableCell>
                    <TableCell>{a.specialization || "—"}</TableCell>
                    <TableCell>{a.experience || "—"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveApp(a.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => rejectApp(a.id)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>Source: localStorage {APPS_KEY}</TableCaption>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promote Counselor (manual)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Grant counselor role by email.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Full name</label>
              <Input
                placeholder="e.g. Dr. Priya Sharma"
                value={newCounselor.name}
                onChange={(e) =>
                  setNewCounselor({ ...newCounselor, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="person@college.edu"
                value={newCounselor.email}
                onChange={(e) =>
                  setNewCounselor({ ...newCounselor, email: e.target.value })
                }
              />
            </div>
            <Button onClick={addCounselor}>Grant Counselor Role</Button>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">
                Current Counselors (
                {
                  Object.keys(roles).filter(
                    (e) => roles[e].role === "counselor",
                  ).length
                }
                )
              </p>
              <div className="space-y-2">
                {Object.entries(roles)
                  .filter(([, v]) => v.role === "counselor")
                  .map(([email, v]) => (
                    <div
                      key={email}
                      className="flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <div>
                        <div className="font-medium">{v.name || "—"}</div>
                        <div className="text-muted-foreground">{email}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Connect Firebase later to enable multi-device, real-time admin control.
      </p>
    </div>
  );
}
