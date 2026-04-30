"use client"

import { useEffect, useRef, useState } from "react"
import {
  EMPTY_ANSWERS,
  STEPS,
  type AdvisorAnswers,
  type AdvisorStep,
} from "../data/advisor-config"
import { reasonFor, recommend, summarize, type Pick } from "../lib/recommend"

interface SolutionsAdvisorProps {
  variant?: "embedded" | "floating"
  onOpenSolution: (key: string) => void
}

type Message =
  | { role: "bot"; html: string }
  | { role: "user"; text: string }

function botBlock(text: string): Message {
  return { role: "bot", html: text }
}

function userBlock(text: string): Message {
  return { role: "user", text }
}

export default function SolutionsAdvisor({
  variant = "embedded",
  onOpenSolution,
}: SolutionsAdvisorProps) {
  const [open, setOpen] = useState(variant === "embedded")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<AdvisorAnswers>(EMPTY_ANSWERS)
  const [messages, setMessages] = useState<Message[]>(() => [botBlock(STEPS[0].bot)])
  const [chipsLocked, setChipsLocked] = useState<Record<string, boolean>>({})
  const [multiSelections, setMultiSelections] = useState<Record<string, string[]>>({})
  const [textInput, setTextInput] = useState("")
  const [recommendations, setRecommendations] = useState<{
    summary: string
    picks: Pick[]
  } | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bodyRef.current) return
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, recommendations])

  const currentStep: AdvisorStep | undefined = STEPS[step]
  const totalSteps = STEPS.length
  const progress = recommendations ? 100 : Math.round((step / totalSteps) * 100)

  function lockChips(key: string) {
    setChipsLocked((s) => ({ ...s, [key]: true }))
  }

  function appendMessages(msgs: Message[]) {
    setMessages((prev) => [...prev, ...msgs])
  }

  function advance(nextStep: number, ans: AdvisorAnswers) {
    if (nextStep >= totalSteps) {
      setStep(nextStep)
      const picks = recommend(ans)
      const summary = summarize(ans)
      setRecommendations({ summary, picks })
      return
    }
    setStep(nextStep)
    setTimeout(() => {
      appendMessages([botBlock(STEPS[nextStep].bot)])
    }, 250)
  }

  function selectSingleChip(s: AdvisorStep, val: string, label: string) {
    if (chipsLocked[s.key]) return
    const next: AdvisorAnswers = { ...answers, [s.key]: val }
    setAnswers(next)
    lockChips(s.key)
    appendMessages([userBlock(label)])
    advance(step + 1, next)
  }

  function toggleMultiChip(s: AdvisorStep, label: string) {
    if (chipsLocked[s.key]) return
    setMultiSelections((prev) => {
      const cur = prev[s.key] || []
      const next = cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label]
      return { ...prev, [s.key]: next }
    })
  }

  function commitMulti(s: AdvisorStep) {
    if (chipsLocked[s.key]) return
    const selected = multiSelections[s.key] || []
    const typed = textInput.trim()
    const items = [...selected]
    if (typed) items.push(typed)
    const userStr = items.length ? items.join(", ") : "None for now"
    const next: AdvisorAnswers = {
      ...answers,
      [s.key]: items,
    } as AdvisorAnswers
    setAnswers(next)
    lockChips(s.key)
    setTextInput("")
    appendMessages([userBlock(userStr)])
    advance(step + 1, next)
  }

  function commitText(s: AdvisorStep) {
    if (chipsLocked[s.key]) return
    const txt = textInput.trim()
    if (!txt) return
    const next: AdvisorAnswers = { ...answers, [s.key]: txt }
    setAnswers(next)
    lockChips(s.key)
    setTextInput("")
    appendMessages([userBlock(txt)])
    advance(step + 1, next)
  }

  function handleSend() {
    if (!currentStep) return
    if (currentStep.multi) commitMulti(currentStep)
    else commitText(currentStep)
  }

  function handleSkip() {
    if (!currentStep) return
    if (chipsLocked[currentStep.key]) return
    const next: AdvisorAnswers = { ...answers, [currentStep.key]: null }
    setAnswers(next)
    lockChips(currentStep.key)
    setTextInput("")
    appendMessages([userBlock("(skipped)")])
    advance(step + 1, next)
  }

  function reset() {
    setStep(0)
    setAnswers(EMPTY_ANSWERS)
    setMessages([botBlock(STEPS[0].bot)])
    setChipsLocked({})
    setMultiSelections({})
    setTextInput("")
    setRecommendations(null)
  }

  // Floating-mode launcher button
  if (variant === "floating" && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--purple-primary)] text-white px-5 py-3 text-caption font-semibold shadow-card hover:bg-[var(--purple-dark)] lg:hidden"
      >
        <span className="relative inline-block w-2 h-2 rounded-full bg-[#22ee8a]">
          <span className="absolute inset-0 rounded-full bg-[#22ee8a] opacity-60 animate-ping" />
        </span>
        Talk to the advisor
      </button>
    )
  }

  const isFloating = variant === "floating"

  return (
    <div
      className={
        isFloating
          ? "fixed inset-0 z-40 bg-white flex flex-col lg:hidden"
          : "rounded-[var(--radius-card)] bg-white text-[var(--text-dark)] overflow-hidden border border-[var(--color-border)] shadow-card flex flex-col max-h-[640px] min-h-[520px]"
      }
    >
      <div className="px-5 py-4 border-b border-[var(--color-border)] bg-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[var(--purple-primary)] text-white flex items-center justify-center font-bold">
          F
        </div>
        <div className="flex-1">
          <div className="text-body font-semibold text-[var(--text-dark)]">
            Fruition Solutions Advisor
          </div>
          <div className="text-caption text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-[#22c55e]">
              <span className="absolute inset-0 rounded-full bg-[#22c55e] opacity-60 animate-ping" />
            </span>
            Live · Answers in 6 quick taps
          </div>
        </div>
        {isFloating && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-[#f7f4fe] inline-flex items-center justify-center text-[var(--color-text-secondary)]"
            aria-label="Close advisor"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        )}
      </div>

      <div className="h-1 bg-[#f1edfa]">
        <div
          className="h-full bg-[var(--purple-primary)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-white text-[var(--text-dark)]"
      >
        {messages.map((m, i) => (
          <ChatBubble key={i} message={m} />
        ))}

        {currentStep && !recommendations && (
          <ChipRow
            step={currentStep}
            locked={!!chipsLocked[currentStep.key]}
            multi={currentStep.multi || false}
            multiSelected={multiSelections[currentStep.key] || []}
            onSingle={(val, label) => selectSingleChip(currentStep, val, label)}
            onToggleMulti={(label) => toggleMultiChip(currentStep, label)}
          />
        )}

        {recommendations && (
          <RecommendationsBlock
            summary={recommendations.summary}
            picks={recommendations.picks}
            answers={answers}
            onOpenSolution={onOpenSolution}
            onReset={reset}
          />
        )}
      </div>

      {!recommendations && (
        <div className="border-t border-[var(--color-border)] px-4 py-3 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend()
              }}
              placeholder={
                currentStep?.multi
                  ? "Type another integration or press Enter"
                  : currentStep?.allowText
                    ? "Or type your answer here"
                    : "Tap an option above"
              }
              className="flex-1 text-caption px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-[var(--text-dark)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--purple-primary)]"
              disabled={!currentStep || chipsLocked[currentStep.key]}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={
                !currentStep ||
                chipsLocked[currentStep.key] ||
                (!currentStep.multi && !textInput.trim()) ||
                (currentStep.multi &&
                  (multiSelections[currentStep.key] || []).length === 0 &&
                  !textInput.trim())
              }
              className="text-caption font-semibold px-3 py-2 rounded-lg bg-[var(--purple-primary)] text-white disabled:bg-[#e7e0f3] disabled:text-[var(--color-text-secondary)]"
            >
              Send
            </button>
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={handleSkip}
              disabled={!currentStep || chipsLocked[currentStep.key]}
              className="text-caption text-[var(--color-text-secondary)] hover:text-[var(--purple-primary)] disabled:opacity-40"
            >
              Skip this step →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ChatBubble({ message }: { message: Message }) {
  if (message.role === "bot") {
    return (
      <div className="rounded-2xl px-4 py-2.5 text-body-sm bg-[#f7f4fe] text-[var(--text-dark)] max-w-[88%]">
        <span dangerouslySetInnerHTML={{ __html: renderInline(message.html) }} />
      </div>
    )
  }
  return (
    <div className="flex justify-end">
      <div className="rounded-2xl px-4 py-2.5 text-body-sm bg-[var(--purple-primary)] text-white max-w-[88%]">
        {message.text}
      </div>
    </div>
  )
}

function renderInline(s: string): string {
  const escaped = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/&lt;h6&gt;([^<]+)&lt;\/h6&gt;/g, '<div class="text-[10px] uppercase tracking-wider font-semibold opacity-70 mb-1">$1</div>')
    .replace(/&lt;strong&gt;([^<]+)&lt;\/strong&gt;/g, "<strong>$1</strong>")
}

