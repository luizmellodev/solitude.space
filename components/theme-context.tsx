"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type ThemeType = "default" | "cozy" | "neon" | "pixel" | "minimal" | "scifi" | "cute"

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("default")

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("chilled-dev-theme") as ThemeType
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("chilled-dev-theme", theme)

    // Apply theme class to body
    document.body.className = ""
    document.body.classList.add(`theme-${theme}`)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useAppTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider")
  }
  return context
}
