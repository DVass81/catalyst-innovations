"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { decidePurchase, initialPurchases, type Purchase } from "@/lib/demo";
type DemoContext = {
  purchases: Purchase[];
  decide: (
    id: string,
    status: "approved" | "returned",
    reason?: string,
  ) => void;
  reset: () => void;
};
const Context = createContext<DemoContext | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  return (
    <Context.Provider
      value={{
        purchases,
        decide: (id, status, reason) =>
          setPurchases((p) => decidePurchase(p, id, status, reason)),
        reset: () => setPurchases(initialPurchases),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePurchases() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("DemoProvider is required");
  return ctx;
}
