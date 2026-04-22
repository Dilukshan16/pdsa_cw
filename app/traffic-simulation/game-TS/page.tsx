"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import GamePanel from "@/components/TSGamePanel";
import ResultModal from "@/components/TSResultModal";
import Leaderboard from "@/components/TSLeaderboard";
import { fetchNewRound, submitAnswer, GameState, AnswerResult } from "@/app/api/traffic-simulation-api/api";

const TrafficGraph = dynamic(() => import("@/components/TSTrafficGraph"), { ssr: false });

function GamePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<"game" | "leaderboard">(
    searchParams.get("tab") === "leaderboard" ? "leaderboard" : "game"
  );

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewRound = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const state = await fetchNewRound();
      setGameState(state);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "game") startNewRound();
  }, [tab]);

  const handleSubmit = async (answer: number) => {
    if (!gameState) return;
    if (!playerName.trim()) { setError("Please enter your name"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await submitAnswer(playerName, gameState.roundId, answer);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #111827 0%, #1f2937 50%, #000000 100%)",
        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          opacity: 0.5,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-8" style={{ zIndex: 1 }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#6b7280",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.02em",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 0.15s",
              padding: "6px 0",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d1d5db")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Menu
          </button>

          {/* Title */}
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#f9fafb",
                margin: 0,
                lineHeight: 1,
              }}
            >
              Traffic Flow
            </h1>
            <p style={{ fontSize: "11px", color: "#4b5563", margin: "3px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Max Flow Challenge
            </p>
          </div>

          {/* Tab switcher */}
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "3px",
              gap: "2px",
            }}
          >
            {(["game", "leaderboard"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "7px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: tab === t ? "#ffffff" : "transparent",
                  color: tab === t ? "#111827" : "#6b7280",
                }}
              >
                {t === "game" ? "Play" : "Board"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Leaderboard ── */}
        {tab === "leaderboard" && <Leaderboard />}

        {/* ── Game tab ── */}
        {tab === "game" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Instructions banner */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "14px 18px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.07)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
              <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>
                Find the maximum number of vehicles <span style={{ color: "#d1d5db", fontWeight: 600 }}>(per minute)</span> that can travel from source{" "}
                <span style={{ color: "#4ade80", fontWeight: 700 }}>A</span> to sink{" "}
                <span style={{ color: "#f87171", fontWeight: 700 }}>T</span>. Edge labels show road capacities.
              </p>
            </div>

            {/* Graph area */}
            <div
              style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
                overflow: "hidden",
                minHeight: "260px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {gameState ? (
                <div style={{ width: "100%" }}>
                  <TrafficGraph nodes={gameState.nodes} edges={gameState.edges} />
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          border: "2px solid rgba(255,255,255,0.08)",
                          borderTopColor: "#6b7280",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      <span style={{ color: "#4b5563", fontSize: "13px" }}>Loading network…</span>
                    </div>
                  ) : (
                    <span style={{ color: "#374151", fontSize: "13px" }}>No active round</span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom grid: GamePanel + Capacity table */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

              {/* Game panel */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "14px",
                  padding: "20px",
                }}
              >
                <GamePanel
                  playerName={playerName}
                  onNameChange={setPlayerName}
                  onSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                />
              </div>

              {/* Capacity reference table */}
              {gameState && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#d1d5db", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      Road Capacities
                    </h3>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#4b5563",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "6px",
                        padding: "2px 8px",
                      }}
                    >
                      {gameState.edges.length} edges
                    </span>
                  </div>

                  {/* Edge list */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      maxHeight: "176px",
                      overflowY: "auto",
                      flex: 1,
                    }}
                  >
                    {gameState.edges.map((e) => (
                      <div
                        key={`${e.from}-${e.to}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "7px 10px",
                          borderRadius: "8px",
                          background: "rgba(0,0,0,0.25)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              color: e.from === "A" ? "#4ade80" : "#d1d5db",
                              fontFamily: "monospace",
                            }}
                          >
                            {e.from}
                          </span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              color: e.to === "T" ? "#f87171" : "#d1d5db",
                              fontFamily: "monospace",
                            }}
                          >
                            {e.to}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#f9fafb",
                            fontFamily: "monospace",
                            background: "rgba(255,255,255,0.06)",
                            padding: "2px 8px",
                            borderRadius: "5px",
                          }}
                        >
                          {e.capacity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* New network button */}
                  <button
                    onClick={startNewRound}
                    disabled={loading}
                    style={{
                      marginTop: "14px",
                      width: "100%",
                      padding: "9px 0",
                      borderRadius: "9px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.04)",
                      color: loading ? "#374151" : "#9ca3af",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.color = "#d1d5db";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.color = "#9ca3af";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M1 4v6h6M23 20v-6h-6" />
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" />
                    </svg>
                    New Network
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Result modal */}
      {result && (
        <ResultModal
          result={result}
          onPlayAgain={() => { setResult(null); startNewRound(); }}
          onLeaderboard={() => { setResult(null); setTab("leaderboard"); }}
        />
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }
      `}</style>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense>
      <GamePageContent />
    </Suspense>
  );
}