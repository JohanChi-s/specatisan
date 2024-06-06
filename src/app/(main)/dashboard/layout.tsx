import { AI } from "@/components/chat/lib/chat/actions";
import { nanoid } from "@/components/chat/lib/utils";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  params: any;
}

const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  // const { data: products, error } = await getActiveProductsWithPrice();
  // if (error) throw new Error();

  const id = nanoid();
  return (
    <main className="flex">
      {/* <SubscriptionModalProvider products={products}> */}
      <AI>{children}</AI>
      {/* </SubscriptionModalProvider> */}
    </main>
  );
};

export default Layout;
