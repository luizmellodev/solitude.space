"use client"
import { Plus, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { type Widget, WidgetType } from "@/types/widget-types"

interface WidgetControlsProps {
  widgets: Widget[]
  onToggleWidget: (id: string) => void
  onShowMotivational: () => void
  showMotivational: boolean
}

export default function WidgetControls({
  widgets,
  onToggleWidget,
  onShowMotivational,
  showMotivational,
}: WidgetControlsProps) {
  // Obter widgets que estão ocultos
  const hiddenWidgets = widgets.filter((widget) => !widget.visible)

  // Mapeamento de tipos de widget para nomes legíveis
  const widgetNames: Record<WidgetType, string> = {
    [WidgetType.MusicPlayer]: "YouTube Player",
    [WidgetType.AmbientSounds]: "Ambient Sounds",
    [WidgetType.TodoList]: "To-Do List",
    [WidgetType.Pomodoro]: "Pomodoro Timer",
    [WidgetType.StickyNotes]: "Sticky Notes",
    [WidgetType.MiniJournal]: "Mini Journal",
  }

  return (
    <div className="flex justify-center mb-4 space-x-2 animate-fade-in">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-black/30 backdrop-blur-md border-white/10 text-white hover:bg-black/40 transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Widget
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/70 backdrop-blur-xl border-white/10 text-white animate-fade-in-down">
          {hiddenWidgets.map((widget) => (
            <DropdownMenuItem
              key={widget.id}
              className="cursor-pointer hover:bg-white/10 transition-colors duration-200"
              onClick={() => onToggleWidget(widget.id)}
            >
              {widgetNames[widget.type]}
            </DropdownMenuItem>
          ))}
          {!showMotivational && (
            <DropdownMenuItem
              className="cursor-pointer hover:bg-white/10 transition-colors duration-200"
              onClick={onShowMotivational}
            >
              Motivational Quote
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {!showMotivational && (
        <Button
          variant="outline"
          size="sm"
          className="bg-black/30 backdrop-blur-md border-white/10 text-white hover:bg-black/40 transition-all duration-300 hover:scale-105"
          onClick={onShowMotivational}
        >
          <Quote className="h-3.5 w-3.5 mr-1" /> Show Quote
        </Button>
      )}
    </div>
  )
}
