"use client";

import { useEffect, useRef, useState } from "react";
import { themes } from "./themes";

type PagesType = {
  home: string;
  about: string;
  contact: string;
};

type Project = {
  id: string;
  name: string;
  pages: PagesType;
  theme: string;
};

export default function HomePage() {
  // 🔐 Auth
  const [user, setUser] = useState<string | null>(null);

  // 📁 Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // 🧠 Builder states
  const [description, setDescription] = useState(""); // 🔴 renamed from prompt
  const [theme, setTheme] = useState<keyof typeof themes>("modern");
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] =
    useState<keyof PagesType>("home");

  const previewRef = useRef<HTMLDivElement | null>(null);

  const activeProject = projects.find(
    (p) => p.id === activeProjectId
  );

  // 🔹 Load user & projects
  useEffect(() => {
    const u = localStorage.getItem("user");
    const p = localStorage.getItem("projects");

    if (u) setUser(u);
    if (p) setProjects(JSON.parse(p));
  }, []);

  // 🔹 Save projects
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  // 🔐 LOGIN (FIXED)
  const login = () => {
    const name = window.prompt("Enter your name");
    if (!name) return;

    setUser(name);
    localStorage.setItem("user", name);
  };

  const logout = () => {
    setUser(null);
    setProjects([]);
    setActiveProjectId(null);
    localStorage.clear();
  };

  // ➕ Create project
  const createProject = () => {
    const name = window.prompt("Project name?");
    if (!name) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      theme,
      pages: { home: "", about: "", contact: "" },
    };

    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(newProject.id);
  };

  // 🤖 Generate website
  const handleGenerate = async () => {
    if (!description.trim() || !activeProject) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `
Create a professional 3-page website.

Each page must be full HTML with inline CSS.

Pages:
- Home
- About
- Contact

Theme instructions:
${themes[theme].prompt}

Website description:
${description}
          `,
        }),
      });

      const data = await res.json();

      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProject.id
            ? { ...p, pages: data, theme }
            : p
        )
      );
    } catch {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <main className="h-screen flex items-center justify-center">
        <button
          onClick={login}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Login to Builder
        </button>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {user}
        </h1>
        <button onClick={logout} className="underline">
          Logout
        </button>
      </div>

      {/* Projects */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={createProject}
          className="border px-3 py-1"
        >
          + New Project
        </button>

        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveProjectId(p.id)}
            className={`border px-3 py-1 ${
              p.id === activeProjectId
                ? "bg-black text-white"
                : ""
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {!activeProject && (
        <p>Create or select a project 👆</p>
      )}

      {activeProject && (
        <>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your website..."
            className="border p-2 w-full mb-3"
          />

          {/* Themes */}
          <div className="flex gap-2 mb-3">
            {Object.entries(themes).map(([k, t]) => (
              <button
                key={k}
                onClick={() => setTheme(k as any)}
                className={`border px-3 py-1 ${
                  theme === k
                    ? "bg-black text-white"
                    : ""
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            className="bg-black text-white px-5 py-2 mb-4"
          >
            {loading ? "Generating..." : "Generate Website"}
          </button>

          {/* Tabs */}
          <div className="flex gap-2 mb-2">
            {(["home", "about", "contact"] as const).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setActivePage(p)}
                  className={`border px-3 py-1 ${
                    activePage === p
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              )
            )}
          </div>

          {/* Preview */}
          {activeProject.pages[activePage] && (
            <div
              ref={previewRef}
              className="border p-4 bg-white min-h-[400px]"
              dangerouslySetInnerHTML={{
                __html:
                  activeProject.pages[activePage],
              }}
            />
          )}
        </>
      )}
    </main>
  );
}
