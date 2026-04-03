"use client";

import { useState } from "react";

export function JoinButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold rounded pixel-border border-cyan-400 transition-all"
      >
        HOW TO PLAY
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[var(--bg-card)] pixel-border border-cyan-500 rounded-lg p-6 max-w-lg w-full mx-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">HOW TO PLAY</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-white text-xs"
              >
                [X]
              </button>
            </div>

            <div className="space-y-4 text-[9px] text-gray-300">
              <div>
                <p className="text-cyan-400 font-bold mb-1">1. INSTALL THE PLUGIN</p>
                <p className="text-gray-400 mb-2">In Claude Code, add the marketplace and install buddymon:</p>
                <pre className="bg-black/40 rounded px-3 py-2 text-green-400 overflow-x-auto">
{`/plugin marketplace add do-roemer/buddymon`}
                </pre>
                <p className="text-gray-500 mt-1">Then open /plugin &rarr; Discover tab &rarr; install buddymon.</p>
              </div>

              <div>
                <p className="text-cyan-400 font-bold mb-1">2. TRANSFORM YOUR BUDDY</p>
                <p className="text-gray-400 mb-2">Creates your fighter card with a unique sprite, base stats, class, and moves. Only needed once:</p>
                <pre className="bg-black/40 rounded px-3 py-2 text-green-400 overflow-x-auto">
{`/buddymon transform`}
                </pre>
              </div>

              <div>
                <p className="text-cyan-400 font-bold mb-1">3. FEED YOUR BUDDY</p>
                <p className="text-gray-400 mb-2">Your buddy starts at Lv.1. Feed it burned tokens from your Claude Code sessions to gain XP:</p>
                <pre className="bg-black/40 rounded px-3 py-2 text-green-400 overflow-x-auto">
{`/buddymon feed`}
                </pre>
                <p className="text-gray-500 mt-1">The more you use Claude Code, the stronger your buddy gets.</p>
              </div>

              <div>
                <p className="text-cyan-400 font-bold mb-1">4. UPLOAD TO THE ARENA</p>
                <p className="text-gray-400 mb-2">Upload your buddymon to the arena:</p>
                <pre className="bg-black/40 rounded px-3 py-2 text-green-400 overflow-x-auto">
{`/buddymon upload`}
                </pre>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
