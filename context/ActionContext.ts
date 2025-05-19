import { createContext } from "react";

// Define the shape of an action
export interface Action {
  actionType: string;
  timeStamp: number;
}

// Define the context type
interface ActionContextType {
  action: Action | null;
  setAction: (action: Action | null) => void;
}

// Create the context with proper default values
export const ActionContext = createContext<ActionContextType>({
  action: null,
  setAction: () => {},
});
