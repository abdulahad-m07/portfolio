"use client";

import { useRef, useState } from "react";

const MAX_MSGS = 2;

const FALLBACK_MS = 1500;

function CopyChip({
  chip,
  cmd,
}: {
  chip: string;
  cmd: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = cmd || chip;
    const showCopied = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), FALLBACK_MS);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(showCopied)
        .catch(() => {
          fallbackCopy(text);
          showCopied();
        });
    } else {
      fallbackCopy(text);
      showCopied();
    }
  };

  return (
    <span
      onClick={handleClick}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-500/15 border border-indigo-400/30 text-indigo-200 cursor-pointer hover:bg-indigo-500/30 transition-colors select-all"
      title={`Click to copy "${chip}"`}
    >
      {copied ? (
        <>
          Copied
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-emerald-400">
            <path
              clipRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              fillRule="evenodd"
            />
          </svg>
        </>
      ) : (
        <>
          {chip}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3 h-3 shrink-0">
            <rect x="9" y="9" width="11" height="11" rx="2" strokeWidth="1.5" />
            <path d="M5 15V5a2 2 0 012-2h10" strokeWidth="1.5" />
          </svg>
        </>
      )}
    </span>
  );
}

function fallbackCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } catch {}
  document.body.removeChild(ta);
}

export default function InfoTip() {
  const hoverCount = useRef(-1);
  const [idx, setIdx] = useState(0);

  return (
    <div
      className="relative inline-block group"
      onMouseEnter={() => {
        hoverCount.current += 1;
        setIdx(((hoverCount.current % MAX_MSGS) + MAX_MSGS) % MAX_MSGS);
      }}
    >
      <button className="relative px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600/90 rounded-lg hover:bg-indigo-700/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl group-hover:opacity-75 transition-opacity" />
        <span className="relative flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" className="w-3.5 h-3.5">
            <path
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          Hover for Info
        </span>
      </button>

      <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 top-full left-0 mt-3 w-80 transition-all duration-300 ease-out transform group-hover:translate-y-0 -translate-y-2 z-50">
        <div className="relative p-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.15)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
                <path
                  clipRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white">CampusFind</h3>
          </div>

          <div className="space-y-2">
            {idx === 0 ? (
              <>
                <p className="text-sm text-gray-300 leading-relaxed">
                  type: <CopyChip chip="projects" cmd="projects" /> --&gt;{" "}
                  <CopyChip chip="open campusfind" cmd="open campusfind" />
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  use this to check out our grp project collaborated{" "}
                  <span className="text-indigo-300">@shubham bhandare</span> &amp;{" "}
                  <span className="text-indigo-300">@vedant lende</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-300 leading-relaxed">
                to see what i did in campusfind type:{" "}
                <CopyChip
                  chip="contribution in campus find"
                  cmd="contribution in campusfind"
                />
              </p>
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-50" />

          <div className="absolute -top-1.5 left-6 w-3 h-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-t border-l border-white/10" />
        </div>
      </div>
    </div>
  );
}
