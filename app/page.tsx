"use client";

import { useState } from "react";

type Pages = {
  home: string;
  about: string;
  services: string;
  contact: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [pages, setPages] = useState<Pages | null>(null);
  const [activePage, setActivePage] = useState<keyof Pages>("home");
  const [loading, setLoading] = useState(false);

  // 🔴 CREDITS STATE (FREE TRIAL)
  const [credits, setCredits] = useState(3);

  const generateWebsite = async () => {
    // ❌ NO CREDITS CHECK
    if (credits <= 0) {
      alert("No credits left. Please buy more credits.");
      return;
    }

    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `
Generate a 4-page website in JSON format with keys:
home, about, services, contact.
Each value should be pure HTML body content using Tailwind CSS.
Website idea: ${prompt}
`,
        }),
      });

      const data = await res.json();
      setPages(JSON.parse(data.html));
      setActivePage("home");

      // ✅ CREDIT CUT AFTER SUCCESS
      setCredits((c) => c - 1);
    } catch {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const iframeContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-8">
${
  pages
    ? pages[activePage]
    : "<p style='color:gray'>Preview will appear here</p>"
}
</body>
</html>
`;

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* LEFT NAV */}
      <aside className="w-56 bg-zinc-800 p-4 border-r border-zinc-700">
        <h2 className="font-semibold mb-4">Pages</h2>

        {(["home", "about", "services", "contact"] as (keyof Pages)[]).map(
          (page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              disabled={!pages}
              className={`w-full mb-2 px-3 py-2 rounded text-left ${
                activePage === page
                  ? "bg-red-500"
                  : "bg-zinc-700 hover:bg-zinc-600"
              }`}
            >
              {page.toUpperCase()}
            </button>
          )
        )}
      </aside>

      {/* PREVIEW */}
      <main className="flex-1 p-4 bg-zinc-950">
        <div className="h-full bg-white rounded overflow-hidden">
          <iframe
            title="Preview"
            srcDoc={iframeContent}
            className="w-full h-full"
          />
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="w-80 bg-zinc-800 p-4 border-l border-zinc-700">
        <h2 className="font-semibold mb-2">AI Website Builder</h2>

        {/* 🔢 CREDITS DISPLAY */}
        <p className="text-sm text-gray-300 mb-3">
          Credits left:{" "}
          <span className="font-bold text-white">{credits}</span>
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your website idea..."
          className="w-full h-40 p-3 bg-zinc-900 border border-zinc-700 rounded"
        />

        <button
          onClick={generateWebsite}
          disabled={loading}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Website"}
        </button>

        {/* (Stripe button next step) */}
        <button
          disabled
          className="mt-3 w-full bg-indigo-500 py-2 rounded opacity-60 cursor-not-allowed"
        >
          Buy Credits (Next Step)
        </button>
      </aside>
    </div>
  );
}
