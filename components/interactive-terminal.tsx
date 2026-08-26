"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

let audioCtx: AudioContext | null = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playKeySound() {
  try {
    const c = getAudioCtx();
    const now = c.currentTime;

    // creamy thock body
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(500 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.06);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain).connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.07);

    // soft click top
    const osc2 = c.createOscillator();
    const gain2 = c.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1400 + Math.random() * 400, now);
    osc2.frequency.exponentialRampToValueAtTime(400, now + 0.02);
    gain2.gain.setValueAtTime(0.04, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    osc2.connect(gain2).connect(c.destination);
    osc2.start(now);
    osc2.stop(now + 0.025);
  } catch {}
}

function playEnterSound() {
  try {
    const c = getAudioCtx();
    const now = c.currentTime;

    // deeper thock for enter
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain).connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    // resonance
    const osc2 = c.createOscillator();
    const gain2 = c.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(200, now + 0.01);
    osc2.frequency.exponentialRampToValueAtTime(60, now + 0.14);
    gain2.gain.setValueAtTime(0.1, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc2.connect(gain2).connect(c.destination);
    osc2.start(now + 0.01);
    osc2.stop(now + 0.15);
  } catch {}
}

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  about me  — who I am",
    "  skills    — my tech stack",
    "  projects  — my work",
    "  clear     — clear screen",
  ],
  "about me": [
    "Abdul Ahad",
    "B.E. AI & Data Science — 2nd Year",
    "",
    "I'm an AI & Data Science student interested in",
    "Data Analytics, Artificial Intelligence and Machine Learning.",
    "",
    "Currently:",
    "Learning, building projects and improving my",
    "skills in AI & Data Science.",
    "",
    "Goal:",
    "Build useful real-world AI & Data Science solutions.",
  ],
  skills: [
    "Python • SQL • Excel • Power BI • Git • GitHub",
  ],
  projects: [
    "• Personal Portfolio Website",
    "• Excel Anomaly Detection",
  ],
  clear: ["__CLEAR__"],
};

type TerminalLine = {
  type: "input" | "output" | "error";
  content: string;
};

export interface InteractiveTerminalHandle {
  runCommand: (cmd: string) => void;
}

export default React.forwardRef<InteractiveTerminalHandle, { onClose?: () => void }>(function InteractiveTerminal({ onClose }, ref) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "Type 'help' to see what I can do." },
    { type: "output", content: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const username = "ahad";

  React.useImperativeHandle(ref, () => ({
    runCommand: (cmd: string) => {
      setInput(cmd);
      setTimeout(() => handleCommand(cmd), 0);
    },
  }));

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  });

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      const promptLine: TerminalLine = { type: "input", content: trimmed };

      if (!trimmed) {
        setLines((prev) => [...prev, promptLine]);
        return;
      }

      setHistory((prev) => [...prev, trimmed]);
      setHistoryIdx(-1);

      const key = trimmed.toLowerCase();

      if (key === "clear") {
        setLines([]);
        return;
      }

      const output = COMMANDS[key];
      if (output) {
        setLines((prev) => [
          ...prev,
          promptLine,
          ...output.map((l) => ({ type: "output" as const, content: l })),
        ]);
      } else {
        setLines((prev) => [
          ...prev,
          promptLine,
          { type: "error", content: `command not found: ${trimmed}` },
          { type: "output", content: "Type 'help' for available commands." },
        ]);
      }
    },
    [history, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      playEnterSound();
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx !== -1) {
        const newIdx = historyIdx + 1;
        if (newIdx >= history.length) {
          setHistoryIdx(-1);
          setInput("");
        } else {
          setHistoryIdx(newIdx);
          setInput(history[newIdx]);
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const prompt = (
    <span className="text-neutral-500">
      <span className="text-sky-500">{username}</span>
      <span className="text-emerald-600">:</span>
      <span className="text-sky-400">~</span>
      <span className="text-neutral-500">$</span>{" "}
    </span>
  );

  return (
    <div
      className="mx-auto w-full max-w-xl px-4 font-mono text-xs"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/95 backdrop-blur shadow-2xl">
        <div className="flex items-center gap-2 bg-neutral-800 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onClose?.(); }}
              className="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-600 cursor-pointer"
              aria-label="Close terminal"
            />
            <div className="h-3 w-3 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600" />
            <div className="h-3 w-3 rounded-full bg-green-500 transition-colors hover:bg-green-600" />
          </div>
          <div className="flex-1 text-center">
            <span className="truncate text-xs text-neutral-400">
              {username} — bash
            </span>
          </div>
          <div className="w-[52px]" />
        </div>

        <div
          ref={contentRef}
          className="no-visible-scrollbar h-80 overflow-y-auto p-4 font-mono"
        >
          {lines.map((line, i) => (
            <div key={i} className="leading-relaxed whitespace-pre-wrap">
              {line.type === "input" ? (
                <span>
                  {prompt}
                  <span className="text-neutral-200">{line.content}</span>
                </span>
              ) : line.type === "error" ? (
                <span className="text-red-400">{line.content}</span>
              ) : (
                <span className="text-neutral-400">{line.content}</span>
              )}
            </div>
          ))}

          <div className="leading-relaxed whitespace-pre-wrap">
            {prompt}
            <span className="text-neutral-200">{input}</span>
            <span
              className={cn(
                "ml-0.5 inline-block h-4 w-2 bg-neutral-300 align-middle transition-opacity duration-100",
                !cursorVisible && "opacity-0",
              )}
            />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute opacity-0 w-0 h-0"
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
)
