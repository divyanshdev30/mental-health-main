import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Resource = {
  id: string;
  type: string;
  title: string;
  category: string;
  url: string;
};

export default function ResourceSpotlight() {
  const [res, setRes] = useState<Resource | null>(null);

  useEffect(() => {
    const url = new URL("../../data/resources.json", import.meta.url);
    fetch(url)
      .then((r) => r.json())
      .then((items: Resource[]) => {
        if (items.length)
          setRes(items[Math.floor(Math.random() * items.length)]);
      })
      .catch(() => setRes(null));
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Resource spotlight</CardTitle>
      </CardHeader>
      <CardContent>
        {res ? (
          <a href={res.url} target="_blank" rel="noreferrer" className="block">
            <p className="font-medium">{res.title}</p>
            <p className="text-sm text-muted-foreground">
              {res.type} • {res.category}
            </p>
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">
            No resource available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
