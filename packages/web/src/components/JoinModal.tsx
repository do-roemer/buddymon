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
        HOW TO JOIN
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
              <h2 className="text-sm font-bold text-white">JOIN THE ARENA</h2>
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
                <p className="text-gray-400 mb-2">Claude designs a unique full-body sprite based on your stats and class:</p>
                <pre className="bg-black/40 rounded px-3 py-2 text-green-400 overflow-x-auto">
{`/buddymon transform`}
                </pre>
                <p className="text-gray-500 mt-1">Your stats are generated from your Claude Code usage data.</p>
              </div>

              <div>
                <p className="text-cyan-400 font-bold mb-1">3. UPLOAD TO THE ARENA</p>
                <p className="text-gray-400 mb-2">Upload your transformed buddymon to the arena:</p>
                <pre className="bg-black/40 rounded px-3 py-2 text-green-400 overflow-x-auto">
{`/buddymon upload`}
                </pre>
              </div>

              <div>
                <p className="text-cyan-400 font-bold mb-1">4. BATTLE</p>
                <p className="text-gray-400 mb-2">Challenge any fighter in the arena by name:</p>
                <pre className="bg-black/40 rounded px-3 py-2 text-green-400 overflow-x-auto">
{`/buddymon battle <opponent-name>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
