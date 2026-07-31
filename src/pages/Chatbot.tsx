import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";

type Msg = { id: string; role: "user" | "bot"; text: string };

const starters = [
  "Hi! I'm here to listen. What's on your mind today?",
  "You can try typing how you're feeling. We can explore small steps together.",
];

export default function Chatbot() {
  const { user } = useAuth();
  const [chatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: starters[Math.floor(Math.random() * starters.length)],
        },
      ]);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadMessages = async (_cid: string) => {
    return;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    setTyping(true);
    const reply = await mockReply(text);
    setTyping(false);
    const botMsg: Msg = { id: crypto.randomUUID(), role: "bot", text: reply };
    setMessages((m) => [...m, botMsg]);
  };

  const canSend = useMemo(
    () => input.trim().length > 0 && !typing,
    [input, typing],
  );

  const clearThread = async () => {
    setMessages(messages.slice(0, 1));
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="h-[70vh] grid grid-rows-[auto_1fr_auto]">
        <CardHeader>
          <CardTitle>Supportive Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-full overflow-y-auto pr-1">
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <Bubble role={m.role} text={m.text} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {typing && (
                <div className="flex gap-2 items-end">
                  <div className="rounded-2xl rounded-bl-none bg-muted px-4 py-2 text-sm text-muted-foreground">
                    typing...
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Input
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button onClick={send} disabled={!canSend}>
            Send
          </Button>
          <Button variant="ghost" onClick={clearThread}>
            Clear
          </Button>
        </CardFooter>
      </Card>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Messages are stored locally per user session. Replace mockReply with
        your AI API call when ready.
      </p>
    </div>
  );
}

function Bubble({ role, text }: { role: "user" | "bot"; text: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

async function mockReply(input: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 600));
  const lower = input.toLowerCase();

  // Helper: random reply picker
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (/(anxious|anxiety|worry|nervous|panic|overthinking)/.test(lower)) {
    return pick([
      "I hear that you're feeling anxious. That’s completely valid. Try this: notice 3 things you see, 3 sounds you hear, and move 3 body parts.",
      "Anxiety can feel overwhelming. A small grounding trick: slowly breathe in for 4, hold for 4, out for 4.",
      "You’re not alone in this. When worry shows up, gently bring your focus back to your breath or your surroundings."
    ]);
  }

  if (/(sad|down|low|depress|lonely|empty|heartbroken)/.test(lower)) {
    return pick([
      "I’m really sorry you’re feeling low. A tiny gentle step—like moving your body, stepping outside, or journaling—can help shift the mood.",
      "Sadness is heavy. Sometimes giving yourself permission to just *be* is enough. Would doing something soothing help right now?",
      "You’re going through a tough moment. Try to reach for one comforting thing—music, tea, or even texting a friend."
    ]);
  }

  if (/(sleep|tired|exhausted|insomnia|restless|fatigue)/.test(lower)) {
    return pick([
      "Sleep struggles are tough. Try a 30–60 min wind-down with no screens and dim lights.",
      "Feeling tired? A few slow breaths or gentle stretching before bed can help your body relax.",
      "Sometimes the mind races at night. Writing down your thoughts before sleep can clear mental space."
    ]);
  }

  if (/(stress|overwhelm|overwhelmed|pressure|burnout|hectic)/.test(lower)) {
    return pick([
      "Stress piles up quickly. Try breaking things into one 5-minute step you can start with.",
      "Overwhelm is real. Take one deep breath and choose *one* small thing to focus on right now.",
      "When pressure builds, give yourself permission to pause, sip water, and reset before moving forward."
    ]);
  }

  if (/(angry|frustrated|mad|irritated|rage)/.test(lower)) {
    return pick([
      "Anger is powerful energy. Try releasing it safely—maybe with movement, writing, or deep breaths.",
      "I hear your frustration. A short pause—like counting backwards from 20—can cool things down.",
      "It’s okay to feel mad. What usually helps you release that heat in a healthy way?"
    ]);
  }

  if (/(motivate|motivation|lazy|procrastinate|stuck|unproductive)/.test(lower)) {
    return pick([
      "Motivation comes and goes, but action creates momentum. What’s one super small step you can do now?",
      "Feeling stuck is normal. Set a 5-minute timer and just start—the rest often follows.",
      "You don’t need big energy to move forward. Even a tiny action counts as progress."
    ]);
  }

  if (/(focus|distract|concentrate|attention|studying)/.test(lower)) {
    return pick([
      "Focus can be tricky. Try working in a 25-minute sprint with a 5-minute break.",
      "If distractions pull you away, jot them down on paper to deal with later, then return to your task.",
      "A simple trick: silence notifications, set a short timer, and start with one clear goal."
    ]);
  }

  if (/(self.?doubt|not good enough|worthless|failure)/.test(lower)) {
    return pick([
      "Self-doubt is tough. Remember: thoughts aren’t always facts. You’ve overcome challenges before.",
      "It’s normal to question yourself. Can you think of one small thing you did well recently?",
      "You are more capable than your mind is telling you right now. Small wins build confidence."
    ]);
  }

  // Fallback
  return pick([
    "Thanks for sharing. Naming what you feel is a strong first step. Do you want a tip for grounding, breathing, or planning?",
    "I hear you. Sometimes choosing one small supportive action makes a big difference. Want me to suggest one?",
    "You’re not alone in this. Would you like me to guide you through a quick calming exercise?"
  ]);
}
