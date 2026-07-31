import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Link } from "react-router-dom";
import MoodTracker from "../components/dashboard/MoodTracker";
import UpcomingBooking from "../components/dashboard/UpcomingBooking";
import ResourceSpotlight from "../components/dashboard/ResourceSpotlight";

const tiles = [
  {
    to: "/chatbot",
    title: "Chatbot",
    desc: "Guided coping conversation. Connect OpenAI API in Chatbot screen.",
  },
  {
    to: "/screening",
    title: "Screening Tests",
    desc: "PHQ-9 and GAD-7 forms with instant feedback.",
  },
  {
    to: "/resources",
    title: "Resources",
    desc: "Audio, video, and articles with filters.",
  },
  {
    to: "/booking",
    title: "Booking",
    desc: "Request a counseling slot. Local-only for prototype; admin can respond.",
  },
  {
    to: "/forum",
    title: "Forum",
    desc: "Peer support feed. Replace with Firebase posts later.",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.name || user?.email?.split("@")[0] || "Student";
  if (user?.role === "admin") {
    window.location.replace("/admin");
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Hello, {name}</h1>
        <p className="text-muted-foreground">
          Choose a tool to get started. Data is local for now.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <MoodTracker />
        </div>
        <div className="grid gap-6">
          <UpcomingBooking />
          <ResourceSpotlight />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full transition-transform group-hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle>{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
