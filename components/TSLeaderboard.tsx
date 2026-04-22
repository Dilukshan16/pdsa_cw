"use client";
import { useEffect, useState } from "react";
import { fetchLeaderboard, LeaderboardEntry } from "@/app/api/traffic-simulation-api/api";

const S: React.CSSProperties = {
  fontFamily: "'Courier New', Courier, monospace",
};

const corners = [
  { top: -1, left: -1, borderTop: "2px solid #22d3ee", borderLeft: "2px solid #22d3ee" },
  { top: -1, right: -1, borderTop: "2px solid #22d3ee", borderRight: "2px solid #22d3ee" },
  { bottom: -1, left: -1, borderBottom: "2px solid #22d3ee", borderLeft: "2px solid #22d3ee" },
  { bottom: -1, right: -1, borderBottom: "2px solid #22d3ee", borderRight: "2px solid #22d3ee" },
];

const rankStyle = (i: number): React.CSSProperties => {
  if (i === 0) return { color: "#fbbf24", fontSize: 11, fontWeight: 800 };
  if (i === 1) return { color: "#94a3b8", fontSize: 11, fontWeight: 700 };
  if (i === 2) return { color: "#b45309", fontSize: 11, fontWeight: 700 };
  return { color: "rgba(71,85,105,0.6)", fontSize: 11 };
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard()
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", ...S }}>

      {/* Header badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 16px",
            borderRadius: 999,
            border: "1px solid rgba(6,182,212,0.22)",
            background: "rgba(6,182,212,0.07)",
            fontSize: 10,
            color: "#22d3ee",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
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
          Leaderboard
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          position: "relative",
          background: "rgba(6,182,212,0.025)",
          border: "1px solid rgba(6,182,212,0.14)",
          borderRadius: 4,
          padding: "28px 24px",
          ...S,
        }}
      >
        {/* Corner brackets */}
        {corners.map((c, i) => (
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

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "32px 0" }}>
            <span
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#22d3ee",
                animation: "blink 2s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 11, color: "rgba(6,182,212,0.5)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Loading...
            </span>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{ fontSize: 11, color: "rgba(71,85,105,0.6)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              No scores yet — be the first
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["#", "Player", "Correct", "Rounds", "Accuracy"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: "0 0 12px",
                      textAlign: i === 0 || i === 1 ? "left" : "right",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "rgba(100,116,139,0.55)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid rgba(6,182,212,0.1)",
                      ...S,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={e.name}
                  style={{ borderBottom: "1px solid rgba(6,182,212,0.06)", transition: "background 0.2s" }}
                  onMouseEnter={(el) => (el.currentTarget.style.background = "rgba(6,182,212,0.04)")}
                  onMouseLeave={(el) => (el.currentTarget.style.background = "transparent")}
                >
                  {/* Rank */}
                  <td style={{ padding: "12px 0", width: 28, ...rankStyle(i), ...S }}>
                    {i === 0 ? "01" : i === 1 ? "02" : i === 2 ? "03" : `${String(i + 1).padStart(2, "0")}`}
                  </td>

                  {/* Player */}
                  <td
                    style={{
                      padding: "12px 0",
                      fontSize: 12,
                      fontWeight: 700,
                      color: i === 0 ? "#e2e8f0" : "rgba(148,163,184,0.8)",
                      letterSpacing: "0.06em",
                      ...S,
                    }}
                  >
                    {e.name}
                    {i === 0 && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 8,
                          padding: "2px 7px",
                          borderRadius: 999,
                          border: "1px solid rgba(251,191,36,0.3)",
                          background: "rgba(251,191,36,0.08)",
                          color: "#fbbf24",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          verticalAlign: "middle",
                        }}
                      >
                        Top
                      </span>
                    )}
                  </td>

                  {/* Correct */}
                  <td style={{ padding: "12px 0", textAlign: "right", fontSize: 12, fontWeight: 700, color: "rgba(34,211,238,0.75)", ...S }}>
                    {e.correctAnswers}
                  </td>

                  {/* Rounds */}
                  <td style={{ padding: "12px 0", textAlign: "right", fontSize: 12, color: "rgba(71,85,105,0.7)", ...S }}>
                    {e.totalRounds}
                  </td>

                  {/* Accuracy */}
                  <td style={{ padding: "12px 0", textAlign: "right", ...S }}>
                    {e.totalRounds > 0 ? (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#22d3ee",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {Math.round((e.correctAnswers / e.totalRounds) * 100)}%
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: "rgba(71,85,105,0.45)" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: 14,
          textAlign: "center",
          fontSize: 9,
          color: "rgba(71,85,105,0.5)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          ...S,
        }}
      >
        Ranked by accuracy · {entries.length} player{entries.length !== 1 ? "s" : ""}
      </p>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}