"use client";

import { useState, useEffect } from "react";
import ComparisonGraph from "./ComparisonGraph";

export default function QueensBoard() {
  const [size] = useState(16);
  const [queens, setQueens] = useState<number[]>(Array(16).fill(-1));

  const [message, setMessage] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [name, setName] = useState("");
  const [method, setMethod] = useState<"sequential" | "parallel">("sequential");
  const [open, setOpen] = useState(false);

  const handleClick = (row: number, col: number) => {
    const updated = [...queens];
    updated[row] = updated[row] === col ? -1 : col;
    setQueens(updated);
  };

  const handleCheck = async () => {
    if (queens.includes(-1)) {
      setMessage("⚠️ Place all queens first!");
      return;
    }

    setMessage("🔍 Checking solver status...");

    try {
      const res = await fetch(`/api/queens/solver-status`, {
        method: "GET",
      });
      const data = await res.json();

      console.log("Solver status:", data);

      if (!data.anyRunning) {
        console.log("No solvers running. Checking solution...");
        setMessage("✅ No solvers running. Checking solution...");
        console.log("User's solution:", name, queens);
        const str = queens.join(",") + ",";
        console.log("Formatted solution string:", str);

        try {

          const checkStart = performance.now();

          const res = await fetch(
            `/api/queens/check-solution?playername=${encodeURIComponent(name)}&answer=${encodeURIComponent(str)}`,
            {
              method: "GET",
            },
          );

          const result = await res.json();

          const checkEnd = performance.now(); // END TIMER
          const checkTime = (checkEnd - checkStart).toFixed(2);

          console.log("Backend response:", result);
          console.log(`Check solution API call took ${checkTime} ms`);

          setMessage(`✅ ${result.status.message} (Checked in ${checkTime} ms)`);

          setApiMessage(result.status.message || "No response from server");
        } catch (error) {
          console.error("Error submitting solution:", error);
          setApiMessage("❌ Failed to submit solution");
        }
      } else {
        setApiMessage("⏳ Solver still running. Please wait...");
      }
    } catch (error) {
      console.error(error);
      setApiMessage("❌ Error checking solver status");
    }
  };

  const handleGenerate = async () => {
    try {
      setApiMessage("Generating...");

      const endpoint =
        method === "sequential" ? "solve-sequential" : "solve-parallel";
      console.log("Selected method:", method);
      const res = await fetch(`/api/queens/${endpoint}`, {
        method: "GET",
      });

      const data = await res.json();

      setApiMessage(
        data.status.message  ||
          "No response from server",
      );
    } catch (error) {
      setApiMessage("❌ API Error");
      console.error(error);
    }
  };

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    //   {/* BUTTONS */}
    //   <div className="flex gap-3 mb-6">
    //     <label className="flex items-center gap-2">
    //       <input
    //         type="radio"
    //         name="solution"
    //         checked={method === "sequential"}
    //         onChange={() => setMethod("sequential")}
    //       />
    //       Solve using sequential method
    //     </label>
    //     <label className="flex items-center gap-2">
    //       <input
    //         type="radio"
    //         name="solution"
    //         checked={method === "parallel"}
    //         onChange={() => setMethod("parallel")}
    //       />
    //       Solve using parallel method
    //     </label>
    //   </div>
    //   <button
    //     onClick={handleGenerate}
    //     className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mb-10 "
    //   >
    //     Genarate solution
    //   </button>

    //   <h1 className="text-3xl font-bold mb-6">
    //     ♟️ {size}x{size} Chess Board
    //   </h1>

    //   {/* BOARD */}
    //   <div
    //     className="grid border-4 border-gray-700"
    //     style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    //   >
    //     {Array.from({ length: size }).map((_, row) =>
    //       Array.from({ length: size }).map((_, col) => {
    //         const isDark = (row + col) % 2 === 1;
    //         const hasQueen = queens[row] === col;

    //         return (
    //           <div
    //             key={`${row}-${col}`}
    //             onClick={() => handleClick(row, col)}
    //             className={`
    //               w-8 h-8 flex items-center justify-center cursor-pointer
    //               ${isDark ? "bg-gray-700" : "bg-gray-200"}
    //             `}
    //           >
    //             {hasQueen && <span className="text-red-500 text-lg">♛</span>}
    //           </div>
    //         );
    //       }),
    //     )}
    //   </div>

    //   {/* NAME INPUT */}
    //   <div className="mb-4 mt-10 w-full max-w-sm">
    //     <input
    //       type="text"
    //       placeholder="Enter your name"
    //       value={name}
    //       onChange={(e) => setName(e.target.value)}
    //       className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600"
    //     />
    //   </div>

    //   <button
    //     onClick={handleCheck}
    //     className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
    //   >
    //     Check My Solution
    //   </button>

    //   {/* MESSAGE */}
    //   <p className="mt-3 mb-5 text-gray-400 text-sm">{message}</p>

    //   {/* API MESSAGE DISPLAY */}
    //   {apiMessage && <div className="mb-4 text-yellow-300">{apiMessage}</div>}

    //   <div>
    //     <button
    //       onClick={() => setOpen(true)}
    //       className="px-4 py-2 mt-7 bg-blue-600 text-white rounded"
    //     >
    //       Show Execution Graph
    //     </button>

    //     <ComparisonGraph isOpen={open} onClose={() => setOpen(false)} />
    //   </div>
    // </div>

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">
        ♟️ {size}x{size} Chess Board
      </h1>

      {/* MAIN LAYOUT */}
      <div className="flex items-start justify-between w-full max-w-6xl">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 w-64">
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600"
            />
          </div>

          <button
            onClick={handleCheck}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            Check My Solution
          </button>
        </div>

        {/* CENTER BOARD */}
        <div className="mx-10">
          <div
            className="grid border-4 border-gray-700"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: size }).map((_, row) =>
              Array.from({ length: size }).map((_, col) => {
                const isDark = (row + col) % 2 === 1;
                const hasQueen = queens[row] === col;

                return (
                  <div
                    key={`${row}-${col}`}
                    onClick={() => handleClick(row, col)}
                    className={`
                  w-8 h-8 flex items-center justify-center cursor-pointer
                  ${isDark ? "bg-gray-700" : "bg-gray-200"}
                `}
                  >
                    {hasQueen && (
                      <span className="text-red-500 text-lg">♛</span>
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4 w-64 ">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="solution"
              checked={method === "sequential"}
              onChange={() => setMethod("sequential")}
            />
            Solve using sequential method
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="solution"
              checked={method === "parallel"}
              onChange={() => setMethod("parallel")}
            />
            Solve using parallel method
          </label>

          <button
            onClick={handleGenerate}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Generate solution
          </button>
        </div>
      </div>

      {/* MESSAGE */}
      <p className="mt-5 mb-5 text-gray-400 text-sm">{message}</p>

      {/* API MESSAGE */}
      {apiMessage && <div className="mb-4 text-yellow-300">{apiMessage}</div>}

      {/* GRAPH BUTTON */}
      <div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 mt-7 bg-blue-600 text-white rounded"
        >
          Show Execution Graph
        </button>

        <ComparisonGraph isOpen={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
