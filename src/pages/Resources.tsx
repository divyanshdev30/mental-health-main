import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Resource = {
  id: string;
  type: "audio" | "video" | "article";
  title: string;
  category: "Stress" | "Sleep" | "Study";
  url: string;
};

const categories = ["All", "Stress", "Sleep", "Study"] as const;

type Cat = (typeof categories)[number];

export default function Resources() {
  const [items, setItems] = useState<Resource[]>([]);
  const [cat, setCat] = useState<Cat>("All");

  useEffect(() => {
    const url = new URL("../data/resources.json", import.meta.url);
    fetch(url)
      .then((r) => r.json())
      .then((d: Resource[]) => setItems(d))
      .catch(() => setItems([]));
  }, []);

  const filtered = useMemo(
    () => (cat === "All" ? items : items.filter((i) => i.category === cat)),
    [items, cat],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <Button
            key={c}
            variant={c === cat ? "default" : "outline"}
            onClick={() => setCat(c)}
            size="sm"
          >
            {c}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="group"
          >
            <Card className="h-full transition-transform group-hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{r.title}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    {r.type}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Category: {r.category}
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
        {filtered.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              No resources for this category yet.
            </CardContent>
          </Card>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Resources are loaded from a local JSON file. Later, connect Firebase
        (Storage/Firestore) to manage content.
      </p>
    </div>
  );
}
