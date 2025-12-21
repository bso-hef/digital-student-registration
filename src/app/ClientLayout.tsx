"use client";

import { useEffect } from "react";

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
      <div className="App" id="App">
        {children}
      </div>
    </Providers>
  );
}
