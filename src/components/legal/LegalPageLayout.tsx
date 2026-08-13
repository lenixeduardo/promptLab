import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { PageSEO } from "@/components/PageSEO"

export interface LegalSection {
  id: string
  heading: string
  body: React.ReactNode
}

interface LegalPageLayoutProps {
  seoTitle: string
  seoDescription: string
  canonicalPath: string
  title: string
  lastUpdated: string
  intro?: string
  sections: LegalSection[]
}

/** Shared shell for /terms and /privacy — single reading column, TOC, anchors. */
export function LegalPageLayout({
  seoTitle,
  seoDescription,
  canonicalPath,
  title,
  lastUpdated,
  intro,
  sections,
}: LegalPageLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <PageSEO title={seoTitle} description={seoDescription} canonicalPath={canonicalPath} />

      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-stroke-muted bg-white px-4 py-3">
        <Link
          to="/"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-primary-dark hover:bg-surface-success focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-sm font-bold text-primary-dark">PromptLabz</span>
      </header>

      <main className="mx-auto w-full max-w-[70ch] flex-1 px-5 py-8">
        <h1 className="text-2xl font-extrabold text-foregroundDark">{title}</h1>
        <p className="mt-1 text-sm text-foregroundMuted">Última atualização: {lastUpdated}</p>

        {intro && <p className="mt-4 leading-relaxed text-foregroundSecondary">{intro}</p>}

        <nav aria-label="Índice" className="mt-6 rounded-2xl border border-stroke-muted bg-pageBgLight p-4">
          <h2 className="mb-2 text-sm font-bold text-foregroundDark">Nesta página</h2>
          <ol className="space-y-1 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-link underline underline-offset-2 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <h2 className="mb-2 text-lg font-bold text-foregroundDark">{s.heading}</h2>
              <div className="leading-relaxed text-foregroundSecondary [&_a]:text-link [&_a]:underline [&_a]:underline-offset-2">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-stroke-muted px-5 py-6 text-center text-xs text-foregroundMuted">
        <p>
          © {new Date().getFullYear()} PromptLabz ·{" "}
          <Link to="/terms" className="underline underline-offset-2 hover:text-primary">
            Termos
          </Link>{" "}
          ·{" "}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-primary">
            Privacidade
          </Link>
        </p>
      </footer>
    </div>
  )
}
