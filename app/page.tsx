'use client'

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { use } from "react";

const games = [
  {
    title: "Sixteen Queens",
    description: "Solve the queens puzzle ",
    href: "/queens",
  },
  {
    title: "Minimum Cost",
    description: "Optimize task assignments",
    href: "/games/min-cost",
  },
  {
    title: "Traffic Simulation",
    description: "Optimize task assignments",
    href: "/traffic-simulation",
  },
  {
    title: "Snake & Ladders",
    description: "Classic board game fun",
    href: "/games/snake",
  },
  {
    title: "Knights Tour",
    description: "Classic board game fun",
    href: "/knights",
  },
];


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-wide">
          🎮 PDSA Game Hub 🎮
        </h1>
        <p className="text-gray-400 mt-2">
          Choose a game of your choice and start playing
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {games.map((game, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.10 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">
              {game.title}
            </h2>

            <p className="text-gray-300 mb-4">
              {game.description}
            </p>

            <Link href={game.href}>
              <button className="w-full bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded-lg font-medium">
                Play Now
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
