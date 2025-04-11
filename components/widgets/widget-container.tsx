"use client"

import type React from "react"

import { useState } from "react"
import { X, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useAppTheme } from "@/components/theme-context"

interface WidgetContainerProps {
  id: string
  title: string
  onToggle: () => void
  children: React.ReactNode
  className?: string
}

export default function WidgetContainer({ id, title, onToggle, children, className }: WidgetContainerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { theme } = useAppTheme()

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Renderizar widget específico para cada tema
  const renderThemeWidget = () => {
    switch (theme) {
      case "neon":
        return (
          <Card
            className={cn(
              "neon-widget border-cyan-500/30 shadow-lg transition-all duration-300 widget-container animate-fade-in-up overflow-hidden",
              className,
            )}
          >
            <div className="neon-border" />
            <CardHeader className="p-2 flex flex-row items-center justify-between space-y-0 pb-0.5 neon-widget-header">
              <div className="flex items-center">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-cyan-300">{title}</CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-cyan-400 hover:text-cyan-300 hover:bg-black/30 transition-colors duration-200"
                  onClick={toggleCollapse}
                >
                  {isCollapsed ? <Plus className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-cyan-400 hover:text-cyan-300 hover:bg-black/30 transition-colors duration-200"
                  onClick={onToggle}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            </CardHeader>
            {!isCollapsed && (
              <CardContent className="p-2 pt-1 transition-all duration-300 animate-fade-in neon-widget-content">
                {children}
              </CardContent>
            )}
          </Card>
        )

      case "pixel":
        return (
          <Card
            className={cn(
              "pixel-widget bg-indigo-950/70 border-2 border-indigo-700/70 transition-all duration-300 widget-container animate-fade-in-up overflow-hidden",
              className,
            )}
          >
            <CardHeader className="p-2 flex flex-row items-center justify-between space-y-0 pb-0.5 bg-indigo-900/80 border-b-2 border-indigo-700/70">
              <div className="flex items-center">
                <CardTitle className="text-xs font-mono uppercase text-white">{title}</CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-white hover:bg-indigo-700/70 transition-colors duration-200"
                  onClick={toggleCollapse}
                >
                  {isCollapsed ? <Plus className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-white hover:bg-indigo-700/70 transition-colors duration-200"
                  onClick={onToggle}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            </CardHeader>
            {!isCollapsed && (
              <CardContent className="p-2 pt-1 transition-all duration-300 animate-fade-in">{children}</CardContent>
            )}
          </Card>
        )

      case "cozy":
        return (
          <Card
            className={cn(
              "cozy-widget bg-amber-950/40 backdrop-blur-sm border-amber-800/30 transition-all duration-300 widget-container animate-fade-in-up rounded-lg overflow-hidden",
              className,
            )}
          >
            <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 pb-1 bg-amber-900/30 rounded-t-lg border-b border-amber-800/30">
              <div className="flex items-center">
                <CardTitle className="text-sm font-serif text-amber-100">{title}</CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-amber-200 hover:bg-amber-800/40 hover:text-amber-100 rounded-full transition-colors duration-200"
                  onClick={toggleCollapse}
                >
                  {isCollapsed ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-amber-200 hover:bg-amber-800/40 hover:text-amber-100 rounded-full transition-colors duration-200"
                  onClick={onToggle}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            {!isCollapsed && (
              <CardContent className="p-3 pt-2 transition-all duration-300 animate-fade-in">{children}</CardContent>
            )}
          </Card>
        )

      case "minimal":
        return (
          <Card
            className={cn(
              "minimal-widget bg-zinc-900/90 border-none transition-all duration-300 widget-container animate-fade-in-up overflow-hidden",
              className,
            )}
          >
            <CardHeader className="p-2 flex flex-row items-center justify-between space-y-0 pb-0.5 border-b border-zinc-800">
              <div className="flex items-center">
                <CardTitle className="text-xs font-light tracking-wider text-zinc-300 uppercase">{title}</CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors duration-200"
                  onClick={toggleCollapse}
                >
                  {isCollapsed ? <Plus className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors duration-200"
                  onClick={onToggle}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            </CardHeader>
            {!isCollapsed && (
              <CardContent className="p-2 pt-1 transition-all duration-300 animate-fade-in">{children}</CardContent>
            )}
          </Card>
        )

      case "scifi":
        return (
          <Card
            className={cn(
              "scifi-widget bg-blue-950/70 backdrop-blur-xl border border-blue-500/30 transition-all duration-300 widget-container animate-fade-in-up overflow-hidden",
              className,
            )}
          >
            <div className="scifi-widget-decoration" />
            <CardHeader className="p-2 flex flex-row items-center justify-between space-y-0 pb-0.5 bg-blue-900/40 border-b border-blue-500/30">
              <div className="flex items-center">
                <div className="scifi-indicator mr-2" />
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-blue-200">{title}</CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-blue-300 hover:bg-blue-800/40 hover:text-blue-100 transition-colors duration-200"
                  onClick={toggleCollapse}
                >
                  {isCollapsed ? <Plus className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-blue-300 hover:bg-blue-800/40 hover:text-blue-100 transition-colors duration-200"
                  onClick={onToggle}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            </CardHeader>
            {!isCollapsed && (
              <CardContent className="p-2 pt-1 transition-all duration-300 animate-fade-in">{children}</CardContent>
            )}
          </Card>
        )

      case "cute":
        return (
          <Card
            className={cn(
              "cute-widget bg-pink-100/90 backdrop-blur-sm border-2 border-pink-300 rounded-xl transition-all duration-300 widget-container animate-fade-in-up overflow-hidden",
              className,
            )}
          >
            <CardHeader className="p-2 flex flex-row items-center justify-between space-y-0 pb-0.5 bg-pink-200/70 border-b-2 border-pink-300 rounded-t-xl">
              <div className="flex items-center">
                <span className="cute-emoji mr-1">✨</span>
                <CardTitle className="text-xs font-medium text-pink-800">{title}</CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-pink-700 hover:bg-pink-200 hover:text-pink-900 rounded-full transition-colors duration-200"
                  onClick={toggleCollapse}
                >
                  {isCollapsed ? <Plus className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-pink-700 hover:bg-pink-200 hover:text-pink-900 rounded-full transition-colors duration-200"
                  onClick={onToggle}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            </CardHeader>
            {!isCollapsed && (
              <CardContent className="p-2 pt-1 transition-all duration-300 animate-fade-in">{children}</CardContent>
            )}
          </Card>
        )

      default:
        return (
          <Card
            className={cn(
              "theme-widget border-white/10 shadow-lg transition-all duration-300 widget-container animate-fade-in-up overflow-hidden",
              className,
            )}
          >
            <CardHeader className="p-2 flex flex-row items-center justify-between space-y-0 pb-0.5 theme-widget-header">
              <div className="flex items-center">
                <CardTitle className="text-xs font-medium theme-widget-title">{title}</CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-zinc-400 hover:text-white hover:bg-black/30 transition-colors duration-200 theme-widget-button"
                  onClick={toggleCollapse}
                >
                  {isCollapsed ? <Plus className="h-2.5 w-2.5" /> : <Minus className="h-2.5 w-2.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-zinc-400 hover:text-white hover:bg-black/30 transition-colors duration-200 theme-widget-button"
                  onClick={onToggle}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            </CardHeader>
            {!isCollapsed && (
              <CardContent className="p-2 pt-1 transition-all duration-300 animate-fade-in theme-widget-content">
                {children}
              </CardContent>
            )}
          </Card>
        )
    }
  }

  return renderThemeWidget()
}
