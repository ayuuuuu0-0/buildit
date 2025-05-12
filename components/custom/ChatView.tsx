import { api } from "@/convex/_generated/api";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/data/Colors";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronRight, Loader2Icon } from "lucide-react";
import { Link } from "lucide-react";
import Prompt from "@/data/Prompt";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "../ui/sidebar";

export const countToken = (inputText: string): number => {
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

function ChatView() {
  const params = useParams();
  const convex = useConvex();
  const [userInput, setUserInput] = useState<string>("");
  const userDetailContext = useContext(UserDetailContext);
  const messagesContext = useContext(MessagesContext);
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const UpdateToken = useMutation(api.users.UpdateToken);
  const { toggleSidebar } = useSidebar();

  if (!messagesContext || !userDetailContext) {
    throw new Error("Hero must be used within required providers");
  }

  const { messages, setMessages } = messagesContext;
  const { userDetail, setUserDetail } = userDetailContext;

  // Extract the ID and ensure it's a string
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : undefined;

  useEffect(() => {
    if (id) {
      GetWorkspaceData();
    }
  }, [id]);

  const GetWorkspaceData = async () => {
    if (!id) return;

    try {
      // Convert the string ID to a Convex ID
      const workspaceId = id as Id<"workspace">;

      const result = await convex.query(api.workspace.GetWorkSpace, {
        workspaceId: workspaceId,
      });

      setMessages(result?.messages);
      console.log("Workspace data:", result);
    } catch (error) {
      console.error("Error fetching workspace:", error);
    }
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-chat", {
      prompt: PROMPT,
    });

    const aiResp = {
      role: "ai",
      content: result.data.result,
    };

    setMessages((prev) => [...prev, aiResp]);

    await UpdateMessages({
      messages: [...messages, aiResp],
      workspaceId: id as Id<"workspace">,
    });

    const token = countToken(JSON.stringify(aiResp));
    //Update Tokens in DB

    setLoading(false);
  };

  const onGenerate = (input: string) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);
  };

  return (
    <div className="relative h-[75vh] flex flex-col w-full max-w-[1400px] mx-auto px-5 pl-6 sm:px-2 sm:pl-4">
      <div className="flex-1 overflow-y-auto w-full pb-6 sm:pb-5 scrollbar-hide">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className="p-5 sm:p-2.5 rounded-xl mb-3 text-white flex items-start gap-4 sm:gap-1.5 border border-gray-700 shadow-lg backdrop-blur-sm w-full leading-7"
            style={{
              backgroundColor: "#151515",
              //"rgba(25, 25, 35, 0.8)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            {msg?.role === "user" && userDetail?.picture && (
              <Image
                src={userDetail.picture}
                alt="userImages"
                width={48}
                height={48}
                className="rounded-full border-2 border-blue-400 sm:w-8 sm:h-8 flex-shrink-0"
              />
            )}
            <div className="flex flex-col text-white leading-relaxed">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div
            className="p-5 sm:p-2.5 rounded-xl mb-3 text-white flex items-start gap-4 sm:gap-1.5 border border-gray-700/40 shadow-lg backdrop-blur-sm w-full"
            style={{
              backgroundColor: "rgba(25, 25, 35, 0.8)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Loader2Icon className="animate-spin" />
            <h2>Generate response...</h2>
          </div>
        )}
      </div>
      <div className="flex gap-2 items-end">
        {userDetail && (
          <Image
            onClick={toggleSidebar}
            className="rounded-full cursor-pointer"
            src={userDetail!?.picture}
            alt="user"
            width={30}
            height={30}
          />
        )}
        <div className="w-full px-8 sm:px-3 rounded-xl bg-gray-900 border border-gray-700 shadow-lg mt-4 sm:mt-2">
          <div className="flex gap-4 sm:gap-2 items-start">
            <textarea
              placeholder="What do you want to build today?"
              onChange={(event) => setUserInput(event.target.value)}
              value={userInput}
              className="outline-none bg-transparent w-full h-40 sm:h-24 resize-none text-white placeholder:text-gray-400 font-poppins rounded-lg p-8 sm:p-3"
              style={{ minWidth: "calc(100% - 50px)" }}
            />
            {userInput && (
              <Button
                onClick={() => onGenerate(userInput)}
                variant="outline"
                size="icon"
                style={{ color: "white" }}
                className="h-12 w-12 sm:h-9 sm:w-9 border-[1px] border-gray-700/30 hover:bg-blue-500/10 transition-colors self-start mt-2"
              >
                <ChevronRight className="h-5 w-5 sm:h-3.5 sm:w-3.5" />
              </Button>
            )}
          </div>
          <div className="mb-5 sm:mb-2.5">
            <Link className="h-5 w-5 text-white/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
