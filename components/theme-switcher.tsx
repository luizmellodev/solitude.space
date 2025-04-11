"use client"

import { useState } from "react"
import { Paintbrush, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppTheme, type ThemeType } from "@/components/theme-context"
import { cn } from "@/lib/utils"

const themes = [
  { id: "default", name: "Default", icon: "🌙" },
  { id: "cozy", name: "Cozy", icon: "🏡" },
  { id: "neon", name: "Neon", icon: "💫" },
  { id: "pixel", name: "Pixel", icon: "👾" },
  { id: "minimal", name: "Minimal", icon: "◽" },
  { id: "scifi", name: "Sci-Fi", icon: "🚀" },
  { id: "cute", name: "Cute", icon: "🌸" },
]

export default function ThemeSwitcher() {
  const { theme, setTheme } = useAppTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full theme-button">
          <Paintbrush className="h-4 w-4" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="theme-dropdown">
        {themes.map((item) => (
          <DropdownMenuItem
            key={item.id}
            className={cn(
              "flex items-center gap-2 cursor-pointer theme-item",
              theme === item.id && "theme-item-active",
            )}
            onClick={() => {
              setTheme(item.id as ThemeType)
              setIsOpen(false)
            }}
          >
            <span className="theme-icon">{item.icon}</span>
            <span>{item.name}</span>
            {theme === item.id && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
