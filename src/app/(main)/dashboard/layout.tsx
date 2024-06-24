import { nanoid } from "@/components/chat/lib/utils";
import { SubscriptionModalProvider } from "@/lib/providers/subscription-modal-provider";
import { getActiveProductsWithPrice } from "@/lib/supabase/queries";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  params: any;
}

const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  return <main className="flex">{children}</main>;
};

export default Layout;
