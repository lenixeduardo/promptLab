import { BookOpen, Lightbulb, Quote } from "lucide-react"
import type { ContentSlide, ContentSlideBlock } from "@/lib/lessonContent"

interface Props {
  slide: ContentSlide
}

function MindMap({
  title,
  branches,
}: {
  title: string
  branches: { label: string; children: string[] }[]
}) {
  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/40">
      <p className="mb-3 text-center text-sm font-extrabold text-blue-800 dark:text-blue-300">
        {title}
      </p>
      <div className="grid gap-2">
        {branches.map((branch, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-extrabold text-white">
              {i + 1}
            </div>
            <div>
              <span className="text-xs font-extrabold text-blue-800 dark:text-blue-300">
                {branch.label}
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {branch.children.map((child, j) => (
                  <span
                    key={j}
                    className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {child}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700">
      <div className="flex items-center justify-between bg-slate-800 px-3 py-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {language}
        </span>
      </div>
      <pre className="overflow-x-auto bg-slate-900 p-4 text-xs leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ExampleBlock({ label, before, after }: { label: string; before: string; after: string }) {
  return (
    <div className="space-y-2">
      {label && (
        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-tertiary">
          {label}
        </p>
      )}
      <div className="rounded-xl border-2 border-red-200 bg-red-50 px-3 py-2 dark:border-red-800 dark:bg-red-950/40">
        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-red-400">
          Antes
        </p>
        <p className="text-xs text-red-800 dark:text-red-300">{before}</p>
      </div>
      <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-800 dark:bg-emerald-950/40">
        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
          Depois
        </p>
        <p className="whitespace-pre-wrap text-xs text-emerald-800 dark:text-emerald-300">
          {after}
        </p>
      </div>
    </div>
  )
}

function Block({ block }: { block: ContentSlideBlock }) {
  switch (block.type) {
    case "heading":
      return <h3 className="text-lg font-extrabold text-foreground-dark">{block.text}</h3>

    case "text":
      return <p className="text-sm leading-relaxed text-foreground-secondary">{block.text}</p>

    case "quote":
      return (
        <div className="relative rounded-2xl border-l-4 border-luxury bg-luxury/10 px-4 py-3">
          <Quote className="absolute right-3 top-3 h-4 w-4 text-luxury/40" />
          <p className="text-sm italic text-foreground-dark">{block.text}</p>
        </div>
      )

    case "code":
      return <CodeBlock language={block.language} code={block.code} />

    case "mind-map":
      return <MindMap title={block.title} branches={block.branches} />

    case "tip":
      return (
        <div className="flex items-start gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 px-3 py-3 dark:border-amber-700 dark:bg-amber-950/40">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-xs text-amber-900 dark:text-amber-200">{block.text}</p>
        </div>
      )

    case "example":
      return <ExampleBlock label={block.label} before={block.before} after={block.after} />

    default:
      return null
  }
}

export function SlideCard({ slide }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:bg-blue-900 dark:text-blue-200">
          <BookOpen className="h-3 w-3" /> Conteúdo
        </span>
      </div>

      <div className="space-y-4">
        {slide.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </div>
  )
}
