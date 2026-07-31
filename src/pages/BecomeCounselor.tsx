import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";

const APPS_KEY = "dpi_counselor_apps";

export default function BecomeCounselor() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Become a Counselor</CardTitle>
          <p className="text-sm text-muted-foreground">
            Fill out the form. Admin will review your application and may grant
            counselor access.
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                const form = e.currentTarget as HTMLFormElement;
                const data = new FormData(form);
                const payload = {
                  id: crypto.randomUUID(),
                  name: String(data.get("name") || ""),
                  email: String(data.get("email") || ""),
                  specialization: String(data.get("specialization") || ""),
                  experience: String(data.get("experience") || ""),
                  message: String(data.get("message") || ""),
                  createdAt: Date.now(),
                };
                const raw = localStorage.getItem(APPS_KEY);
                const arr = raw ? JSON.parse(raw) : [];
                arr.unshift(payload);
                localStorage.setItem(APPS_KEY, JSON.stringify(arr));
                form.reset();
                alert("Application submitted. Admin will review.");
              } catch {}
            }}
            className="grid gap-3"
          >
            <div className="grid gap-1">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g. Dr. Priya Sharma"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="person@college.edu"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                name="specialization"
                placeholder="Anxiety, CBT, Student wellness"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                name="experience"
                placeholder="e.g. 5 years counseling students"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Tell us about your background"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Submit Application</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
