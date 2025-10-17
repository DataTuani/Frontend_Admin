import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

// Cambia la URL según tu backend
const socket = io("https://sinaes.up.railway.app", {
  transports: ["websocket"], // Evita errores CORS o transporte desconocido
});

export default function VideoCall({ roomId, className = "" }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const isOffererRef = useRef(false); // 👈 detecta quién crea el offer

  useEffect(() => {
    const init = async () => {
      try {
        console.log("🎥 Solicitando permisos...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;

        await localVideoRef.current.play().catch(() => {
          console.warn("Esperando interacción del usuario para reproducir video local");
        });

        // 🔧 Crear conexión con STUN y TURN
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
              urls: [
                "stun:openrelay.metered.ca:80",
                "turn:openrelay.metered.ca:80",
                "turn:openrelay.metered.ca:443",
                "turn:openrelay.metered.ca:443?transport=tcp",
              ],
              username: "openrelayproject",
              credential: "openrelayproject",
            },
          ],
        });
        pcRef.current = pc;

        // Agregar tracks locales
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // Cuando llega stream remoto
        pc.ontrack = (event) => {
          console.log("📡 Recibiendo video remoto...");
          remoteVideoRef.current.srcObject = event.streams[0];
          remoteVideoRef.current.play().catch(() => {
            console.warn("Esperando interacción del usuario para reproducir video remoto");
          });
        };

        // Enviar candidatos ICE locales
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", { roomId, candidate: event.candidate });
          }
        };

        // 🔹 Unirse a la sala
        socket.emit("join-room", { roomId });

        // 🔹 El servidor avisa cuando otro usuario entra
        socket.on("ready", async () => {
          console.log("✅ Otro usuario se unió, creando offer...");
          isOffererRef.current = true;
          await createOffer();
        });

        // 📩 Recibir offer
        socket.on("offer", async ({ offer }) => {
          const pc = pcRef.current;
          if (pc.signalingState !== "stable") {
            console.warn("⚠ Ignorando offer porque el estado no es estable");
            return;
          }

          console.log("📩 Offer recibida, creando answer...");
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { roomId, answer });
        });

        // 📩 Recibir answer
        socket.on("answer", async ({ answer }) => {
          const pc = pcRef.current;
          if (pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            console.log("📩 Answer aplicada correctamente");
          } else {
            console.warn("⚠ Ignorando answer, estado actual:", pc.signalingState);
          }
        });

        // ❄ Recibir ICE candidate remoto
        socket.on("ice-candidate", async ({ candidate }) => {
          if (!candidate) return;
          const pc = pcRef.current;
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error agregando ICE candidate:", err);
          }
        });
      } catch (err) {
        console.error("❌ Error accediendo a cámara/micrófono:", err);
        alert("No se pudo acceder a cámara o micrófono. Revisa permisos.");
      }
    };

    init();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (pcRef.current) pcRef.current.close();
      socket.off();
    };
  }, [roomId]);

  // 📞 Crear offer solo si el peer es offerer
  const createOffer = async () => {
    const pc = pcRef.current;
    if (!pc || pc.signalingState !== "stable") {
      console.warn("⏸ No se puede crear offer en estado:", pc?.signalingState);
      return;
    }

    console.log("📞 Creando offer...");
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", { roomId, offer });
  };

  return (
    <div className={`video-call-container ${className}`}>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="remote-video"
      />

      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="local-video-pip"
      />
    </div>
  );
}