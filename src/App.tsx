import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Screening from "./pages/Screening";
import Booking from "./pages/Booking";
import Resources from "./pages/Resources";
import Forum from "./pages/Forum";
import Admin from "./pages/Admin";
import Counselor from "./pages/Counselor";
import BecomeCounselor from "./pages/BecomeCounselor";
import About from "./pages/About";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/become-counselor" element={<BecomeCounselor />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/screening" element={<Screening />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/forum" element={<Forum />} />
                </Route>

                <Route element={<ProtectedRoute role="counselor" />}>
                  <Route path="/counselor" element={<Counselor />} />
                </Route>

                <Route element={<ProtectedRoute role="admin" />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
