import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { v4 as uuidv4 } from "uuid"; // Import the uuid library
import { api } from "@/convex/_generated/api";

interface SigninDialogProps {
  openDialog: boolean;
  closeDialog: (open: boolean) => void;
}

function SigninDialog({ openDialog, closeDialog }: SigninDialogProps) {
  const context = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.CreateUser);

  if (!context) {
    throw new Error(
      "SigninDialog must be used within a UserDetailContext.Provider"
    );
  }

  const { userDetail, setUserDetail } = context;
  // const googleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     console.log("Google login success:", tokenResponse);
  //     const userInfo = await axios.get(
  //       "https://www.googleapis.com/oauth2/v3/userinfo",
  //       { headers: { Authorization: "Bearer " + tokenResponse?.access_token } }
  //     );

  //     console.log("User info:", userInfo);
  //     const user = userInfo.data;

  //     await CreateUser({
  //       name: user?.name,
  //       email: user?.email,
  //       picture: user?.picture,
  //       uid: uuidv4(),
  //     });

  //     if (typeof window !== undefined) {
  //       localStorage.setItem("user", JSON.stringify(user));
  //     }
  //     setUserDetail(userInfo?.data);
  //     closeDialog(false);
  //   },
  //   onError: (errorResponse) => console.log(errorResponse),
  // });

  // Update your googleLogin success callback
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Google login success:", tokenResponse);

        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: "Bearer " + tokenResponse?.access_token },
          }
        );

        console.log("User info:", userInfo);
        const user = userInfo.data;

        // Generate and log the UUID
        const uuid = uuidv4();
        console.log("Generated UUID:", uuid);

        console.log("About to create user with data:", {
          name: user.name,
          email: user.email,
          picture: user.picture || "",
          uid: uuid,
        });

        try {
          const result = await CreateUser({
            name: user.name,
            email: user.email,
            picture: user.picture || "",
            uid: uuid,
          });

          console.log("Full result from CreateUser:", result);

          if (result && result.success) {
            console.log("User operation successful. ID:", result.id);
            console.log("Is new user:", result.isNew);

            // Continue with your logic
            if (typeof window !== "undefined") {
              localStorage.setItem(
                "user",
                JSON.stringify({
                  ...user,
                  convexId: result.id, // Store the Convex ID too
                })
              );
            }

            setUserDetail(user);
            closeDialog(false);
          } else {
            console.error(
              "Failed to create user:",
              result ? result.error : "Unknown error"
            );
          }
        } catch (error) {
          console.error("Exception during CreateUser call:", error);
        }
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    },
    onError: (error) => console.error("Google login error:", error),
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <div className="flex flex-col items-center justify-center gap-3">
              <h2 className="font-bold text-2xl text-center">
                {Lookup.SIGNIN_HEADING}
              </h2>
              <p className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</p>
              <Button
                className="bg-white/50 text-white hover:bg-white/20 mt-3"
                onClick={() => googleLogin()}
              >
                Sign In With Google
              </Button>
              <p className="">{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SigninDialog;
