'use client'

import { useState } from "react";

// const BOARD_SIZE = 16;


export default function QueensBoard() {
  const [size, setSize] = useState(8);
  const [queens, setQueens] = useState<number[]>(Array(8).fill(-1));
  const [message, setMessage] = useState("");

    // Reset board when size changes
  const handleSizeChange = (n: number) => {
    setSize(n);
    setQueens(Array(n).fill(-1));
    setMessage("");
   
  };

  const handleClick = (row: number, col: number) => {
    const updated = [...queens];
    updated[row] = updated[row] === col ? -1 : col;
    setQueens(updated);

    console.log(`Clicked on row ${row}, col ${col}`);
  };

    const handleCheck = () => {
    if (queens.includes(-1)) {
      setMessage("⚠️ Place all queens first!");
      return;
    }

    // if (isValid(queens)) {
    //   setMessage("✅ Correct solution!");
    // } else {
    //   setMessage("❌ Invalid placement!");
    // }
  };

  

  

  console.log("Current queens positions:", queens);

  return (


    <>

     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">

      <div className="flex flex-wrap gap-3 mb-6">
        {/* Dropdown */}
        <select
          value={size}
          onChange={(e) => handleSizeChange(Number(e.target.value))}
          className="bg-gray-800 border border-gray-600 px-3 py-2 rounded"
        >
          {[8, 10, 12, 14, 16].map((n) => (
            <option key={n} value={n}>
              {n} x {n}
            </option>
          ))}
        </select>

        <button
          // onClick={handleGenerate}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Generate Solution
        </button>

      
      </div>
      
      <h1 className="text-3xl font-bold mb-6">♟️ 16x16 Chess Board</h1>

      <div
        className="grid border-4 border-gray-700" style={{gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,}}>
        {Array.from({ length: size }).map((_, row) =>
          Array.from({ length: size }).map((_, col) => {
            const isDark = (row + col) % 2 === 1;
            const hasQueen = queens[row] === col;

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => handleClick(row, col)}
                className={`
                  w-8 h-8 sm:w-8 sm:h-8 md:w-8 md:h-8
                  flex items-center justify-center cursor-pointer
                  ${isDark ? "bg-gray-700" : "bg-gray-200"}
                `}
              >
                {hasQueen && (
                  <span className="text-red-500 text-lg">♛</span>
                )}
              </div>
            );
          })
        )}
      </div>
      <p className="mt-6 text-gray-400 text-sm">
        Click squares to place/remove queens
      </p>

        <button
          onClick={handleCheck}
          className="bg-green-500 hover:bg-green-600 px-4 mt-5 py-2 rounded"
        >
          Check My Solution
        </button>
    </div>


    
    
    
    
    </>
   

    



  );
}