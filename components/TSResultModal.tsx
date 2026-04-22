"use client";
import type { AnswerResult } from "@/app/api/traffic-simulation-api/api";

interface Props {
  result: AnswerResult;
  onPlayAgain: () => void;
  onLeaderboard: () => void;
}

const S: React.CSSProperties = {
  fontFamily: "'Courier New', Courier, monospace",
};

const OUTCOME_CONFIG = {
  WIN: {
    label: "Correct",
    accentColor: "#22d3ee",
    accentAlpha: "rgba(6,182,212,0.18)",
    borderColor: "rgba(6,182,212,0.45)",
    tagBg: "rgba(6,182,212,0.08)",
    tagBorder: "rgba(6,182,212,0.25)",
  },
  LOSE: {
    label: "Wrong Answer",
    accentColor: "#f87171",
    accentAlpha: "rgba(248,113,113,0.12)",
    borderColor: "rgba(248,113,113,0.4)",
    tagBg: "rgba(248,113,113,0.07)",
    tagBorder: "rgba(248,113,113,0.22)",
  },
};

const corners = (color: string) => [
  { top: -1, left: -1, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
  { top: -1, right: -1, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` },
  { bottom: -1, left: -1, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` },
  { bottom: -1, right: -1, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` },
];

export default function ResultModal({ result, onPlayAgain, onLeaderboard }: Props) {
  const cfg = OUTCOME_CONFIG[result.outcome];

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.82)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        {/* Modal card */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 420,
            background: "rgba(6,182,212,0.02)",
            border: `1px solid ${cfg.borderColor}`,
            borderRadius: 4,
            padding: "40px 32px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            ...S,
          }}
        >
          {/* Corner brackets */}
          {corners(cfg.accentColor).map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: c.top, bottom: c.bottom,
                left: c.left, right: c.right,
                width: 14, height: 14,
                borderTop: c.borderTop, borderBottom: c.borderBottom,
                borderLeft: c.borderLeft, borderRight: c.borderRight,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Outcome badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 16px",
              borderRadius: 999,
              border: `1px solid ${cfg.tagBorder}`,
              background: cfg.tagBg,
              fontSize: 10,
              color: cfg.accentColor,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              ...S,
            }}
          >
            <span
              style={{
                width: 5, height: 5,
                borderRadius: "50%",
                background: cfg.accentColor,
                display: "inline-block",
                animation: "blink 2s ease-in-out infinite",
              }}
            />
            {cfg.label}
          </div>

          {/* Answer comparison */}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { label: "Your Answer", value: result.playerAnswer, color: "rgba(148,163,184,0.8)" },
              { label: "Correct Answer", value: result.correctAnswer, color: "#22d3ee" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "14px 10px",
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(6,182,212,0.09)",
                }}
              >
                <span style={{ fontSize: 9, color: "rgba(100,116,139,0.55)", letterSpacing: "0.18em", textTransform: "uppercase", ...S }}>
                  {label}
                </span>
                <span style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: "-0.02em", ...S }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.18))" }} />
            <div style={{ width: 5, height: 5, background: "rgba(6,182,212,0.45)", transform: "rotate(45deg)" }} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(6,182,212,0.18), transparent)" }} />
          </div>

          {/* Algorithm stats */}
          <div
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(6,182,212,0.09)",
              borderRadius: 4,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 9, color: "rgba(100,116,139,0.55)", letterSpacing: "0.2em", textTransform: "uppercase", ...S }}>
              Algorithm Performance
            </span>
            {[
              { name: "Ford-Fulkerson", ms: result.fordFulkersonTimeMs },
              { name: "Edmonds-Karp", ms: result.edmondsKarpTimeMs },
            ].map(({ name, ms }) => (
              <div
                key={name}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <span style={{ fontSize: 11, color: "rgba(100,116,139,0.7)", letterSpacing: "0.08em", ...S }}>
                  {name}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#22d3ee", letterSpacing: "0.06em", ...S }}>
                  {ms} ms
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.18))" }} />
            <div style={{ width: 5, height: 5, background: "rgba(6,182,212,0.45)", transform: "rotate(45deg)" }} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(6,182,212,0.18), transparent)" }} />
          </div>

          {/* Action buttons */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Primary — Play Again */}
            <button
              onClick={onPlayAgain}
              style={{
                ...S,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                padding: "14px 0",
                borderRadius: 4,
                border: "none",
                background: "linear-gradient(135deg, #0e7490, #06b6d4)",
                color: "#00151e",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Play Again
            </button>

            {/* Secondary — Leaderboard */}
            <button
              onClick={onLeaderboard}
              style={{
                ...S,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                padding: "14px 0",
                borderRadius: 4,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(6,182,212,0.16)",
                color: "#64748b",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(6,182,212,0.38)";
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.background = "rgba(6,182,212,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(6,182,212,0.16)";
                e.currentTarget.style.color = "#64748b";
                e.currentTarget.style.background = "rgba(255,255,255,0.025)";
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              Leaderboard
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </>
  );
}