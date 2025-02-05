"use client";

import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { AuroraBackground } from "../ui/aurora-background";
import Lookup from "@/data/Lookup";
import { ArrowRight, ChevronRight, Link } from "lucide-react";
import { Button } from "../ui/button";
import { BackgroundGradient } from "../ui/background-gradient";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SigninDialog from "./SigninDialog";

function Hero() {
  const [userInput, setUserInput] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);

  const userDetailContext = useContext(UserDetailContext);
  const messagesContext = useContext(MessagesContext);

  if (!messagesContext || !userDetailContext) {
    throw new Error("Hero must be used within required providers");
  }

  const { messages, setMessages } = messagesContext;
  const { userDetail, setUserDetail } = userDetailContext;

  const onGenerate = (input: string) => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: input,
        },
      ]);
      setUserInput("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative flex flex-col gap-4 items-center justify-center px-4"
    >
      <div className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-center relative z-20 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-white py-2 font-poppins">
        Ship Your Idea Today
      </div>
      <p className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-white py-1 font-poppins">
        With BuildIt!
      </p>

      <BackgroundGradient
        containerClassName="w-full max-w-4xl"
        className="w-full"
      >
        <div className="w-full p-4 rounded-3xl bg-[#131313]">
          <div className="flex gap-2">
            <textarea
              placeholder="What do you want to build today?"
              onChange={(event) => setUserInput(event.target.value)}
              className="outline-none bg-transparent w-full h-48 max-h-72 resize-none text-white placeholder:text-lg font-poppins rounded-xl p-3"
            />
            {userInput && (
              <Button
                onClick={() => onGenerate(userInput)}
                variant="outline"
                size="icon"
                style={{ color: "white" }}
                className="h-10 w-10"
              >
                <ChevronRight />
              </Button>
            )}
          </div>
          <div className="mt-2">
            <Link className="h-5 w-5 text-white" />
          </div>
        </div>
      </BackgroundGradient>
      <div className="flex flex-wrap text-white max-w-2xl items-center justify-center gap-3">
        {Lookup?.SUGGESTIONS.map((suggestion, index) => (
          <h2
            key={index}
            onClick={() => onGenerate(suggestion)}
            className="p-2 px-4 border border-white/20 rounded-lg bg-black/50 py- text-md text-slate-300 hover:text-white cursor-pointer"
          >
            {suggestion}
          </h2>
        ))}
      </div>
      <SigninDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </motion.div>
  );
}

export default Hero;
