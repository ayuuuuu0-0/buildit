"use client";

import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import Prompt from "@/data/Prompt";
import { MessagesContext } from "@/context/MessagesContext";
import { api } from "@/convex/_generated/api";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2Icon } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { countToken } from "./ChatView";
import SandpackaPreviewClient from "./SandpackPreviewClient";
import { ActionContext } from "@/context/ActionContext";

interface MessagesContextType {
  messages: Array<{
    role: string;
    content: string;
  }>;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

function CodeView() {
  const params = useParams();
  const workspaceId = params.id as Id<"workspace"> | undefined;
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);

  const messagesContext = useContext(MessagesContext) as MessagesContextType;
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const { messages, setMessages } = messagesContext;
  const convex = useConvex();
  const [loading, setLoading] = useState(false);
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const userDetailContext = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext);

  if (!userDetailContext) {
    throw new Error("Hero must be used within required providers");
  }
  const { userDetail, setUserDetail } = userDetailContext;

  useEffect(() => {
    if (workspaceId) {
      GetFiles();
    }
  }, [workspaceId]);

  useEffect(() => {
    setActiveTab("preview");
  }, [action]);

  const GetFiles = async () => {
    setLoading(true);
    try {
      // Fixed the query call with correct parameter name
      const result = await convex.query(api.workspace.GetWorkSpace, {
        workspaceId: workspaceId as Id<"workspace">,
      });

      // Fixed typo in variable name from mergedFile to mergedFiles
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
      setFiles(mergedFiles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching files:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == "user") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
    try {
      const result = await axios.post("/api/gen-ai-code", {
        prompt: PROMPT,
      });
      console.log(result.data);
      const aiResp = result.data;

      const mergedFile = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
      setFiles(mergedFile);
      if (workspaceId) {
        await UpdateFiles({
          workspaceId: workspaceId,
          files: aiResp?.files,
        });

        const token =
          Number(userDetail?.token) -
          Number(countToken(JSON.stringify(aiResp)));

        if (userDetail && userDetail._id) {
          await UpdateTokens({
            userId: userDetail._id,
            token: token,
          });
        }

        setActiveTab("code");
        setLoading(false);
      } else {
        console.error("Workspace ID is undefined");
      }
    } catch (error) {
      console.error("Error generating AI code:", error);
    }
  };
  return (
    <div className="flex flex-col relative">
      <div className="bg-[#151515] w-full p-2 border text-white pl-2">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 justify-center rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab === "code" && "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"}`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab === "preview" && "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"}`}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        files={files}
        template="react"
        theme={"dark"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
      >
        <SandpackLayout>
          {activeTab == "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "60vh" }} />
              <SandpackCodeEditor style={{ height: "60vh" }} />
            </>
          ) : (
            <>
              <SandpackaPreviewClient />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
      {loading && (
        <div className="p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white">Generating your files...</h2>
        </div>
      )}
    </div>
  );
}

export default CodeView;

////////////V2////////////////////////////////////////////

// "use client";

// import React from "react";
// import { useState } from "react";
// import {
//   SandpackProvider,
//   SandpackLayout,
//   SandpackCodeEditor,
//   SandpackPreview,
//   SandpackFileExplorer,
// } from "@codesandbox/sandpack-react";

// function CodeView() {
//   const [activeTab, setActiveTab] = useState("code");

//   // Debug function to verify click handling
//   interface TabChangeHandler {
//     (tab: "code" | "preview"): void;
//   }

//   const handleTabChange: TabChangeHandler = (tab) => {
//     console.log("Tab clicked:", tab);
//     setActiveTab(tab);
//   };

//   return (
//     <div className="relative">
//       {/* Positioned at the top with higher z-index to ensure clickability */}
//       <div className="bg-[#151515] w-full p-2 border text-white relative z-10">
//         <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 justify-center rounded-full">
//           <button
//             type="button"
//             onClick={() => handleTabChange("code")}
//             className={`text-sm cursor-pointer ${activeTab === "code" ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full" : "p-1 px-2"}`}
//           >
//             Code
//           </button>
//           <button
//             type="button"
//             onClick={() => handleTabChange("preview")}
//             className={`text-sm cursor-pointer ${activeTab === "preview" ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full" : "p-1 px-2"}`}
//           >
//             Preview
//           </button>
//         </div>
//       </div>

//       {/* Container with position relative for proper stacking context */}
//       <div className="relative" style={{ position: "relative" }}>
//         <SandpackProvider template="react" theme="dark">
//           <SandpackLayout style={{ height: "80vh" }}>
//             <SandpackFileExplorer />
//             {activeTab === "code" && (
//               <SandpackCodeEditor style={{ height: "80vh" }} />
//             )}
//             {activeTab === "preview" && (
//               <SandpackPreview style={{ height: "80vh" }} />
//             )}
//           </SandpackLayout>
//         </SandpackProvider>
//       </div>
//     </div>
//   );
// }

// export default CodeView;

////////////////////////////V3/////////////////////
// "use client";

// import React from "react";
// import { useState, useEffect } from "react";
// import {
//   SandpackProvider,
//   SandpackLayout,
//   SandpackCodeEditor,
//   SandpackPreview,
//   SandpackFileExplorer,
// } from "@codesandbox/sandpack-react";

// function CodeView() {
//   const [activeTab, setActiveTab] = useState("code");

//   // Debug function to verify click handling
//   const handleTabChange = (tab: "code" | "preview") => {
//     console.log("Tab clicked:", tab);
//     setActiveTab(tab);
//   };

//   return (
//     <div className="flex flex-col h-full pl-10">
//       {/* Tab navigation at the top */}
//       <div className="bg-[#151515] w-full p-2 pl-2 border-b border-gray-700 text-white z-10">
//         <div className="flex items-center bg-black p-1 rounded-full w-fit gap-3">
//           <button
//             type="button"
//             onClick={() => handleTabChange("code")}
//             className={`text-sm cursor-pointer p-1 px-3 rounded-full ${
//               activeTab === "code"
//                 ? "bg-blue-500 bg-opacity-25 text-blue-500"
//                 : ""
//             }`}
//           >
//             Code
//           </button>
//           <button
//             type="button"
//             onClick={() => handleTabChange("preview")}
//             className={`text-sm cursor-pointer p-1 px-3 rounded-full ${
//               activeTab === "preview"
//                 ? "bg-blue-500 bg-opacity-25 text-blue-500"
//                 : ""
//             }`}
//           >
//             Preview
//           </button>
//         </div>
//       </div>

//       {/* Sandpack container */}
//       <div className="flex-1 overflow-hidden">
//         <SandpackProvider template="react" theme="dark">
//           <SandpackLayout
//             style={{
//               height: "60vh",
//               marginLeft: "-5px", // Added negative margin to shift left
//             }}
//           >
//             <SandpackFileExplorer style={{ height: "60vh" }} />
//             {activeTab === "code" && (
//               <SandpackCodeEditor style={{ height: "60vh" }} />
//             )}
//             {activeTab === "preview" && (
//               <SandpackPreview style={{ height: "60vh" }} />
//             )}
//           </SandpackLayout>
//         </SandpackProvider>
//       </div>
//     </div>
//   );
// }

// export default CodeView;
