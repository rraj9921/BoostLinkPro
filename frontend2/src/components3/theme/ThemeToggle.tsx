"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() { return <ThemeToggleInner />; }
export default function ThemeToggleInner() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("blp-theme");
    if (saved === "dark") setDark(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("blp-theme", next ? "dark" : "light");
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        width: 36, height: 36, borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
        background: "var(--c-bg3)",
        border: "1.5px solid var(--c-border)",
        color: "var(--c-text3)",
        transition: "all 0.15s",
      }}
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
