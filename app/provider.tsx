"use client";

import React, { ReactNode, useState } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Header from "@/components/custom/header";
import Hero from "@/components/custom/Hero";
import { AuroraBackground } from "../components/ui/aurora-background";
import { MessagesContext, Message } from "@/context/MessagesContext";
import { UserDetailContext, userDetail } from "@/context/UserDetailContext";

interface ProviderProps {
  children: ReactNode;
}

function Provider({ children }: ProviderProps) {
  const [userDetail, setUserDetail] = useState<userDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  return (
    <div>
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
              <AuroraBackground>
                <div className="relative z-10">
                  <Header />
                  <Hero />
                  {children}
                </div>
              </AuroraBackground>
            </NextThemeProvider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Provider;

// client id 81209386305-luku6hpjm3qh5gv0a0soa9skb0bfmm9g.apps.googleusercontent.com

//client secret
//GOCSPX - vkJKiVQemICus6NR1tRtdwlVJrst;
