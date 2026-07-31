import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/components/firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const STORAGE_KEY = "dpi_moods";

type MoodEntry = { date: string; mood: 1 | 2 | 3 | 4 | 5 };

const moods = [
  { v: 1 as const, label: "Awful", emoji: "😞" },
  { v: 2 as const, label: "Low", emoji: "☁️" },
  { v: 3 as const, label: "Okay", emoji: "😌" },
  { v: 4 as const, label: "Good", emoji: "🙂" },
  { v: 5 as const, label: "Great", emoji: "🌟" },
];

function yyyyMmDd(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export default function MoodTracker() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setEntries(parsed);
      } else {
        const vals = [3, 4, 2, 3, 4, 5, 3, 2, 4, 3, 4, 3, 5, 4];
        const sample: MoodEntry[] = vals.map((v, idx) => {
          const d = new Date();
          d.setDate(d.getDate() - (vals.length - 1 - idx));
          return { date: yyyyMmDd(d), mood: v as 1 | 2 | 3 | 4 | 5 };
        });
        setEntries(sample);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  useEffect(() => {
    if (!user?.id) return;
    const ref = collection(db, "users", user.id, "moods");
    const q = query(ref, orderBy("date", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const list: MoodEntry[] = snap.docs.map((d) => {
        const data = d.data() as any;
        const mood = Math.max(1, Math.min(5, Number(data.mood))) as
          | 1
          | 2
          | 3
          | 4
          | 5;
        return { date: data.date || d.id, mood };
      });
      if (list.length > 0) setEntries(list);
    });
    return () => unsub();
  }, [user?.id]);

  const todayKey = yyyyMmDd();
  const today = entries.find((e) => e.date === todayKey);

  const saveMood = async (m: 1 | 2 | 3 | 4 | 5) => {
    setEntries((prev) => {
      const rest = prev.filter((e) => e.date !== todayKey);
      return [...rest, { date: todayKey, mood: m }].sort((a, b) =>
        a.date.localeCompare(b.date),
      );
    });

    if (user?.id) {
      try {
        const ref = doc(db, "users", user.id, "moods", todayKey);
        await setDoc(
          ref,
          {
            date: todayKey,
            mood: m,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch {}
    }
  };

  const last14 = useMemo(() => {
    const out: { day: string; value: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = yyyyMmDd(d);
      const found = entries.find((e) => e.date === key);
      out.push({ day: key.slice(5), value: found ? found.mood : 0 });
    }
    return out;
  }, [entries]);

  const avg = useMemo(() => {
    const vals = entries.slice(-14).map((e) => e.mood);
    if (!vals.length) return 0;
    return (
      Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
    );
  }, [entries]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Mood</span>
          <span className="text-sm font-normal text-muted-foreground">
            14‑day avg: {avg || "—"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <Button
              key={m.v}
              size="sm"
              variant={today?.mood === m.v ? "default" : "outline"}
              onClick={() => saveMood(m.v)}
            >
              <span className="mr-1" aria-hidden>
                {m.emoji}
              </span>
              {m.label}
            </Button>
          ))}
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={last14}
              margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
            >
              <XAxis dataKey="day" hide />
              <YAxis domain={[0, 5]} hide />
              <Tooltip
                formatter={(v: number) => v || "No entry"}
                labelFormatter={(l) => `Day ${l}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary)/0.2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground">
          Local sample data prefilled for presentation. Connect Firebase later
          for sync.
        </p>
      </CardContent>
    </Card>
  );
}
