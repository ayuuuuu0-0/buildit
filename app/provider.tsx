"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConvexProvider, useConvex } from "convex/react";
import Header from "@/components/custom/header";
import Hero from "@/components/custom/Hero";
import { AuroraBackground } from "../components/ui/aurora-background";
import { MessagesContext, Message } from "@/context/MessagesContext";
import { UserDetailContext, userDetail } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import AppSideBar from "@/components/custom/AppSideBar";

interface ProviderProps {
  children: ReactNode;
}

function LayoutWithSidebar({ children }: { children: ReactNode }) {
  const { open } = useSidebar();
  return (
    <div className="flex min-h-screen relative z-10">
      {open && <AppSideBar />}
      <div className={`flex-1 flex flex-col ${open ? "pl-60" : ""}`}>
        <div className="sticky top-0 z-20"></div>
        <main className="flex-1 flex items-center">
          <div className="w-full flex justify-center">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Provider({ children }: ProviderProps) {
  const [userDetail, setUserDetail] = useState<userDetail | null>(null);
  const convex = useConvex();

  useEffect(() => {
    if (typeof window !== "undefined") {
      IsAuthenticated();
    }
  }, []);

  const IsAuthenticated = async () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });
      if (result) {
        setUserDetail(result);
      }
      console.log(result);
    }
  };

  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <ConvexProvider client={convex}>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY || ""}
      >
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <NextThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <div className="relative min-h-screen">
                <AuroraBackground className="absolute inset-0 z-0">
                  <div className="sr-only"></div>
                </AuroraBackground>
                <SidebarProvider defaultOpen={false}>
                  <LayoutWithSidebar>{children}</LayoutWithSidebar>
                </SidebarProvider>
              </div>
            </NextThemeProvider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </ConvexProvider>
  );
}

export default Provider;
