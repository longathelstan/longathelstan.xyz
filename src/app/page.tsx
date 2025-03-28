"use client";

import { Suspense } from "react";
import HomeClient from "./client-page";

export default function Home() {
  return (
    <Suspense fallback={<div className="animate-pulse bg-muted rounded-lg h-[400px] w-full"></div>}>
      <HomeClient />
    </Suspense>
  );
}
