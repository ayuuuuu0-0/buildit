import React, { useContext } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import Link from "next/link";

function Header() {
  const userDetailContext = useContext(UserDetailContext);

  if (!userDetailContext) {
    throw new Error("Hero must be used within required providers");
  }

  const { userDetail, setUserDetail } = userDetailContext;

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
    </div>
  );
}

export default Header;
