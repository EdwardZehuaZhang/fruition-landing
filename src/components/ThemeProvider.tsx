"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ComponentProps } from "react"

/**
 * Client wrapper around next-themes. Applies the `.dark` class to <html>,
 * which is what globals.css keys its dark tokens off of
 * (`@custom-variant dark (&:is(.dark *))` + the `.dark { … }` token block).
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
