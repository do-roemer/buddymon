"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function UploadCard() {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const router = useRouter();

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);

      try {
        const text = await file.text();
        JSON.parse(text); // validate it's valid JSON

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: text,
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Upload failed");
          setUploading(false);
          return;
        }

        const { buddy } = await res.json();
        router.push(`/buddy/${buddy.id}`);
        router.refresh();
      } catch {
        setError("Failed to parse file. Is it a valid JSON fighter card?");
      }

      setUploading(false);
    },
    [router],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div
      className={`
        pixel-border rounded-lg p-8 text-center cursor-pointer transition-all
        ${dragOver ? "border-cyan-400 bg-cyan-950/20 scale-102" : "border-gray-600 bg-[var(--bg-card)] hover:border-gray-400"}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleFile(file);
        };
        input.click();
      }}
    >
      <div className="text-4xl mb-4">
        {uploading ? "..." : ">>"}
      </div>
      <p className="text-sm text-gray-300">
        {uploading ? "Uploading..." : "Drop your buddymon-card.json here"}
      </p>
      <p className="text-[8px] text-gray-500 mt-2">
        Generate one with: buddymon export
      </p>
      {error && (
        <p className="text-[10px] text-red-400 mt-3">{error}</p>
      )}
    </div>
  );
}
