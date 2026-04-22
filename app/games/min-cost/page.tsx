'use client';

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type AlgorithmStat = {
  algorithmName: string;
  executionTimeMs: number;
  totalCost: number;
};

type RoundResult = {
  roundId: number;
  tasks: number;
  minCost: number;
  algorithmsAgree: boolean;
  createdAt?: string;
  stats: AlgorithmStat[];
};

type HistoryResponse = {
  page?: number;
  size?: number;
  totalRounds?: number;
  totalPages?: number;
  rounds: RoundResult[];
  count?: number;
};

function formatDate(value?: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getAlgorithmColor(algorithmName: string) {
  const normalized = algorithmName.toLowerCase();
  if (normalized.includes("hungarian")) return "bg-cyan-400";
  if (normalized.includes("flow")) return "bg-emerald-400";
  return "bg-amber-400";
}

export default function MinimumCostPage() {
  const defaultPageSize = 10;
  const [activeTab, setActiveTab] = useState<"play" | "history">("play");
  const [currentRound, setCurrentRound] = useState<RoundResult | null>(null);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(defaultPageSize);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalCount, setHistoryTotalCount] = useState(0);
  const [loadingRound, startRoundTransition] = useTransition();
  const [loadingHistory, startHistoryTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const loadHistory = (page = historyPage) => {
    startHistoryTransition(async () => {
      try {
        setErrorMessage(null);
        const response = await fetch(`/api/minimum-cost/round-history?page=${page}&size=${historyPageSize}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load round history.");
        }

        const data = (await response.json()) as HistoryResponse;
        setHistory(data.rounds ?? []);
        setHistoryTotalCount(data.totalRounds ?? data.count ?? 0);
        setHistoryTotalPages(data.totalPages ?? Math.max(1, Math.ceil((data.totalRounds ?? data.count ?? 0) / (data.size ?? historyPageSize))));
        setHistoryPageSize(data.size ?? historyPageSize);
        setHistoryPage(data.page ?? page);
        setHistoryLoaded(true);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load round history.");
      }
    });
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const runRound = () => {
    startRoundTransition(async () => {
      try {
        setErrorMessage(null);
        const response = await fetch("/api/minimum-cost/play-round", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Unable to start a minimum cost round.");
        }

        const data = (await response.json()) as RoundResult;
        setCurrentRound(data);
        setHistory((previousHistory) => [data, ...previousHistory.filter((round) => round.roundId !== data.roundId)]);
        setHistoryLoaded(true);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to start a minimum cost round.");
      }
    });
  };

  const latestStats = currentRound?.stats ?? [];
  const chartRounds = history.slice(0, 10).reverse();
  const maxExecutionTime =
    Math.max(1, ...chartRounds.flatMap((round) => round.stats.map((stat) => stat.executionTimeMs)));
  const canGoPreviousPage = historyPage > 0;
  const canGoNextPage = historyPage + 1 < historyTotalPages;
  const pageStart = historyTotalCount === 0 ? 0 : historyPage * historyPageSize + 1;
  const pageEnd = history.length === 0 ? 0 : pageStart + history.length - 1;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">Optimization Game</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Minimum Cost</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Assign N tasks to N employees, compare Hungarian and Min Cost Flow, and record the execution time for every round.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Back to menu
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-2 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("play")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeTab === "play" ? "bg-cyan-500/20 text-cyan-200" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
            >
              Play Round
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${activeTab === "history" ? "bg-cyan-500/20 text-cyan-200" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
            >
              History
            </button>
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {errorMessage}
          </div>
        ) : null}

        {activeTab === "play" ? (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-cyan-300">Game Controls</p>
                  <h2 className="mt-1 text-2xl font-semibold">Play a new round</h2>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  Backend decides random N (50 to 100)
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={runRound}
                  disabled={loadingRound}
                  className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingRound ? "Running..." : "Play Round"}
                </button>
                <button
                  type="button"
                  onClick={() => loadHistory()}
                  disabled={loadingHistory}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingHistory ? "Loading..." : "Refresh History"}
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Active tasks", value: currentRound?.tasks ?? "-", note: "Per round" },
                  { label: "Minimum cost", value: currentRound?.minCost ?? "-", note: "Matching result" },
                  { label: "History rounds", value: historyLoaded ? historyTotalCount : "-", note: historyLoaded ? `Page ${historyPage + 1} loaded` : "Waiting" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-linear-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-cyan-300">Latest Round</p>
                    <h3 className="mt-1 text-xl font-semibold">Round {currentRound?.roundId ?? "-"}</h3>
                  </div>
                  <div
                    className={`rounded-full px-4 py-2 text-sm font-medium ${currentRound?.algorithmsAgree ? "bg-emerald-500/15 text-emerald-200" : "bg-amber-500/15 text-amber-200"}`}
                  >
                    {currentRound ? (currentRound.algorithmsAgree ? "Algorithms agree" : "Algorithms differ") : "No round played yet"}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {latestStats.length > 0 ? (
                    latestStats.map((stat) => (
                      <div key={stat.algorithmName} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-semibold text-white">{stat.algorithmName}</h4>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                            {stat.executionTimeMs} ms
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-400">Total cost</p>
                        <p className="text-2xl font-semibold text-cyan-200">${stat.totalCost}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400 sm:col-span-2">
                      Run a round to compare Hungarian and Min Cost Flow results here.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <p className="text-sm font-medium text-amber-300">Game Rules</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  <li>A company has N tasks and N employees.</li>
                  <li>N changes randomly from 50 to 100 in each game round.</li>
                  <li>Each assignment cost changes randomly from $20 to $200.</li>
                  <li>The page shows both algorithms, their costs, and execution times.</li>
                  <li>Every round is pulled from the backend history table.</li>
                </ul>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-cyan-300">Round History</p>
                <h3 className="mt-1 text-xl font-semibold">Latest database rounds</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Showing {pageStart}-{pageEnd} of {historyTotalCount}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadHistory(historyPage - 1)}
                  disabled={!canGoPreviousPage || loadingHistory}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Previous
                </button>
                <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-slate-300">
                  Page {historyPage + 1} / {historyTotalPages}
                </span>
                <button
                  type="button"
                  onClick={() => loadHistory(historyPage + 1)}
                  disabled={!canGoNextPage || loadingHistory}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => loadHistory(historyPage)}
                  disabled={loadingHistory}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Reload
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-slate-200">Algorithm efficiency per round (execution time in ms)</h4>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    Hungarian
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    MinCostFlow
                  </span>
                </div>
              </div>

              {chartRounds.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <div className="flex min-w-160 items-end gap-3">
                    {chartRounds.map((round) => (
                      <div key={round.roundId} className="flex min-w-14 flex-col items-center gap-2">
                        <div className="flex h-44 items-end gap-1 rounded-xl border border-white/10 bg-slate-900/70 px-2 py-2">
                          {round.stats.map((stat) => {
                            const barHeight = Math.max(8, Math.round((stat.executionTimeMs / maxExecutionTime) * 148));

                            return (
                              <div key={`${round.roundId}-${stat.algorithmName}`} className="flex flex-col items-center gap-1">
                                <div className="text-[10px] text-slate-300">{stat.executionTimeMs}</div>
                                <div
                                  className={`w-3 rounded-sm ${getAlgorithmColor(stat.algorithmName)}`}
                                  style={{ height: `${barHeight}px` }}
                                  title={`${stat.algorithmName}: ${stat.executionTimeMs}ms`}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-xs text-slate-300">R{round.roundId}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">No history data yet. Play rounds to build efficiency chart.</p>
              )}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <div className="max-h-112 overflow-auto">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="sticky top-0 bg-slate-950/95 text-slate-300 backdrop-blur">
                    <tr>
                      <th className="px-4 py-3 font-medium">Round</th>
                      <th className="px-4 py-3 font-medium">Tasks</th>
                      <th className="px-4 py-3 font-medium">Min Cost</th>
                      <th className="px-4 py-3 font-medium">Algorithm Times (ms)</th>
                      <th className="px-4 py-3 font-medium">Agree</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-white/5">
                    {history.length > 0 ? (
                      history.map((round) => (
                        <tr key={round.roundId} className="transition hover:bg-white/5">
                          <td className="px-4 py-3 font-medium text-white">#{round.roundId}</td>
                          <td className="px-4 py-3 text-slate-300">{round.tasks}</td>
                          <td className="px-4 py-3 text-cyan-200">${round.minCost}</td>
                          <td className="px-4 py-3 text-slate-300">
                            <div className="space-y-1">
                              {round.stats.map((stat) => (
                                <div key={`${round.roundId}-${stat.algorithmName}`} className="flex items-center justify-between gap-3 text-xs">
                                  <span className="text-slate-400">{stat.algorithmName}</span>
                                  <span className="font-medium text-slate-200">{stat.executionTimeMs} ms</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${round.algorithmsAgree ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>
                              {round.algorithmsAgree ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400">{formatDate(round.createdAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-6 text-slate-400" colSpan={6}>
                          No history yet. Play a round to save one in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>
        )}
      </section>
    </main>
  );
}
