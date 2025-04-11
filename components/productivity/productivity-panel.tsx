"use client"

import { useState, useEffect } from "react"
import { X, CheckSquare, Clock, StickyNote, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TodoList from "./todo-list"
import PomodoroTimer from "./pomodoro-timer"
import StickyNotes from "./sticky-notes"
import { cn } from "@/lib/utils"

interface ProductivityPanelProps {
  visible: boolean
  onClose: () => void
}

export default function ProductivityPanel({ visible, onClose }: ProductivityPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [isFullscreen])

  if (!visible) return null

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Pomodoro Focus</h2>
            <Button onClick={handleFullscreen} variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Card className="bg-black/70 backdrop-blur-xl border-white/10 shadow-lg">
            <CardContent className="p-6">
              <PomodoroTimer onFullscreen={handleFullscreen} isFullscreen={isFullscreen} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed left-1/2 transform -translate-x-1/2 bottom-4 z-40 w-full max-w-2xl transition-all duration-300 ease-in-out",
        isCollapsed ? "h-12" : "max-h-[80vh]",
      )}
    >
      <div className="flex items-center justify-between bg-black/60 backdrop-blur-xl text-white p-3 rounded-t-xl border-t border-l border-r border-white/10 shadow-lg">
        <div className="flex items-center">
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            size="icon"
            className="h-6 w-6 mr-2 hover:bg-white/10"
          >
            {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <h2 className="text-sm font-medium">Ferramentas de Produtividade</h2>
        </div>
        <Button onClick={onClose} variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/10">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!isCollapsed && (
        <Card className="rounded-t-none bg-black/60 backdrop-blur-xl border-white/10 shadow-lg">
          <CardContent className="p-6">
            <Tabs defaultValue="todo">
              <TabsList className="grid grid-cols-3 bg-black/50 mb-6">
                <TabsTrigger
                  value="todo"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white py-3"
                >
                  <CheckSquare className="h-4 w-4 mr-2" /> Tarefas
                </TabsTrigger>
                <TabsTrigger
                  value="pomodoro"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white py-3"
                >
                  <Clock className="h-4 w-4 mr-2" /> Pomodoro
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white py-3"
                >
                  <StickyNote className="h-4 w-4 mr-2" /> Notas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="todo" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <TodoList />
              </TabsContent>

              <TabsContent value="pomodoro" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <PomodoroTimer onFullscreen={handleFullscreen} isFullscreen={isFullscreen} />
              </TabsContent>

              <TabsContent value="notes" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <StickyNotes />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
