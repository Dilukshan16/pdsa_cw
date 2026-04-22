"use client";
import { useState } from "react";

interface Props {
  playerName: string;
  onNameChange: (n: string) => void;
  onSubmit: (answer: number) => void;
  loading: boolean;
  error: string | null;
}

const S: React.CSSProperties = {
  fontFamily: "'Courier New', Courier, monospace",
};

const corners = [
  { top: -1, left: -1, borderTop: "2px solid #22d3ee", borderLeft: "2px solid #22d3ee" },
  { top: -1, right: -1, borderTop: "2px solid #22d3ee", borderRight: "2px solid #22d3ee" },
  { bottom: -1, left: -1, borderBottom: "2px solid #22d3ee", borderLeft: "2px solid #22d3ee" },
  { bottom: -1, right: -1, borderBottom: "2px solid #22d3ee", borderRight: "2px solid #22d3ee" },
];

export default function GamePanel({ playerName, onNameChange, onSubmit, loading, error }: Props) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    const trimmed = answer.trim();
    if (trimmed === "") return;
    const num = parseInt(trimmed, 10);
    if (isNaN(num) || num < 0) return;
    onSubmit(num);
    setAnswer("");
  };

  const isAnswerEmpty = answer.trim() === "";

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        .gp-input:focus {
          border-color: rgba(6,182,212,0.55) !important;
          outline: none;
        }
        .gp-input::placeholder {
          color: rgba(71,85,105,0.6);
        }
        .gp-btn-primary:hover:not(:disabled) {
          opacity: 0.88;
          transform: translateY(-1px);
        }
      `}</style>

      <div
        style={{
          ...S,
          position: "relative",
          background: "rgba(6,182,212,0.025)",
          border: "1px solid rgba(6,182,212,0.14)",
          borderRadius: "4px",
          padding: "32px 28px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Corner brackets */}
        {corners.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: c.top,
              bottom: c.bottom,
              left: c.left,
              right: c.right,
              width: 14,
              height: 14,
              borderTop: c.borderTop,
              borderBottom: c.borderBottom,
              borderLeft: c.borderLeft,
              borderRight: c.borderRight,
            }}
          />
        ))}

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 14px",
            borderRadius: 999,
            border: "1px solid rgba(6,182,212,0.22)",
            background: "rgba(6,182,212,0.07)",
            fontSize: 10,
            color: "#22d3ee",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            width: "fit-content",
            ...S,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#22d3ee",
              display: "inline-block",
              animation: "blink 2s ease-in-out infinite",
            }}
          />
          Submit Answer
        </div>

        {/* Divider */}
        <Divider />

        {/* Player name */}
        <Field label="Player name">
          <input
            type="text"
            value={playerName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your name"
            className="gp-input"
            style={inputStyle}
          />
        </Field>

        {/* Answer */}
        <Field label="Max flow (vehicles/min)  A → T">
          <input
            type="number"
            min="0"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter your answer"
            className="gp-input"
            style={inputStyle}
          />
        </Field>

        {error && (
          <p style={{ fontSize: 10, color: "#f87171", letterSpacing: "0.06em", ...S }}>
            {error}
          </p>
        )}

        {/* Divider */}
        <Divider />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !playerName.trim() || isAnswerEmpty}
          className="gp-btn-primary"
          style={{
            ...S,
            width: "100%",
            padding: "14px 0",
            borderRadius: 4,
            border: "none",
            background:
              loading || !playerName.trim() || isAnswerEmpty
                ? "rgba(255,255,255,0.04)"
                : "linear-gradient(135deg, #0e7490, #06b6d4)",
            borderWidth: loading || !playerName.trim() || isAnswerEmpty ? 1 : 0,
            borderStyle: "solid",
            borderColor: "rgba(6,182,212,0.1)",
            color:
              loading || !playerName.trim() || isAnswerEmpty
                ? "rgba(71,85,105,0.6)"
                : "#00151e",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: loading || !playerName.trim() || isAnswerEmpty ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "opacity 0.2s, transform 0.2s",
          }}
        >
          {!loading && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
          {loading ? "Checking..." : "Submit Answer"}
        </button>
      </div>
    </>
  );
}

/* ── Helpers ── */

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.18))" }} />
      <div style={{ width: 5, height: 5, background: "rgba(6,182,212,0.45)", transform: "rotate(45deg)" }} />
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(6,182,212,0.18), transparent)" }} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        style={{
          fontSize: 9,
          color: "rgba(100,116,139,0.7)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "'Courier New', Courier, monospace",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(6,182,212,0.18)",
  borderRadius: 4,
  padding: "10px 14px",
  color: "#e2e8f0",
  fontSize: 12,
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: "0.04em",
  transition: "border-color 0.2s",
};