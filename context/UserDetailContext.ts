import { createContext } from "react";
import { Id } from "@/convex/_generated/dataModel";

export interface userDetail {
  name: string;
  email: string;
  _id: Id<"users">;
  picture: string;
}

export interface UserDetailContextType {
  userDetail: userDetail | null;
  setUserDetail: (userDetail: userDetail) => void;
}

export const UserDetailContext = createContext<
  UserDetailContextType | undefined
>(undefined);
