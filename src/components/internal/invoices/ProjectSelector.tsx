'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ClockifyProject {
  id: string
  name: string
  clientName?: string
}

interface SelectedProject {
  id: string
  name: string
  companyName?: string
}

interface Props {
  region?: string
  onSelect: (project: SelectedProject) => void
  selectedProjects: SelectedProject[]
}

const CLOCKIFY_API_KEY = process.env.NEXT_PUBLIC_CLOCKIFY_API_KEY || ''
const CLOCKIFY_WORKSPACE_ID = process.env.NEXT_PUBLIC_CLOCKIFY_WORKSPACE_ID || ''
const CLOCKIFY_BASE_URL = 'https://api.clockify.me/api/v1'

async function fetchAllProjects(): Promise<ClockifyProject[]> {
  if (!CLOCKIFY_API_KEY || !CLOCKIFY_WORKSPACE_ID) return []

  const projects: ClockifyProject[] = []
  let page = 1
  const pageSize = 50

  while (true) {
    const res = await fetch(
      `${CLOCKIFY_BASE_URL}/workspaces/${CLOCKIFY_WORKSPACE_ID}/projects?page-size=${pageSize}&page=${page}`,
      { headers: { 'X-Api-Key': CLOCKIFY_API_KEY } }
    )
    if (!res.ok) break
    const data = await res.json()
    if (!data.length) break
    projects.push(...data)
    if (data.length < pageSize) break
    page++
  }

  return projects
}

export default function ProjectSelector({ onSelect, selectedProjects }: Props) {
  const [allProjects, setAllProjects] = useState<ClockifyProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchAllProjects()
      .then((projects) => {
        setAllProjects(projects)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch Clockify projects:', err)
        setError('Failed to load projects from Clockify')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = allProjects.filter((p) => {
    if (!searchQuery.trim()) return false
    const q = searchQuery.toLowerCase()
    return (
      p.name?.toLowerCase().includes(q) ||
      p.clientName?.toLowerCase().includes(q)
    )
  })

  const handleSelect = (project: ClockifyProject) => {
    if (!selectedProjects.find((p) => p.id === project.id)) {
      onSelect({
        id: project.id,
        name: project.name,
        companyName: project.clientName || '',
      })
    }
    setSearchQuery('')
    setOpen(false)
  }

  const placeholder = loading
    ? 'Loading Clockify projects...'
    : error
      ? 'Failed to load projects'
      : 'Type to search projects...'

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 z-[2] -translate-y-1/2 text-muted-foreground">
          {loading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Search className="size-[18px]" />
          )}
        </div>
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => searchQuery && setOpen(true)}
          className="pl-10"
          disabled={loading || !!error}
        />
      </div>

      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}

      {!loading && !error && allProjects.length > 0 && (
        <p className="mt-1 text-xs text-muted-foreground">
          {allProjects.length} projects loaded from Clockify
        </p>
      )}

      {open && searchQuery && !loading && (
        <div className="absolute left-0 right-0 top-full z-[1000] mt-2 max-h-[300px] overflow-y-auto rounded-lg border bg-background shadow-xl">
          {filtered.length === 0 ? (
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                No projects match &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {filtered.map((project) => {
                const alreadySelected = selectedProjects.find(
                  (p) => p.id === project.id
                )
                return (
                  <button
                    key={project.id}
                    className={`border-b px-3 py-2 text-left transition-colors ${
                      alreadySelected
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer hover:bg-muted'
                    }`}
                    onClick={() => !alreadySelected && handleSelect(project)}
                    disabled={!!alreadySelected}
                  >
                    <p className="text-sm font-medium">{project.name}</p>
                    {project.clientName && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {project.clientName}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
