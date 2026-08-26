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

type Stage = "home" | "project" | "terminal" | "about" | "skills";

function SkillCard({ skill, index, visible, ease }: { skill: string; index: number; visible: boolean; ease: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleEnter = () => {
    setHovered(true);
    if (skill === "Python" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleLeave = () => {
    setHovered(false);
  };

  const isPython = skill === "Python";

  return (
    <div
      className="relative overflow-hidden rounded-xl text-center text-white/90 text-sm"
      style={{
        fontFamily: "Inter, sans-serif",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.85)",
        transition: `all 0.5s ${ease} ${0.6 + index * 0.08}s`,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {isPython && (
        <video
          ref={videoRef}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            transform: hovered ? "scale(1)" : "scale(1.1)",
          }}
          src="/python-bg.mp4"
        />
      )}
      <div
        className="relative backdrop-blur-md border border-white/20 rounded-xl px-5 py-3"
        style={{
          background: isPython && hovered ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.1)",
          transition: "background 0.3s ease",
        }}
      >
        <span className="relative z-10">{skill}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("home");
  const [entered, setEntered] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const terminalRef = useRef<InteractiveTerminalHandle>(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      setAboutVisible(stage === "about");
      setSkillsVisible(stage === "skills");
    });
  }, [stage]);

  const handleProject = useCallback(() => setStage("project"), []);
  const handleAbout = useCallback(() => setStage("about"), []);
  const handleSkills = useCallback(() => setStage("skills"), []);
  const handleBack = useCallback(() => setStage("home"), []);
  const handleTerminalOpen = useCallback(() => setStage("terminal"), []);
  const handleClose = useCallback(() => setStage("project"), []);

  const isHome = stage === "home";
  const isAbout = stage === "about";
  const isSkills = stage === "skills";
  const isOverlay = isAbout || isSkills;

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

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <MagicCursor fillColor="#ffffff" cursorSize={40} enableStretch />

      {/* Cloud shader — zooms out + fades on overlay pages */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isOverlay ? 0 : 1,
          transform: isSkills ? "scale(2.5)" : "scale(1)",
          filter: isSkills ? "blur(20px)" : "blur(0px)",
          transition: `all 1s ${ease}`,
        }}
      >
        <CloudShaderDemo />
      </div>

      {/* Nav buttons — fade on overlay pages */}
      <div
        className="absolute top-6 left-1/2 z-30 flex gap-4"
        style={{
          transform: `translateX(-50%) translateY(${isOverlay ? -20 : 0}px)`,
          opacity: isOverlay ? 0 : 1,
          transition: `all 0.5s ${ease}`,
          pointerEvents: isOverlay ? "none" : "auto",
        }}
      >
        <LiquidGlassButton label="About Me" onClick={handleAbout} {...glassBtnProps} />
        <LiquidGlassButton label="Skills" onClick={handleSkills} {...glassBtnProps} />
        <LiquidGlassButton label="Projects" onClick={handleProject} {...glassBtnProps} />
      </div>

      {/* Left hand — slides out on overlay pages */}
      <Image
        src="/hand-left.png"
        alt="Left hand"
        width={800}
        height={900}
        className="absolute left-0 z-10 pointer-events-none select-none object-contain"
        style={{
          top: stage === "terminal" ? "85%" : "50%",
          transform: entered
            ? isOverlay
              ? isSkills
                ? "translateY(-50%) translateX(-50vw) scale(1.5)"
                : "translateY(-50%) translateX(-100vw)"
              : "translateY(-50%) translateX(0)"
            : "translateX(-100vw) translateY(-50%)",
          height: "125vh",
          marginLeft: "-4rem",
          opacity: entered ? (isSkills ? 0 : 1) : 0,
          filter: isSkills ? "blur(15px)" : entered ? "blur(0)" : "blur(12px)",
          transition: `all 0.9s ${ease}`,
        }}
        priority
      />

      {/* Right hand — slides out on overlay pages */}
      <Image
        src="/hand-right.png"
        alt="Right hand"
        width={800}
        height={900}
        className="absolute right-0 z-10 pointer-events-none select-none object-contain"
        style={{
          top: stage === "terminal" ? "15%" : "50%",
          transform: entered
            ? isOverlay
              ? isSkills
                ? "translateY(-50%) translateX(50vw) scale(1.5)"
                : "translateY(-50%) translateX(100vw)"
              : stage === "terminal"
                ? "translateY(-50%) translateX(-8rem) rotate(-17deg)"
                : "translateY(-50%) translateX(0)"
            : "translateX(100vw) translateY(-50%)",
          transformOrigin: stage === "terminal" ? "top right" : undefined,
          height: stage === "terminal" ? "135vh" : "125vh",
          marginRight: stage === "terminal" ? "-3rem" : stage === "project" ? "-3rem" : "-4rem",
          opacity: entered ? (isSkills ? 0 : 1) : 0,
          filter: isSkills ? "blur(15px)" : entered ? "blur(0)" : "blur(12px)",
          transition: `all 0.9s ${ease}`,
        }}
        priority
      />

      {/* Terminal button — center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div
          className={`transition-all duration-700 ease-[${ease}] ${
            stage === "project"
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-90 pointer-events-none"
          }`}
        >
          <TerminalButton onOpen={handleTerminalOpen} />
        </div>
      </div>

      {/* Back button — shows on project/about/skills */}
      <div
        className="absolute top-6 left-6 z-40"
        style={{
          opacity: isOverlay || stage === "project" ? 1 : 0,
          transform: `translateY(${isOverlay || stage === "project" ? 0 : -16}px)`,
          pointerEvents: isOverlay || stage === "project" ? "auto" : "none",
          transition: `all 0.5s ${ease}`,
        }}
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

      {/* Name text — zoom away on skills, fade on about */}
      <div
        className="absolute left-0 right-0 top-1/2 z-15 text-center pointer-events-none"
        style={{
          transform: isHome
            ? entered ? "translateY(-50%) scale(1)" : "translateY(calc(-50% + 30px)) scale(1)"
            : isSkills
              ? "translateY(-50%) scale(3)"
              : "translateY(calc(-50% + 40px)) scale(1)",
          opacity: isHome ? (entered ? 1 : 0) : 0,
          filter: isSkills ? "blur(20px)" : isHome ? "blur(0)" : "blur(8px)",
          transition: `all 0.8s ${ease}`,
        }}
      >
        <h1 className="text-white text-2xl md:text-4xl" style={{ fontFamily: "Absans, sans-serif", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          HI, MY NAME IS<br />ABDUL AHAD MALLEBHARI.
        </h1>
      </div>

      {/* About Me — slides up from bottom */}
      <div
        className="absolute inset-0 z-25"
        style={{
          transform: aboutVisible ? "translateY(0)" : "translateY(100%)",
          opacity: aboutVisible ? 1 : 0,
          filter: aboutVisible ? "blur(0px)" : "blur(20px)",
          transition: `all 0.9s ${ease}`,
          pointerEvents: stage === "about" ? "auto" : "none",
        }}
      >
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" src="/about-bg.mp4" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
          <h2
            className="text-4xl md:text-6xl mb-8 text-white"
            style={{
              fontFamily: "Absans, sans-serif",
              fontWeight: 400,
              opacity: aboutVisible ? 1 : 0,
              transform: aboutVisible ? "translateY(0)" : "translateY(30px)",
              transition: `all 0.7s ${ease} 0.3s`,
            }}
          >
            About Me
          </h2>
          <div
            className="max-w-xl text-center space-y-5"
            style={{
              fontFamily: "Inter, sans-serif",
              opacity: aboutVisible ? 1 : 0,
              transform: aboutVisible ? "translateY(0)" : "translateY(30px)",
              transition: `all 0.7s ${ease} 0.5s`,
            }}
          >
            <p className="text-white/90 text-lg leading-relaxed">B.E. AI &amp; Data Science — 2nd Year</p>
            <p className="text-white/70 text-sm leading-relaxed">
              I&apos;m an AI &amp; Data Science student interested in
              Data Analytics, Artificial Intelligence and Machine Learning.
            </p>
            <p className="text-white/60 text-sm">
              Currently learning, building projects and improving my skills in AI &amp; Data Science.
            </p>
            <p className="text-white/50 text-xs tracking-widest uppercase">
              Goal: Build useful real-world AI &amp; Data Science solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Skills — slides down from top */}
      <div
        className="absolute inset-0 z-25"
        style={{
          transform: skillsVisible ? "translateY(0) scale(1)" : "translateY(-100%) scale(1.4)",
          opacity: skillsVisible ? 1 : 0,
          filter: skillsVisible ? "blur(0px)" : "blur(30px)",
          transition: `transform 1.1s ${ease}, opacity 0.8s ${ease}, filter 0.9s ${ease}`,
          pointerEvents: stage === "skills" ? "auto" : "none",
        }}
      >
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" src="/skills-bg.mp4" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
          <h2
            className="text-4xl md:text-6xl mb-10 text-white"
            style={{
              fontFamily: "Absans, sans-serif",
              fontWeight: 400,
              opacity: skillsVisible ? 1 : 0,
              transform: skillsVisible ? "translateY(0) scale(1)" : "translateY(60px) scale(0.8)",
              transition: `all 0.8s ${ease} 0.3s`,
            }}
          >
            Skills
          </h2>
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl"
            style={{
              opacity: skillsVisible ? 1 : 0,
              transform: skillsVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.9)",
              transition: `all 0.7s ${ease} 0.5s`,
            }}
          >
            {["Python", "SQL", "Excel", "Power BI", "Git", "GitHub"].map((skill, i) => (
              <SkillCard key={skill} skill={skill} index={i} visible={skillsVisible} ease={ease} />
            ))}
          </div>
        </div>
      </div>

      {/* Terminal — full screen overlay */}
      <div
        className={`absolute inset-0 z-30 flex items-center justify-center transition-all duration-700 ease-[${ease}] delay-300 ${
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
