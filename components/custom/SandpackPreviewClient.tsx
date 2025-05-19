import { ActionContext } from "@/context/ActionContext";
import {
  SandpackPreview,
  SandpackPreviewRef,
  useSandpack,
} from "@codesandbox/sandpack-react";
import React, { useContext, useEffect, useRef, useState } from "react";

function SandpackaPreviewClient() {
  const previewRef = useRef<SandpackPreviewRef>(null);
  const { sandpack } = useSandpack();
  const { action, setAction } = useContext(ActionContext);
  const [clientReady, setClientReady] = useState(false);
  const [sandboxInfo, setSandboxInfo] = useState<{
    sandboxId: string;
    editorUrl: string;
    embedUrl: string;
  } | null>(null);

  // useEffect(() => {
  //   // Add a small delay to ensure the client is ready
  //   const timer = setTimeout(() => {
  //     GetSandpackClient();
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [sandpack, action]); // Fixed dependency array syntax

  // const GetSandpackClient = async () => {
  //   try {
  //     // Check if previewRef.current exists before trying to get the client
  //     if (!previewRef.current) {
  //       console.log("Preview ref is not available yet");
  //       return;
  //     }

  //     const client = previewRef.current.getClient();
  //     if (client) {
  //       console.log("Client obtained:", client);
  //       const result = await (client as any).getCodeSandboxURL();
  //       console.log("Sandbox info:", result);

  //       if (result && result.sandboxId) {
  //         setSandboxInfo({
  //           sandboxId: result.sandboxId,
  //           editorUrl: result.editorUrl,
  //           embedUrl: result.embedUrl,
  //         });
  //       } else {
  //         console.log("Couldn't retrieve sandbox information");
  //       }
  //     } else {
  //       console.log("Couldn't get Sandpack client");
  //     }
  //   } catch (err) {
  //     console.error("Error getting sandbox URL:", err);
  //     console.log(`Error: ${err instanceof Error ? err.message : String(err)}`);
  //   }

  //   if (action?.actionType == "deploy") {
  //     window.open('https://+result?sandboxId+'.csb.app/');
  //   }else if(action?.actionType=="export"){
  //  window?.open(result?.editorUrl)
  // }
  // };
  /////////////VERSION 2.0//////////////////////////////
  // useEffect(() => {
  //   // Only run when there's an action
  //   if (action?.actionType === "deploy" || action?.actionType === "export") {
  //     GetSandpackClient();
  //   }
  // }, [action]);

  // const GetSandpackClient = async () => {
  //   try {
  //     if (!previewRef.current) {
  //       console.log("Preview ref is not available yet");
  //       return;
  //     }

  //     const client = previewRef.current.getClient();
  //     if (client) {
  //       console.log("Client obtained:", client);
  //       const result = await (client as any).getCodeSandboxURL();
  //       console.log("Sandbox info:", result);

  //       if (result && result.sandboxId) {
  //         setSandboxInfo(result);

  //         // Handle specific actions
  //         if (action?.actionType === "deploy") {
  //           // Open the deployed app
  //           window.open(`https://${result.sandboxId}.csb.app/`, "_blank");
  //         } else if (action?.actionType === "export") {
  //           // Open the editor URL
  //           window.open(result.editorUrl, "_blank");
  //         }

  //         // Reset action after processing
  //         if (setAction) {
  //           setAction(null);
  //         }
  //       } else {
  //         console.log("Couldn't retrieve sandbox information");
  //       }
  //     } else {
  //       console.log("Couldn't get Sandpack client");
  //     }
  //   } catch (err) {
  //     console.error("Error getting sandbox URL:", err);
  //     console.log(`Error: ${err instanceof Error ? err.message : String(err)}`);
  //   }
  // };

  //////////////////VERSION 3.0////////////////////////
  useEffect(() => {
    let isMounted = true;
    let attempts = 0;
    const maxAttempts = 5;

    const initClient = () => {
      if (!isMounted) return;

      const client = previewRef.current?.getClient();
      if (client) {
        console.log("Sandpack client initialized successfully");
        setClientReady(true);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(
          `Waiting for Sandpack client (attempt ${attempts}/${maxAttempts})...`
        );
        // Try again after a delay
        setTimeout(initClient, 1000);
      } else {
        console.error(
          "Failed to initialize Sandpack client after multiple attempts"
        );
      }
    };

    // Give Sandpack a moment to set up
    setTimeout(initClient, 2000);

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for action triggers after client is ready
  useEffect(() => {
    if (!clientReady) return;

    if (action?.actionType === "deploy" || action?.actionType === "export") {
      console.log(`Processing ${action.actionType} action`);
      GetSandpackClient();
    }
  }, [action, clientReady]);

  const GetSandpackClient = async () => {
    try {
      if (!previewRef.current) {
        console.error("Preview ref is not available");
        return;
      }

      const client = previewRef.current.getClient();
      if (!client) {
        console.error("Sandpack client not available");
        return;
      }

      console.log("Client accessed successfully:", client);

      // Add a small timeout to ensure client is ready for operations
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        const result = await (client as any).getCodeSandboxURL();
        console.log("Sandbox info retrieved:", result);

        if (result && result.sandboxId) {
          setSandboxInfo(result);

          // Handle specific actions
          if (action?.actionType === "deploy") {
            // Open the deployed app
            const deployUrl = `https://${result.sandboxId}.csb.app/`;
            console.log("Opening deploy URL:", deployUrl);
            window.open(deployUrl, "_blank");
          } else if (action?.actionType === "export") {
            // Open the editor URL
            console.log("Opening editor URL:", result.editorUrl);
            window.open(result.editorUrl, "_blank");
          }

          // Reset action after processing
          if (setAction) {
            setAction(null);
          }
        } else {
          console.warn("Couldn't retrieve sandbox information from result");
          // Try alternative approach
          tryAlternativeApproach(client);
        }
      } catch (innerErr) {
        console.error("Error getting CodeSandbox URL:", innerErr);
        // Try alternative approach when method fails
        tryAlternativeApproach(client);
      }
    } catch (err) {
      console.error("Error in GetSandpackClient:", err);
    }
  };
  const tryAlternativeApproach = (client: any) => {
    try {
      // Try to get URL from iframe
      const iframe = client.iframe;
      if (iframe?.src) {
        const iframeSrc = iframe.src;
        console.log("Using iframe src as fallback:", iframeSrc);

        // Try to extract sandbox ID from URL
        const srcParts = iframeSrc.split("/");
        const potentialId = srcParts[srcParts.length - 1].split("?")[0];

        const result = {
          sandboxId: potentialId || "fallback-id",
          editorUrl: `https://codesandbox.io/s/${potentialId}`,
          embedUrl: `https://codesandbox.io/embed/${potentialId}`,
        };

        setSandboxInfo(result);

        // Handle actions with fallback approach
        if (action?.actionType === "deploy") {
          window.open(`https://${potentialId}.csb.app/`, "_blank");
        } else if (action?.actionType === "export") {
          window.open(result.editorUrl, "_blank");
        }

        // Reset action
        if (setAction) {
          setAction(null);
        }
      } else {
        console.error("No iframe src available for fallback");
      }
    } catch (fallbackErr) {
      console.error("Error in fallback approach:", fallbackErr);
    }
  };

  return (
    <SandpackPreview
      ref={previewRef}
      style={{ height: "60vh" }}
      showNavigator={true}
    />
  );
}

export default SandpackaPreviewClient;
