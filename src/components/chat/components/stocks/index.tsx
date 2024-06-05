"use client";

import dynamic from "next/dynamic";
import { EventsSkeleton } from "./events-skeleton";

export { BotCard, BotMessage, SystemMessage } from "./message";
export { spinner } from "./spinner";

const Events = dynamic(() => import("./events").then((mod) => mod.Events), {
  ssr: false,
  loading: () => <EventsSkeleton />,
});

export { Events };
