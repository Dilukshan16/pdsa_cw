"use client";
import { useEffect, useRef } from "react";
import type { Network } from "vis-network";
import type { EdgeDTO } from "@/app/api/traffic-simulation-api/api";

interface Props {
  nodes: string[];
  edges: EdgeDTO[];
}

const NODE_COLORS: Record<string, { background: string; border: string; font: string }> = {
  A: { background: "#0e7490", border: "#22d3ee", font: "#e2e8f0" },
  T: { background: "#164e63", border: "#22d3ee", font: "#22d3ee" },
};

const corners = [
  { top: -1, left: -1, borderTop: "2px solid #22d3ee", borderLeft: "2px solid #22d3ee" },
  { top: -1, right: -1, borderTop: "2px solid #22d3ee", borderRight: "2px solid #22d3ee" },
  { bottom: -1, left: -1, borderBottom: "2px solid #22d3ee", borderLeft: "2px solid #22d3ee" },
  { bottom: -1, right: -1, borderBottom: "2px solid #22d3ee", borderRight: "2px solid #22d3ee" },
];

export default function TrafficGraph({ nodes, edges }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    Promise.all([import("vis-network"), import("vis-data")]).then(
      ([visNetwork, visData]) => {
        const { Network } = visNetwork;
        const { DataSet } = visData;

        const nodeData = nodes.map((n) => ({
          id: n,
          label: n,
          color: NODE_COLORS[n] ?? {
            background: "rgba(6,182,212,0.12)",
            border: "rgba(6,182,212,0.45)",
          },
          font: {
            color: NODE_COLORS[n]?.font ?? "#22d3ee",
            size: 14,
            face: "'Courier New', Courier, monospace",
            bold: "bold",
          },
          shape: "circle",
          size: n === "A" || n === "T" ? 28 : 20,
          borderWidth: 2,
          shadow: false,
        }));

        const edgeData = edges.map((e, i) => ({
          id: i,
          from: e.from,
          to: e.to,
          label: `${e.capacity}`,
          arrows: "to",
          color: {
            color: "rgba(6,182,212,0.3)",
            highlight: "#22d3ee",
            hover: "rgba(6,182,212,0.6)",
          },
          font: {
            color: "rgba(148,163,184,0.85)",
            size: 11,
            face: "'Courier New', Courier, monospace",
            background: "rgba(4,8,16,0.8)",
            strokeWidth: 0,
          },
          width: 1.5,
          smooth: { enabled: true, type: "curvedCW", roundness: 0.15 },
        }));

        const data = {
          nodes: new DataSet(nodeData),
          edges: new DataSet(edgeData),
        };

        const options = {
          layout: {
            hierarchical: {
              direction: "LR",
              sortMethod: "directed",
              levelSeparation: 130,
              nodeSpacing: 90,
            },
          },
          physics: { enabled: false },
          interaction: { dragNodes: true, zoomView: true },
          edges: {
            smooth: { enabled: true, type: "dynamic", roundness: 0.15 },
          },
          // Override vis-network's default white canvas background
          configure: { enabled: false },
        };

        if (networkRef.current) networkRef.current.destroy();

        networkRef.current = new Network(containerRef.current!, data, options);

        // Force dark canvas background after mount
        const canvas = containerRef.current?.querySelector("canvas");
        if (canvas) {
          canvas.style.background = "transparent";
        }
      }
    );

    return () => {
      networkRef.current?.destroy();
    };
  }, [nodes, edges]);

  return (
    <div
      style={{
        position: "relative",
        fontFamily: "'Courier New', Courier, monospace",
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
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Top label bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 9,
            color: "rgba(6,182,212,0.6)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
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
          Network Graph
        </div>
        <div
          style={{
            fontSize: 9,
            color: "rgba(100,116,139,0.5)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {nodes.length} nodes · {edges.length} edges
        </div>
      </div>

      {/* Graph canvas */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "340px",
          borderRadius: "4px",
          border: "1px solid rgba(6,182,212,0.14)",
          background: "rgba(6,182,212,0.025)",
          overflow: "hidden",
        }}
      />

      {/* Bottom edge glow line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}