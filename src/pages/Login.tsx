import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import GoogleSignIn from "./GoogleSignIn";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // const handleSubmit =async (e) => {
  //   e.preventDefault();
  //   try {
  //     await signInWithEmailAndPassword(auth,email,password);
  //   } catch (error) {

  //   }
  // }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(email, password);
    if (!res.success) setError(res.message || "Unable to login");
  };

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          {/* <p>Hello! Welcome back to our mental health platform.</p> */}
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Log in to continue your journey toward better mental wellness. 🌱
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <GoogleSignIn />
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">No account?</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/signup">Create one</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
