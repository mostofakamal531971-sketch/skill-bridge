"use client";

import { useCallback } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

/* ---------- Utils ---------- */
function randomID(len: number = 5): string {
  const chars =
    "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/* ---------- Component ---------- */
export default function VideoCallUIKit() {
  const roomID = "habib"; // ← from booking / backend ideally

  const myMeeting = useCallback((element: HTMLDivElement | null) => {
    if (!element) return;
    if (typeof window === "undefined") return;

    const appID = 1635164080;

    // ⚠️ FOR TESTING ONLY
    // NEVER expose serverSecret in production
    const serverSecret = "bf6f9b305efa7b9c0746e7142198e362";

    const userID = randomID(6);
    const userName = `User-${userID}`;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.origin +
            window.location.pathname +
            `?roomID=${roomID}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      showLeaveRoomConfirmDialog: true,
    });
  }, []);

  return (
    <div
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

