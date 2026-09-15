"use client";

import { useState, useEffect } from "react";

const SESSION_KEY = "rl1_preview_auth";
const CORRECT_HASH = "ab0614f69a07a1513614ae11ee2091f6c338142bd71d30448741d48aba8cfeba";

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(SESSION_KEY) === "1") setUnlocked(true);
    // Erster Moment, in dem dieses Gate überhaupt etwas rendert (statt
    // null) — genau hier blendet der Preloader aus (siehe layout.tsx).
    document.documentElement.classList.add("app-ready");
  }, []);

  if (!mounted) return null;
  if (unlocked) return <>{children}</>;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const hash = await sha256(input);
    if (hash === CORRECT_HASH) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 1200);
    }
  }

  return (
    <div className="pgOverlay">
      <div className="pgCard">
        <p className="pgLabel">RL1 — Preview Access</p>
        <form onSubmit={submit} className="pgForm">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`pgInput${error ? " pgInput--error" : ""}`}
            placeholder="Access code"
            autoFocus
            autoComplete="off"
          />
          <button type="submit" className="pgBtn">
            Enter
          </button>
        </form>
        {error && <p className="pgError">Incorrect code</p>}
      </div>
    </div>
  );
}
