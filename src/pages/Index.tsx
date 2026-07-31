import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function Index() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-accent/20 to-sky-100 p-8 md:p-12">
        <DecorativeOrbs />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            MindSpace: Digital Psychological Support for Students
          </motion.h1>
          <motion.p
            className="mt-6 text-lg md:text-xl text-foreground/80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Evidence-informed tools to help you manage stress, anxiety, and mood
            — designed with a calming, student-friendly experience.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button asChild size="lg">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">I already have an account</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/become-counselor">Become a Counselor</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="rounded-2xl border p-6 md:p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Your space to breathe, reflect, and grow
        </h2>
        <p className="mt-3 text-muted-foreground">
          A supportive digital platform helping students manage stress, anxiety,
          and academic pressure through screenings, resources, peer support, and
          confidential guidance.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/dashboard">Explore Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/resources">Browse Resources</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function DecorativeOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
    </div>
  );
}

const features = [
  {
    title: "Supportive Chatbot",
    desc: "Practice coping strategies with a gentle, guided conversation.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9h1v-3.5c3.59 0 6.5-2.91 6.5-6.5S16.59 4.5 13 4.5H8v5h5" />
      </svg>
    ),
  },
  {
    title: "Screening Tools",
    desc: "PHQ-9 and GAD-7 forms with immediate, easy-to-read feedback.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: "Curated Resources",
    desc: "Audio, video, and articles filtered by stress, sleep, and study.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" />
        <path d="M20 22V6" />
        <path d="M20 6L8 2v16" />
      </svg>
    ),
  },
];
