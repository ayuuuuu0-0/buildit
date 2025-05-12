"use client";
import React from "react";
import Header from "@/components/custom/header";
import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";

export default function WorkspacePage() {
  return (
    <>
      <Header />
      <div className="p-1 pr-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <ChatView />
          <div className="col-span-2">
            <CodeView />
          </div>
        </div>
      </div>
    </>
  );
}
