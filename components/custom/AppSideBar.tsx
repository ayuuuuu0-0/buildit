import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";
import { MessageCircleCode } from "lucide-react";
import { Button } from "../ui/button";
import WorkSpaceHistory from "./WorkspaceHistory";
import SideBarFooter from "./SideBarFooter";

function AppSideBar() {
  return (
    <aside className="transition-all duration-300 w-64 bg-background border-r transform">
      <Sidebar>
        <SidebarHeader className="p-10" />
        <SidebarContent className="p-5 pt-10">
          <Button>
            <MessageCircleCode /> Start New Chat
          </Button>
          <WorkSpaceHistory />
          <SidebarGroup />
          {/* <SidebarGroup /> */}
          <div className="mt-auto">
            <SidebarFooter>
              <SideBarFooter />
            </SidebarFooter>
          </div>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    </aside>
  );
}

export default AppSideBar;
