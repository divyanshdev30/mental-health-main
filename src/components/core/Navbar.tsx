import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold">
            Ψ
          </span>
          <span className="font-semibold text-lg tracking-tight">
            MindSpace
          </span>
        </Link>

        {!isAuthPage && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink
              to="/resources"
              className={({ isActive }) => linkCls(isActive)}
            >
              Resources
            </NavLink>
            <NavLink
              to="/screening"
              className={({ isActive }) => linkCls(isActive)}
            >
              Screening
            </NavLink>
            <NavLink
              to="/chatbot"
              className={({ isActive }) => linkCls(isActive)}
            >
              Chatbot
            </NavLink>
            {user && user.role !== "admin" && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) => linkCls(isActive)}
              >
                Dashboard
              </NavLink>
            )}
            {user?.role === "counselor" && (
              <NavLink
                to="/counselor"
                className={({ isActive }) => linkCls(isActive)}
              >
                Counselor
              </NavLink>
            )}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) => linkCls(isActive)}
              >
                Admin
              </NavLink>
            )}
            <NavLink
              to="/about"
              className={({ isActive }) => linkCls(isActive)}
            >
              About
            </NavLink>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-muted-foreground">
                {user.name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}

function linkCls(active: boolean) {
  return [
    "transition-colors hover:text-foreground/90",
    active ? "text-foreground" : "text-foreground/70",
  ].join(" ");
}
