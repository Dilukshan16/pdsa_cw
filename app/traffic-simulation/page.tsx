"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function MenuPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const nodes = Array.from({ length: 32 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 180) {
            ctx.strokeStyle = `rgba(6,182,212,${(1 - d / 180) * 0.14})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(6,182,212,0.28)";
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const S: React.CSSProperties = { fontFamily: "'Courier New', Courier, monospace" };

  const corners = [
    { top: -1, left: -1, borderTop: "2px solid #22d3ee", borderLeft: "2px solid #22d3ee" },
    { top: -1, right: -1, borderTop: "2px solid #22d3ee", borderRight: "2px solid #22d3ee" },
    { bottom: -1, left: -1, borderBottom: "2px solid #22d3ee", borderLeft: "2px solid #22d3ee" },
    { bottom: -1, right: -1, borderBottom: "2px solid #22d3ee", borderRight: "2px solid #22d3ee" },
  ];

  return (
    <main
      style={{
        ...S,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "linear-gradient(135deg, #080d18 0%, #0f1724 50%, #040810 100%)",
      }}
    >
      {/* Background canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* Radial center glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Top edge line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.55), transparent)" }} />
      {/* Bottom edge line */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)" }} />

      {/* Version — absolute top-left */}
      <div style={{ position: "absolute", top: 20, left: 24, fontSize: "10px", color: "rgba(6,182,212,0.35)", letterSpacing: "0.2em", ...S }}>
        v1.0.0
      </div>

      {/* Status — absolute top-right */}
      <div style={{ position: "absolute", top: 18, right: 24, display: "flex", alignItems: "center", gap: 6, fontSize: "10px", color: "rgba(6,182,212,0.45)", letterSpacing: "0.18em", ...S }}>
        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 8px #22d3ee", animation: "blink 2s ease-in-out infinite" }} />
        ONLINE
      </div>

      {/* ── Central panel ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Card */}
        <div
          style={{
            position: "relative",
            width: "100%",
            background: "rgba(6,182,212,0.025)",
            border: "1px solid rgba(6,182,212,0.14)",
            borderRadius: "4px",
            padding: "44px 32px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
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
                width: 16,
                height: 16,
                borderTop: c.borderTop,
                borderBottom: c.borderBottom,
                borderLeft: c.borderLeft,
                borderRight: c.borderRight,
              }}
            />
          ))}

          {/* Live badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22d3ee", display: "inline-block", animation: "blink 2s ease-in-out infinite" }} />
            Network Simulation
          </div>

          {/* Title block — perfectly centered */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                background: "linear-gradient(180deg, #f1f5f9 0%, #64748b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                ...S,
              }}
            >
              TRAFFIC
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                background: "linear-gradient(180deg, #38bdf8 0%, #0891b2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                ...S,
              }}
            >
              FLOW
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 10,
                color: "rgba(148,163,184,0.5)",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                ...S,
              }}
            >
              Maximum Flow · Network Challenge
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.22))" }} />
            <div style={{ width: 5, height: 5, background: "rgba(6,182,212,0.45)", transform: "rotate(45deg)" }} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(6,182,212,0.22), transparent)" }} />
          </div>

          {/* Buttons — both full width, centered content */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Primary CTA */}
            <Link
              href="/traffic-simulation/game-TS"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                padding: "16px 0",
                borderRadius: 6,
                background: "linear-gradient(135deg, #0e7490, #06b6d4)",
                color: "#00151e",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                border: "none",
                boxSizing: "border-box",
                transition: "opacity 0.2s, transform 0.2s",
                ...S,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0.88";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Start Simulation
            </Link>

            {/* Secondary */}
            <Link
              href="/traffic-simulation/game-TS?tab=leaderboard"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                padding: "16px 0",
                borderRadius: 6,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(6,182,212,0.16)",
                color: "#64748b",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s, color 0.2s, background 0.2s",
                ...S,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.38)";
                (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                (e.currentTarget as HTMLElement).style.background = "rgba(6,182,212,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.16)";
                (e.currentTarget as HTMLElement).style.color = "#64748b";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              Leaderboard
            </Link>
          </div>

          {/* Stats strip */}
          <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Source", value: "Node A" },
              { label: "Mode", value: "Max Flow" },
              { label: "Sink", value: "Node T" },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  padding: "10px 6px",
                  borderRadius: 4,
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(6,182,212,0.09)",
                  textAlign: "center",
                  ...S,
                }}
              >
                <span style={{ fontSize: 9, color: "rgba(100,116,139,0.55)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  {label}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#22d3ee", letterSpacing: "0.06em" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer text below card */}
        <p
          style={{
            marginTop: 18,
            fontSize: 10,
            color: "rgba(71,85,105,0.7)",
            textAlign: "center",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            ...S,
          }}
        >
          Route vehicles from{" "}
          <span style={{ color: "rgba(148,163,184,0.75)" }}>A</span>
          {" → "}
          <span style={{ color: "rgba(148,163,184,0.75)" }}>T</span>
          {" · Maximize throughput"}
        </p>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </main>
  );
}