import Navbar from "@/components/core/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Navbar />
      <main className="container py-8">
        <Outlet />
      </main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>
          Built with care by Byte-Me. <br />  
Together, let’s make mental health support accessible and stigma-free.
        </p>
      </footer>
    </div>
  );
}
