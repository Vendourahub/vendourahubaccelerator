import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner@2.0.3";
import { useEffect } from "react";
import { initializeStorage } from "./lib/localStorage";
import { seedDefaultData } from "./lib/seedData";

// Vendoura Hub - LocalStorage Mode - Build: 2026-02-13
export default function App() {
  useEffect(() => {
    // Initialize localStorage system
    initializeStorage();
    
    // Seed default data on first load
    const hasSeeded = localStorage.getItem('vendoura_seeded');
    if (!hasSeeded) {
      seedDefaultData().then(() => {
        localStorage.setItem('vendoura_seeded', 'true');
      });
    }
    
    console.log('✅ Vendoura Hub initialized (LocalStorage Mode)');
  }, []);

  // Global scroll position reset on route change
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <>
      <RouterProvider 
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
      <Toaster position="top-right" />
    </>
  );
}