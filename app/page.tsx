"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import CloudShaderDemo from "@/components/cloud-shader-demo";
import TerminalButton from "@/components/terminal-button";
import InteractiveTerminal, {
  InteractiveTerminalHandle,
} from "@/components/interactive-terminal";
import LiquidGlassButton from "@/components/ui/liquid-glass-button";
import MagicCursor from "@/components/ui/magic-cursor";
import Image from "next/image";

export default function Home() {
  const [stage, setStage] = useState<"home" | "project" | "terminal">("home");
  const [entered, setEntered] = useState(false);
  const terminalRef = useRef<InteractiveTerminalHandle>(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleProject = useCallback(() => {
    setStage("project");
  }, []);

  const handleBack = useCallback(() => {
    setStage("home");
  }, []);

  const handleTerminalOpen = useCallback(() => {
    setStage("terminal");
  }, []);

  const handleClose = useCallback(() => {
    setStage("project");
  }, []);

  const handleNav = useCallback((cmd: string) => {
    setStage("terminal");
    setTimeout(() => terminalRef.current?.runCommand(cmd), 800);
  }, []);

  const glassBtnProps = {
    padding: "10px 22px" as string,
    rounded: 50,
    stroke: {
      type: "gradient" as const,
      angle: 180,
      color: "rgba(255,255,255,0.45)",
      width: 1.5,
      colorA: "rgba(255,255,255,0.55)",
      colorB: "rgba(255,255,255,0.25)",
    },
    light: { size: 50, color: "rgba(255,255,255,0.3)", intensity: 80, smoothness: 70 },
    font: { fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 13 },
    textColor: "rgba(255,255,255,0.9)",
  };

  const handTransition = "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <MagicCursor fillColor="#ffffff" cursorSize={40} enableStretch />
      <div className="absolute inset-0">
        <CloudShaderDemo />
      </div>

      {/* Nav buttons — top center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-4 nav-buttons-enter">
        <LiquidGlassButton label="About Me" onClick={() => {}} {...glassBtnProps} />
        <LiquidGlassButton label="Skills" onClick={() => {}} {...glassBtnProps} />
        <LiquidGlassButton label="Projects" onClick={handleProject} {...glassBtnProps} />
      </div>

      {/* Left hand */}
      <Image
        src="/hand-left.png"
        alt="Left hand"
        width={800}
        height={900}
        className="absolute left-0 z-10 pointer-events-none select-none object-contain"
        style={{
          top: stage === "terminal" ? "85%" : "50%",
          transform: entered
            ? "translateY(-50%) translateX(0)"
            : "translateX(-100vw) translateY(-50%)",
          height: "125vh",
          marginLeft: stage === "home" ? "-4rem" : "-3rem",
          opacity: entered ? 1 : 0,
          filter: entered ? "blur(0)" : "blur(12px)",
          transition: handTransition,
        }}
        priority
      />

      {/* Right hand */}
      <Image
        src="/hand-right.png"
        alt="Right hand"
        width={800}
        height={900}
        className="absolute right-0 z-10 pointer-events-none select-none object-contain"
        style={{
          top: stage === "terminal" ? "15%" : "50%",
          transform: entered
            ? stage === "terminal"
              ? "translateY(-50%) translateX(-8rem) rotate(-17deg)"
              : "translateY(-50%) translateX(0)"
            : "translateX(100vw) translateY(-50%)",
          transformOrigin: stage === "terminal" ? "top right" : undefined,
          height: stage === "terminal" ? "135vh" : "125vh",
          marginRight: stage === "terminal" ? "-3rem" : stage === "project" ? "-3rem" : "-4rem",
          opacity: entered ? 1 : 0,
          filter: entered ? "blur(0)" : "blur(12px)",
          transition: handTransition,
        }}
        priority
      />

      {/* Terminal button — center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div
          className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            stage === "project"
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-90 pointer-events-none"
          }`}
        >
          <TerminalButton onOpen={handleTerminalOpen} />
        </div>
      </div>

      {/* Back button */}
      <div
        className={`absolute top-6 left-6 z-30 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          stage === "project"
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <LiquidGlassButton
          label="<"
          onClick={handleBack}
          padding="10px 18px"
          rounded={50}
          stroke={{
            type: "gradient",
            angle: 180,
            color: "rgba(255,255,255,0.45)",
            width: 1.5,
            colorA: "rgba(255,255,255,0.55)",
            colorB: "rgba(255,255,255,0.25)",
          }}
          light={{ size: 50, color: "rgba(255,255,255,0.3)", intensity: 80, smoothness: 70 }}
          font={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 13 }}
          textColor="rgba(255,255,255,0.9)"
        />
      </div>

      {/* Name text — center between hands, home only */}
      <div
        className="absolute left-0 right-0 top-1/2 z-15 text-center pointer-events-none"
        style={{
          transform: stage === "home"
            ? entered ? "translateY(-50%)" : "translateY(calc(-50% + 30px))"
            : "translateY(calc(-50% + 10px))",
          opacity: stage === "home" ? (entered ? 1 : 0) : 0,
          transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <h1 className="text-white text-2xl md:text-4xl" style={{ fontFamily: "Absans, sans-serif", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          HI, MY NAME IS<br />ABDUL AHAD MALLEBHARI.
        </h1>
      </div>

      {/* Terminal — full screen overlay */}
      <div
        className={`absolute inset-0 z-30 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-300 ${
          stage === "terminal"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12 pointer-events-none"
        }`}
      >
        <InteractiveTerminal ref={terminalRef} onClose={handleClose} />
      </div>
    </main>
  );
}
