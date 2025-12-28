"use client"

export default function PromptPanel({
  prompt,
  setPrompt,
}: {
  prompt: string
  setPrompt: (v: string) => void
}) {
  return (
    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="Describe your website..."
      style={{ width: "100%", height: 120 }}
    />
  )
}
