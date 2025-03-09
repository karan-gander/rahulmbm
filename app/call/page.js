"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Initialize Socket.IO client (update the URL to your server if different)
const socket = io("http://localhost:3000");

export default function Call() {
  const searchParams = useSearchParams();
  const roomID = searchParams.get("roomID"); // Get roomID from URL query params
  const [roomId, setRoomId] = useState(roomID); // Store roomID in state
  const [isInCall, setIsInCall] = useState(false); // Track if the user is in a call
  const [status, setStatus] = useState(
    roomID
      ? `Ready to start call in room ${roomID}`
      : "No room ID provided. Please provide a room ID in the URL."
  ); // Initial status message
  const [isCaller, setIsCaller] = useState(false); // Track if this user is the caller
  const [micEnabled, setMicEnabled] = useState(true); // Microphone state
  const [cameraEnabled, setCameraEnabled] = useState(true); // Camera state

  const localVideoRef = useRef(null); // Ref for local video element
  const remoteVideoRef = useRef(null); // Ref for remote video element
  const peerConnectionRef = useRef(null); // Ref for WebRTC peer connection
  const localStreamRef = useRef(null); // Ref for local media stream

  // **Create WebRTC Peer Connection**
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch((e) =>
          console.error("Remote video play error:", e)
        );
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setStatus("Connected to peer!");
      }
    };

    return pc;
  };

  // **Start Call Function (Triggered by Button)**
  const startCall = async () => {
    if (!roomId) {
      alert("Please provide a room ID in the URL.");
      return;
    }

    peerConnectionRef.current = createPeerConnection();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });
      setIsInCall(true); // Enter call state
      socket.emit("join", roomId); // Notify server to join the room
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Failed to access camera/microphone. Check permissions.");
      setStatus("Failed to start call. Please check permissions.");
    }
  };

  // **Assign Local Stream to Video Element**
  useEffect(() => {
    if (isInCall && localStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.play().catch((e) =>
        console.error("Local video play error:", e)
      );
    }
  }, [isInCall]);

  // **Handle Socket.IO Signaling Events**
  useEffect(() => {
    socket.on("created", (id) => {
      setStatus(`Room ${id} created. Waiting for another user to join!`);
      setIsCaller(true);
    });

    socket.on("joined", (id) => {
      setStatus(`Joined room ${id}. Connecting...`);
      setIsCaller(false);
    });

    socket.on("ready", async () => {
      if (isCaller && peerConnectionRef.current && localStreamRef.current) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
      }
    });

    socket.on("offer", async (offer) => {
      if (!isCaller && peerConnectionRef.current && localStreamRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
      }
    });

    socket.on("answer", async (answer) => {
      if (isCaller && peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socket.on("ice-candidate", async (candidate) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });

    socket.on("bye", () => {
      setStatus("Peer disconnected");
      endCall();
    });

    socket.on("full", (id) => {
      setIsInCall(false);
      setStatus(`Room ${id} is full. Please try a different room.`);
    });

    return () => {
      socket.off("created");
      socket.off("joined");
      socket.off("ready");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("bye");
      socket.off("full");
    };
  }, [roomId, isCaller]);

  // **Toggle Microphone**
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micEnabled;
        setMicEnabled(!micEnabled);
      }
    }
  };

  // **Toggle Camera**
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraEnabled;
        setCameraEnabled(!cameraEnabled);
      }
    }
  };

  // **End Call Function**
  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    socket.emit("leave", roomId);
    setIsInCall(false);
    setIsCaller(false);
    setStatus(
      roomId
        ? `Ready to start call in room ${roomId}`
        : "No room ID provided. Please provide a room ID in the URL."
    );
  };

  // **Handle End Call with Confirmation**
  const handleEndCall = () => {
    if (window.confirm("Are you sure you want to end the call?")) {
      endCall();
    }
  };

  // **Render the Component**
  return (
    <div className="flex items-center justify-center h-screen bg-black relative">
      {isInCall ? (
        <>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="absolute bottom-4 right-4 w-40 h-40 object-cover border-2 border-white rounded-lg"
          />
          <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button
              onClick={toggleMic}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {micEnabled ? "Mute Mic" : "Unmute Mic"}
            </button>
            <button
              onClick={toggleCamera}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {cameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
            </button>
            <Link href="/Role">
              <button
                onClick={handleEndCall}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                End Call
              </button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-white text-center">
          <p>{status}</p>
          {/* Show "Start Call" button only if roomId exists */}
          {roomId && (
            <button
              onClick={startCall}
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Start Call
            </button>
          )}
        </div>
      )}
    </div>
  );
}