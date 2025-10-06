"use client";

import { useEffect } from "react";

import { Toaster } from "sonner";

import "./App.css";
import { trapApplicationTouched } from "@/lib/config/AppInitializer";

import Providers from "./Providers";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    trapApplicationTouched();
  }, []);

  return (
    <Providers>
      <Toaster
        position="top-right"
        richColors
        theme="dark"
        duration={4000}
        expand
        toastOptions={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          },
        }}
      />
      <div className="App" id="App">
        {children}
      </div>
    </Providers>
  );
}
