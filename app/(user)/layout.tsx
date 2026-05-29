import React from "react";
import UserConversationDock from "@/components/chat/UserConversationDock";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <UserConversationDock />
    </div>
  );
}
