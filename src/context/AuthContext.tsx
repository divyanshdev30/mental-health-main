import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../components/firebase";

export type Role = "student" | "admin" | "counselor";
type RoleMap = Record<string, { role: Role; name?: string }>;
const ROLES_KEY = "dpi_roles";
export type User = {
  id: string;
  email: string;
  role: Role;
  name?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  signup: (
    email: string,
    password: string,
    profile?: { name?: string; role?: Role },
  ) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "dpi_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        let localUser: any = null;
        let roles: RoleMap = {};
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          localUser = raw ? JSON.parse(raw) : null;
        } catch {}
        try {
          const rawr = localStorage.getItem(ROLES_KEY);
          roles = rawr ? JSON.parse(rawr) : {};
        } catch {}
        const email = fbUser.email || "";
        const lower = email.toLowerCase();
        const override = roles[lower];
        const u = fromSession(
          email,
          fbUser.uid,
          override?.name || fbUser.displayName || localUser?.name || "",
          override?.role || localUser?.role,
        );
        setUser(u);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        } catch {}
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setUser(JSON.parse(raw));
          else setUser(null);
        } catch {
          setUser(null);
        }
      }
    });
    return () => unsub();
  }, []);

  const persistLocal = (u: User) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const validate = (email: string, password: string) => {
    const emailOk = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);
    if (!emailOk) return { ok: false, message: "Enter a valid email" };
    if (password.length < 6)
      return { ok: false, message: "Password must be at least 6 characters" };
    return { ok: true };
  };

  const ensureProfile = async (_id: string, _email: string) => {
    return;
  };

  const login = async (email: string, password: string) => {
    const v = validate(email, password);
    if (!v.ok) return { success: false, message: v.message };

    if (!auth) {
      console.error("Firebase auth is not initialized");
      return { success: false, message: "Internal error. Please try again." };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const u = userCredential.user;
      let local: any = null;
      let roles: RoleMap = {};
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        local = raw ? JSON.parse(raw) : null;
      } catch {}
      try {
        const rawr = localStorage.getItem(ROLES_KEY);
        roles = rawr ? JSON.parse(rawr) : {};
      } catch {}

      await ensureProfile(u.uid, u.email || email);

      const emailEff = u.email || email;
      const r = roles[emailEff.toLowerCase()];
      const merged = fromSession(
        emailEff,
        u.uid,
        r?.name || u.displayName || local?.name || "",
        r?.role || local?.role,
      );
      setUser(merged);
      navigate("/dashboard", { replace: true });

      return { success: true };
    } catch (error: any) {
      console.error("Error during login:", error);
      switch (error.code) {
        case "auth/user-not-found":
          return { success: false, message: "No user found with this email." };
        case "auth/wrong-password":
          return { success: false, message: "Incorrect password." };
        case "auth/invalid-email":
          return { success: false, message: "Invalid email address." };
        default:
          return {
            success: false,
            message: error.message || "Unknown error occurred.",
          };
      }
    }
  };

  const signup = async (
    email: string,
    password: string,
    profile?: { name?: string; role?: Role },
  ) => {
    const v = validate(email, password);
    if (!v.ok) return { success: false, message: v.message };

    if (!auth) {
      console.error("Firebase auth is not initialized");
      return { success: false, message: "Internal error. Please try again." };
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const u = cred.user;

      if (profile?.name) {
        try {
          await updateProfile(u, { displayName: profile.name });
        } catch {}
      }

      await sendEmailVerification(u).catch(() => {});
      await ensureProfile(u.uid, u.email || email);

      const finalUser = fromSession(
        u.email || email,
        u.uid,
        profile?.name || u.displayName || "",
        profile?.role,
      );
      persistLocal(finalUser);

      navigate("/dashboard", { replace: true });
      return { success: true };
    } catch (error: any) {
      switch (error.code) {
        case "auth/email-already-in-use":
          return { success: false, message: "Email is already in use." };
        case "auth/invalid-email":
          return { success: false, message: "Invalid email address." };
        case "auth/weak-password":
          return { success: false, message: "Password is too weak." };
        default:
          return {
            success: false,
            message: error.message || "Unknown error occurred.",
          };
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const u = cred.user;

      let local: any = null;
      let roles: RoleMap = {};
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        local = raw ? JSON.parse(raw) : null;
      } catch {}
      try {
        const rawr = localStorage.getItem(ROLES_KEY);
        roles = rawr ? JSON.parse(rawr) : {};
      } catch {}

      await ensureProfile(u.uid, u.email || "");
      const emailEff = u.email || "";
      const r = roles[emailEff.toLowerCase()];
      const mapped = fromSession(
        emailEff,
        u.uid,
        r?.name || u.displayName || local?.name || "",
        r?.role || local?.role,
      );
      setUser(mapped);
      navigate("/dashboard", { replace: true });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || "Google sign-in failed",
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    persistLocal(null);
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({ user, login, signup, loginWithGoogle, logout }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function inferRole(email: string, override?: Role): Role {
  if (override) return override;
  const e = email.toLowerCase();
  if (e.includes("admin")) return "admin";
  return "student";
}

function fromSession(
  email: string,
  id: string,
  name?: string,
  roleOverride?: Role,
): NonNullable<User> {
  return { id, email, role: inferRole(email, roleOverride), name };
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
