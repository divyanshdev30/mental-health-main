import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About MindSpace</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A comprehensive mental health support platform designed to make counseling
          and wellness resources accessible to everyone, particularly students.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              To provide accessible, stigma-free mental health support that empowers
              individuals to prioritize their emotional well-being.
            </p>
            <p>
              We believe mental health is as important as physical health, and everyone
              deserves access to professional support and wellness tools.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              To create a world where mental health support is easily accessible,
              affordable, and free from societal stigma.
            </p>
            <p>
              We envision a community where students and young adults can openly seek
              help and build resilience with confidence.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="mt-0.5">1</Badge>
                <div>
                  <h3 className="font-semibold">Mood Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your emotional well-being over time with daily mood logs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-0.5">2</Badge>
                <div>
                  <h3 className="font-semibold">Mental Health Screening</h3>
                  <p className="text-sm text-muted-foreground">
                    PHQ-9 and GAD-7 assessments for depression and anxiety screening
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-0.5">3</Badge>
                <div>
                  <h3 className="font-semibold">AI Chatbot Support</h3>
                  <p className="text-sm text-muted-foreground">
                    24/7 conversational support with guided coping strategies
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="mt-0.5">4</Badge>
                <div>
                  <h3 className="font-semibold">Wellness Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    Curated breathing exercises, meditation videos, and wellness articles
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-0.5">5</Badge>
                <div>
                  <h3 className="font-semibold">Professional Booking</h3>
                  <p className="text-sm text-muted-foreground">
                    Schedule one-on-one sessions with qualified counselors
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="mt-0.5">6</Badge>
                <div>
                  <h3 className="font-semibold">Peer Support Forum</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with others, share experiences, and build community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader>
          <CardTitle>Built With Care</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            MindSpace is developed by <span className="font-semibold">Byte-Me</span>, a
            passionate team committed to making mental health support accessible to everyone.
          </p>
          <p className="text-sm text-muted-foreground">
            We believe in the power of technology to bring people together and create
            meaningful change in mental health awareness and support.
          </p>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            Have questions, feedback, or want to become a counselor? We'd love to hear from you!
          </p>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Email:</span> support@mindspace.app
            </p>
            <p>
              <span className="font-semibold">Want to help?</span> Consider{" "}
              <a href="/become-counselor" className="text-primary hover:underline">
                becoming a counselor
              </a>{" "}
              and make a difference in someone's life.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Values */}
      <Card>
        <CardHeader>
          <CardTitle>Our Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Accessibility</h3>
              <p className="text-sm text-muted-foreground">
                Mental health support should be available to everyone, everywhere
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Your data and conversations are treated with utmost confidentiality
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Compassion</h3>
              <p className="text-sm text-muted-foreground">
                We approach every interaction with empathy and understanding
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