interface ChipRowProps {
  step: AdvisorStep
  locked: boolean
  multi: boolean
  multiSelected: string[]
  onSingle: (val: string, label: string) => void
  onToggleMulti: (label: string) => void
}

function ChipRow({
  step,
  locked,
  multi,
  multiSelected,
  onSingle,
  onToggleMulti,
}: ChipRowProps) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {step.chips.map(([val, label]) => {
        const isSelected = multi && multiSelected.includes(label)
        const baseClasses = locked
          ? "opacity-40 cursor-not-allowed"
          : "hover:border-[var(--purple-primary)] hover:text-[var(--purple-primary)]"
        const colorClasses = isSelected
          ? "bg-[var(--purple-primary)] text-white border-[var(--purple-primary)]"
          : "bg-white text-[var(--purple-dark)] border-[var(--color-border)]"
        return (
          <button
            key={val}
            type="button"
            disabled={locked}
            onClick={() => (multi ? onToggleMulti(label) : onSingle(val, label))}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors ${baseClasses} ${colorClasses}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function RecommendationsBlock({
  summary,
  picks,
  answers,
  onOpenSolution,
  onReset,
}: {
  summary: string
  picks: Pick[]
  answers: AdvisorAnswers
  onOpenSolution: (key: string) => void
  onReset: () => void
}) {
  const baseCard =
    "bg-white text-[var(--text-dark)] border-[var(--color-border)]"

  return (
    <div className="space-y-3 pt-2">
      <div className={`rounded-2xl px-4 py-3 text-body-sm border ${baseCard}`}>
        <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--purple-primary)] mb-1">
          Summary
        </div>
        <span dangerouslySetInnerHTML={{ __html: renderInline(summary) }} />
      </div>

      {picks.length === 0 ? (
        <div className={`rounded-2xl px-4 py-3 text-body-sm border ${baseCard}`}>
          We did not find a clean fit in the catalog. The right next step is a 30-minute discovery
          call with a Fruition solutions engineer.
        </div>
      ) : (
        <>
          <div className={`rounded-2xl px-4 py-3 text-body-sm border ${baseCard}`}>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--purple-primary)] mb-1">
              Recommended solutions
            </div>
            Here are {picks.length} solutions ranked for your situation. Tap any card to open the
            full detail.
          </div>

          {picks.map(({ sol, kind }) => {
            const tagText =
              kind === "primary"
                ? "Primary fit"
                : kind === "adjacent"
                  ? "Adjacent fit"
                  : "Complementary service"
            const tagColor =
              kind === "adjacent"
                ? "text-[#a855f7]"
                : kind === "service"
                  ? "text-[#16a34a]"
                  : "text-[var(--purple-primary)]"
            return (
              <button
                key={sol.key}
                type="button"
                onClick={() => onOpenSolution(sol.key)}
                className={`w-full text-left rounded-2xl px-4 py-3 text-body-sm border transition-all hover:-translate-y-0.5 hover:border-[var(--purple-light)] hover:shadow-whisper ${baseCard}`}
              >
                <div
                  className={`text-[10px] uppercase tracking-wider font-semibold ${tagColor} mb-1`}
                >
                  {tagText}
                </div>
                <div className="font-semibold mb-1">{sol.title}</div>
                <p className="text-[12.5px] text-[var(--color-text-secondary)] leading-relaxed">
                  {reasonFor(sol, kind, answers)} {sol.desc}
                </p>
                <div className="text-[11px] uppercase tracking-wider font-semibold mt-2 text-[var(--purple-primary)]">
                  Open full detail →
                </div>
              </button>
            )
          })}

          {picks.length >= 2 && (() => {
            const primary = picks.find((p) => p.kind === "primary")
            const adj = picks.find((p) => p.kind === "adjacent")
            const svc = picks.filter((p) => p.kind === "service").map((p) => p.sol.title)
            if (!primary) return null
            const parts = [`Start with **${primary.sol.title}** as Phase 1.`]
            if (adj) parts.push(`Layer **${adj.sol.title}** as Phase 2.`)
            if (svc.length) parts.push(`Run ${svc.map((s) => `**${s}**`).join(" and ")} in parallel.`)
            return (
              <div className={`rounded-2xl px-4 py-3 text-body-sm border ${baseCard}`}>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--purple-primary)] mb-1">
                  Bundle recommendation
                </div>
                <span dangerouslySetInnerHTML={{ __html: renderInline(parts.join(" ")) }} />
              </div>
            )
          })()}

          <div className={`rounded-2xl px-4 py-3 text-body-sm border ${baseCard}`}>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--purple-primary)] mb-1">
              Next step
            </div>
            Book a 30-minute discovery call and we will walk through a live demo of your primary
            recommendation. Email us at{" "}
            <strong>hello@fruitionservices.io</strong> or reach out to your Fruition contact.
          </div>
        </>
      )}

      <button
        type="button"
        onClick={onReset}
        className="self-start text-caption text-[var(--purple-primary)] hover:text-[var(--purple-dark)] border border-[var(--color-border)] rounded-full px-4 py-1.5 mt-1"
      >
        Start over
      </button>
    </div>
  )
}
