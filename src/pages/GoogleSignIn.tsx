import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
// import GoogleLogo from "../public/google.png";

export default function GoogleSignIn() {
  const { loginWithGoogle } = useAuth();
  return (
    <div className="grid gap-3">
      <div className="text-center text-sm text-muted-foreground">
        Or continue with
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={loginWithGoogle}
      >
        <img src="/image.png" alt="Google" className=" h-6 w-6" />
        Sign in with Google
      </Button>
    </div>
  );
}
