"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import React, { useContext, useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useSidebar } from "../ui/sidebar";
import Link from "next/link";

interface Workspace {
  _id: Id<"workspace">;
  _creationTime: number;
  fileData?: any;
  messages: any;
  user: Id<"users">;
}

function WorkSpaceHistory() {
  const userDetailContext = useContext(UserDetailContext);

  if (!userDetailContext) {
    throw new Error("UserDetailContext is not provided.");
  }

  const { userDetail } = userDetailContext;
  const convex = useConvex();

  // Initialize with proper type and empty array
  const [workspaceList, setWorkspaceList] = useState<Workspace[]>([]);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    if (userDetail && userDetail._id) {
      GetAllWorkspace();
    }
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    try {
      if (userDetail && userDetail._id) {
        const result = await convex.query(api.workspace.GetAllWorkspace, {
          userId: userDetail._id,
        });
        setWorkspaceList(result || []);
        console.log("Workspaces:", result);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  return (
    <div>
      <h2 className="font-medium text-lg">Your Chats</h2>
      <div>
        {workspaceList &&
          workspaceList?.map((workspace, index) => (
            <Link href={"/workspace/" + workspace?._id} key={index}>
              <h2
                onClick={toggleSidebar}
                className="text-sm text-gray-400 mt-2 font-ligh hover:text-white cursor-pointer"
              >
                {workspace?.messages[0]?.content}
              </h2>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default WorkSpaceHistory;
