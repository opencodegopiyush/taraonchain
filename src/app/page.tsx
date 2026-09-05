"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import Landing from "@/components/Landing";
import CaseDesk from "@/components/desk/CaseDesk";
import Overlays from "@/components/desk/Overlays";

export default function Page() {
  const view = useStore((s) => s.view);
  const rehydrate = useStore((s) => s.rehydrate);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  return (
    <main className="bg-background text-foreground">
      {view === "landing" ? <Landing key="landing" /> : <CaseDesk key="desk" />}
      <Overlays />
    </main>
  );
}
