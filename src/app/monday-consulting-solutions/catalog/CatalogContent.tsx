"use client"

import { useCallback, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import CatalogCta from "./components/CatalogCta"
import CatalogHero from "./components/CatalogHero"
import DeliveryMethod from "./components/DeliveryMethod"
import IndustryMap from "./components/IndustryMap"
import ProjectBuildsIndex from "./components/ProjectBuildsIndex"
// Client-only: SolutionModal lazy-loads mermaid (~4.6 MB) for its workflow
// diagram. ssr:false keeps mermaid out of the Cloudflare edge Worker bundle.
const SolutionModal = dynamic(() => import("./components/SolutionModal"), { ssr: false })
import SolutionsAdvisor from "./components/SolutionsAdvisor"
import SolutionsGrid from "./components/SolutionsGrid"
import { SOLUTIONS } from "./data/solutions"

interface CatalogContentProps {
  calendlyUrl: string
}

export default function CatalogContent({ calendlyUrl }: CatalogContentProps) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  const handleOpen = useCallback((key: string) => setOpenKey(key), [])
  const handleClose = useCallback(() => setOpenKey(null), [])

  const activeSolution = useMemo(
    () => SOLUTIONS.find((s) => s.key === openKey) || null,
    [openKey]
  )

  return (
    <div>
      <CatalogHero advisorSlot={<SolutionsAdvisor onOpenSolution={handleOpen} />} />
      <SolutionsGrid onOpen={handleOpen} />
      <IndustryMap />
      <ProjectBuildsIndex />
      <DeliveryMethod />
      <CatalogCta calendlyUrl={calendlyUrl} />

      {/* Mobile/tablet floating advisor — hidden on lg+ where it lives in the hero */}
      <div className="lg:hidden">
        <SolutionsAdvisor variant="floating" onOpenSolution={handleOpen} />
      </div>

      <SolutionModal solution={activeSolution} onClose={handleClose} />
    </div>
  )
}
