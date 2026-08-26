"use client";
import { Terminal } from "@/components/ui/terminal";

export default function TerminalDemo() {
  return (
    <section className="w-full">
      <Terminal
        commands={[
          "whoami --about",
          "ls ~/projects",
          "cat about.md",
        ]}
        outputs={{
          0: ["Ahad — Developer & Creator"],
          1: ["portfolio-2026/", "liquid-ui/", "terminal-portfolio/"],
          2: [
            "## About Me",
            "I build fast, focused interfaces",
            "and immersive web experiences.",
            "Engineered to feel effortless.",
          ],
        }}
        typingSpeed={45}
        delayBetweenCommands={1000}
        enableSound={false}
      />
    </section>
  );
}
