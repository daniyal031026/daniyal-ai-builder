"use client"

type Widgets = {
  form: boolean
  testimonials: boolean
  gallery: boolean
}

type ControlsProps = {
  template: string
  setTemplate: (v: string) => void

  theme: string
  setTheme: (v: string) => void

  lang: string
  setLang: (v: string) => void

  color: string
  setColor: (v: string) => void

  model: string
  setModel: (v: string) => void

  widgets: Widgets
  setWidgets: (v: Widgets) => void
}

export default function Controls({
  template,
  setTemplate,
  theme,
  setTheme,
  lang,
  setLang,
  color,
  setColor,
  model,
  setModel,
  widgets,
  setWidgets,
}: ControlsProps) {
  return (
    <div>
      {/* TEMPLATE */}
      <h3>Template</h3>
      <select value={template} onChange={(e) => setTemplate(e.target.value)}>
        <option value="portfolio">Portfolio</option>
        <option value="business">Business</option>
        <option value="landing">Landing</option>
      </select>

      {/* THEME */}
      <h3>Theme</h3>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      {/* LANGUAGE */}
      <h3>Language</h3>
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="ur">Urdu</option>
        <option value="hi">Hindi</option>
      </select>

      {/* AI MODEL */}
      <h3>AI Model</h3>
      <select value={model} onChange={(e) => setModel(e.target.value)}>
        <option value="openai">OpenAI</option>
        <option value="gemini">Gemini</option>
        <option value="claude">Claude</option>
      </select>

      {/* COLOR */}
      <h3>Primary Color</h3>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      {/* WIDGETS */}
      <h3>Widgets</h3>

      <label>
        <input
          type="checkbox"
          checked={widgets.form}
          onChange={() =>
            setWidgets({ ...widgets, form: !widgets.form })
          }
        />
        Contact Form
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={widgets.testimonials}
          onChange={() =>
            setWidgets({
              ...widgets,
              testimonials: !widgets.testimonials,
            })
          }
        />
        Testimonials
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={widgets.gallery}
          onChange={() =>
            setWidgets({ ...widgets, gallery: !widgets.gallery })
          }
        />
        Gallery
      </label>
    </div>
  )
}
