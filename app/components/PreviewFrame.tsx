"use client"

export default function PreviewFrame({ html }: { html: string }) {
  return (
    <iframe
      srcDoc={html}
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  )
}
