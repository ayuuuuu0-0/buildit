import { createContext } from "react";

export interface userDetail {
  name: string;
  email: string;
}

export interface UserDetailContextType {
  userDetail: userDetail | null;
  setUserDetail: (userDetail: userDetail) => void;
}

export const UserDetailContext = createContext<
  UserDetailContextType | undefined
>(undefined);
