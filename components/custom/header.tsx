import React, { useContext } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import Link from "next/link";
import { Download, Rocket, Upload } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { ActionContext } from "@/context/ActionContext";

function Header() {
  const userDetailContext = useContext(UserDetailContext);

  if (!userDetailContext) {
    throw new Error("Hero must be used within required providers");
  }

  const { userDetail, setUserDetail } = userDetailContext;
  const { toggleSidebar } = useSidebar();
  const { action, setAction } = useContext(ActionContext);
  const onActionBtn = (action: any) => {
    setAction({
      actionType: action,
      timeStamp: Date.now(),
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-20 bg-transparent">
      <Link href="/" className="cursor-pointer">
        <Image src={"/buildit2.png"} alt="logo" width={100} height={100} />
      </Link>
      {userDetail && !userDetail.name && (
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="text-white font-poppins text-xl h-12"
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            className="text-white font-poppins font-medium text-xl w-40 h-12"
          >
            Get started
          </Button>
        </div>
      )}
      <div className="flex items-center gap-4">
        {/* Export button */}
        <Button
          onClick={() => onActionBtn("export")}
          variant="outline"
          size="icon"
          className="text-white font-poppins font-medium text-xl w-40 h-12"
          title="Export"
        >
          Export
          <Download className="h-5 w-5" />
        </Button>

        {/* Deploy button */}
        <Button
          onClick={() => onActionBtn("deploy")}
          variant="outline"
          size="icon"
          className="text-white font-poppins font-medium text-xl w-40 h-12"
          title="Deploy"
        >
          Deploy
          <Rocket className="h-5 w-5" />
        </Button>

        {/* User profile picture - using your provided code */}
        {userDetail?.picture ? (
          <Image
            onClick={toggleSidebar}
            className="rounded-full cursor-pointer"
            src={userDetail.picture} // Now guaranteed to be non-empty
            alt="user"
            width={50}
            height={50}
          />
        ) : (
          // Fallback when no picture is available
          <div
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer"
          >
            <span className="text-white text-sm">
              {userDetail?.name?.charAt(0) || "X"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
