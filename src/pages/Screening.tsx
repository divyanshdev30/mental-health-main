import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const phq9 = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way",
];

const gad7 = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];

const scale = [
  { label: "0 Not at all", value: 0 },
  { label: "1 Several days", value: 1 },
  { label: "2 More than half the days", value: 2 },
  { label: "3 Nearly every day", value: 3 },
];

export default function Screening() {
  const [phq, setPhq] = useState<number[]>(Array(phq9.length).fill(0));
  const [gad, setGad] = useState<number[]>(Array(gad7.length).fill(0));
  const [submitted, setSubmitted] = useState<"phq" | "gad" | null>(null);

  const phqScore = useMemo(() => phq.reduce((a, b) => a + b, 0), [phq]);
  const gadScore = useMemo(() => gad.reduce((a, b) => a + b, 0), [gad]);

  const onSubmit = (type: "phq" | "gad") => {
    setSubmitted(type);
    // Placeholder notice in UI only: saving to Firebase will be added later
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Tabs defaultValue="phq">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="phq">PHQ-9 (Mood)</TabsTrigger>
          <TabsTrigger value="gad">GAD-7 (Anxiety)</TabsTrigger>
        </TabsList>

        <TabsContent value="phq">
          <FormCard
            title="PHQ-9"
            questions={phq9}
            values={phq}
            setValue={(i, v) =>
              setPhq((arr) => arr.map((x, idx) => (idx === i ? v : x)))
            }
            score={phqScore}
            submitted={submitted === "phq"}
            severityLabel={phqSeverity(phqScore)}
            onSubmit={() => onSubmit("phq")}
          />
        </TabsContent>

        <TabsContent value="gad">
          <FormCard
            title="GAD-7"
            questions={gad7}
            values={gad}
            setValue={(i, v) =>
              setGad((arr) => arr.map((x, idx) => (idx === i ? v : x)))
            }
            score={gadScore}
            submitted={submitted === "gad"}
            severityLabel={gadSeverity(gadScore)}
            onSubmit={() => onSubmit("gad")}
          />
        </TabsContent>
      </Tabs>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Scores are calculated locally. To persist results, connect a Firebase
        collection on this screen later.
      </p>
    </div>
  );
}

function FormCard({
  title,
  questions,
  values,
  setValue,
  score,
  severityLabel,
  submitted,
  onSubmit,
}: {
  title: string;
  questions: string[];
  values: number[];
  setValue: (i: number, v: number) => void;
  score: number;
  severityLabel: string;
  submitted: boolean;
  onSubmit: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q, i) => (
          <div key={i} className="rounded-lg border p-4">
            <fieldset>
              <legend className="font-medium mb-3">
                {i + 1}. {q}
              </legend>
              <div className="grid gap-3 sm:grid-cols-4">
                {scale.map((s) => (
                  <label
                    key={s.value}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name={`${title}-${i}`}
                      className="accent-primary"
                      checked={values[i] === s.value}
                      onChange={() => setValue(i, s.value)}
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        ))}

        {submitted ? (
          <div className="rounded-xl bg-accent/20 p-4">
            <p className="font-semibold">
              Score: {score} — {severityLabel}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This is not a diagnosis. If you have urgent concerns or safety
              issues, please contact your local support services.
            </p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        <Button onClick={onSubmit}>Calculate</Button>
        <Button
          variant="outline"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top
        </Button>
      </CardFooter>
    </Card>
  );
}

function phqSeverity(score: number) {
  if (score <= 4) return "Minimal";
  if (score <= 9) return "Mild";
  if (score <= 14) return "Moderate";
  if (score <= 19) return "Moderately severe";
  return "Severe";
}

function gadSeverity(score: number) {
  if (score <= 4) return "Minimal";
  if (score <= 9) return "Mild";
  if (score <= 14) return "Moderate";
  return "Severe";
}
