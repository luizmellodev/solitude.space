"use client"

import { type Widget, WidgetType } from "@/types/widget-types"
import MusicPlayerWidget from "@/components/widgets/music-player-widget"
import AmbientSoundsWidget from "@/components/widgets/ambient-sounds-widget"
import TodoListWidget from "@/components/widgets/todo-list-widget"
import PomodoroWidget from "@/components/widgets/pomodoro-widget"
import StickyNotesWidget from "@/components/widgets/sticky-notes-widget"
import MiniJournalWidget from "@/components/widgets/mini-journal-widget"

interface WidgetGridProps {
  widgets: Widget[]
  onToggleWidget: (id: string) => void
  onSoundToggle: (id: string, active: boolean) => void
}

export default function WidgetGrid({ widgets, onToggleWidget, onSoundToggle }: WidgetGridProps) {
  // Render the appropriate widget based on type
  const renderWidget = (widget: Widget) => {
    if (!widget.visible) return null

    switch (widget.type) {
      case WidgetType.MusicPlayer:
        return <MusicPlayerWidget key={widget.id} id={widget.id} onToggle={() => onToggleWidget(widget.id)} />
      case WidgetType.AmbientSounds:
        return (
          <AmbientSoundsWidget
            key={widget.id}
            id={widget.id}
            onToggle={() => onToggleWidget(widget.id)}
            onSoundToggle={onSoundToggle}
          />
        )
      case WidgetType.TodoList:
        return <TodoListWidget key={widget.id} id={widget.id} onToggle={() => onToggleWidget(widget.id)} />
      case WidgetType.Pomodoro:
        return <PomodoroWidget key={widget.id} id={widget.id} onToggle={() => onToggleWidget(widget.id)} />
      case WidgetType.StickyNotes:
        return <StickyNotesWidget key={widget.id} id={widget.id} onToggle={() => onToggleWidget(widget.id)} />
      case WidgetType.MiniJournal:
        return <MiniJournalWidget key={widget.id} id={widget.id} onToggle={() => onToggleWidget(widget.id)} />
      default:
        return null
    }
  }

  return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">{widgets.map(renderWidget)}</div>
}
