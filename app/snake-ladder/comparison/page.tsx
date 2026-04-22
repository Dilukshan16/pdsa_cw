'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getComparison, ComparisonData } from '@/lib/snake-ladder/api';
import ComparisonTable from '@/components/components/snake-ladder/ComparisonTable';

export default function ComparisonPage() {
  const [data, setData]       = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getComparison()
      .then(setData)
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/snake-ladder"
            className="text-slate-500 hover:text-yellow-400 transition-colors text-sm font-mono">
            ← Back
          </Link>
          <h1 className="text-3xl font-black text-yellow-400"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Algorithm Comparison
          </h1>
          <div className="w-16" />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20
            rounded-xl px-4 py-3 mb-6 text-center">
            ⚠ {error} — Is the Spring Boot server running on port 8080?
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
          </div>
        ) : data ? (
          <ComparisonTable games={data.games} averages={data.averages} />
        ) : null}
      </div>
    </main>
  );
}