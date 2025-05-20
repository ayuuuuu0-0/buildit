import { HelpCircle, LogOut, Settings, Wallet } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";
import { toast } from "sonner";

interface SidebarOption {
  name: string;
  icon: React.ElementType;
  path?: string;
  action?: () => void;
}

function SideBarFooter() {
  const router = useRouter();
  const userDetailContext = useContext(UserDetailContext);

  if (!userDetailContext) {
    throw new Error(
      "SideBarFooter must be used within UserDetailContext provider"
    );
  }

  const { setUserDetail } = userDetailContext;
  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");

    // Clear user data from context
    setUserDetail(null as any);
    console.log(setUserDetail);
    // Show success message
    toast.success("Signed out successfully");

    // Redirect to home page
    router.push("/");
  };

  const options: SidebarOption[] = [
    {
      name: "Settings",
      icon: Settings,
    },
    {
      name: "Help Center",
      icon: HelpCircle,
    },
    {
      name: "My Subscription",
      icon: Wallet,
      path: "/pricing",
    },
    {
      name: "Sign Out",
      icon: LogOut,
      action: handleSignOut,
    },
  ];
  const onOptionClick = (option: SidebarOption) => {
    if (option.action) {
      option.action();
    } else if (option.path) {
      router.push(option.path);
    }
  };
  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          variant="ghost"
          onClick={() => onOptionClick(option)}
          className="w-full flex justify-start"
          key={index}
        >
          <option.icon />
          {option.name}
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;
