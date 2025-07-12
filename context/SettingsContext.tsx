"use client";
import React, { createContext, useContext } from "react";

export const SettingsContext = createContext(null);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsContext.Provider");
  }
  return context;
}

export function SettingsProvider({
  settings,
  children,
}: {
  settings: any;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
