"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Save, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import WidgetContainer from "@/components/widgets/widget-container"
// Importar o hook useAppTheme
import { useAppTheme } from "@/components/theme-context"

interface JournalEntry {
  id: string
  date: string
  content: string
}

interface MiniJournalWidgetProps {
  id: string
  onToggle: () => void
}

export default function MiniJournalWidget({ id, onToggle }: MiniJournalWidgetProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")
  // Adicionar o hook após a linha que contém "const [editContent, setEditContent] = useState("")"
  const { theme } = useAppTheme()

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("chilled-dev-journal")
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries)
        setEntries(parsed)

        // Find today's entry or set up a new one
        const today = format(new Date(), "yyyy-MM-dd")
        const todayEntry = parsed.find((entry: JournalEntry) => entry.date === today)

        if (todayEntry) {
          setCurrentEntry(todayEntry)
        } else {
          const newEntry = {
            id: Date.now().toString(),
            date: today,
            content: "",
          }
          setCurrentEntry(newEntry)
        }
      } catch (e) {
        console.error("Failed to parse journal entries from localStorage")
      }
    } else {
      // Initialize with today's empty entry
      const today = format(new Date(), "yyyy-MM-dd")
      const newEntry = {
        id: Date.now().toString(),
        date: today,
        content: "",
      }
      setCurrentEntry(newEntry)
    }
  }, [])

  // Save entries to localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem("chilled-dev-journal", JSON.stringify(entries))
    }
  }, [entries])

  const startEditing = () => {
    if (!currentEntry) return
    setIsEditing(true)
    setEditContent(currentEntry.content)
  }

  const saveEntry = () => {
    if (!currentEntry) return

    const updatedEntry = {
      ...currentEntry,
      content: editContent,
    }

    // Check if this entry already exists
    const entryIndex = entries.findIndex((entry) => entry.id === currentEntry.id)

    if (entryIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...entries]
      updatedEntries[entryIndex] = updatedEntry
      setEntries(updatedEntries)
    } else {
      // Add new entry
      setEntries([...entries, updatedEntry])
    }

    setCurrentEntry(updatedEntry)
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setIsEditing(false)
  }

  // Explicação sobre a navegação:
  // O Mini Journal permite navegar entre dias anteriores e futuros
  // usando as setas de navegação. Você pode editar entradas de qualquer dia,
  // não apenas do dia atual.

  const navigateEntry = (direction: "prev" | "next") => {
    if (!currentEntry) return

    // Find current index
    const currentIndex = entries.findIndex((entry) => entry.id === currentEntry.id)

    if (currentIndex === -1) {
      // Current entry not in list (new unsaved entry)
      if (direction === "prev" && entries.length > 0) {
        setCurrentEntry(entries[entries.length - 1])
      }
      return
    }

    if (direction === "prev" && currentIndex > 0) {
      setCurrentEntry(entries[currentIndex - 1])
    } else if (direction === "next" && currentIndex < entries.length - 1) {
      setCurrentEntry(entries[currentIndex + 1])
    } else if (direction === "next" && currentIndex === entries.length - 1) {
      // Create a new entry for tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = format(tomorrow, "yyyy-MM-dd")

      const newEntry = {
        id: Date.now().toString(),
        date: tomorrowStr,
        content: "",
      }
      setCurrentEntry(newEntry)
    }
  }

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return format(date, "MMM d, yyyy")
  }

  const isToday = (dateStr: string) => {
    const today = format(new Date(), "yyyy-MM-dd")
    return dateStr === today
  }

  return (
    <WidgetContainer id={id} title="Mini Journal" onToggle={onToggle}>
      <div className="space-y-2">
        {currentEntry && (
          <>
            <div className="flex items-center justify-between bg-black/30 p-1.5 rounded-md border border-white/5">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full text-zinc-400 hover:text-white hover:bg-black/30 transition-colors duration-200"
                onClick={() => navigateEntry("prev")}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>

              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3 text-zinc-400" />
                <span className="text-[10px] font-medium">
                  {formatDisplayDate(currentEntry.date)}
                  {isToday(currentEntry.date) && " (Today)"}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full text-zinc-400 hover:text-white hover:bg-black/30 transition-colors duration-200"
                onClick={() => navigateEntry("next")}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-1.5 animate-fade-in">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Write about your day..."
                  className="bg-black/20 border-white/10 text-white resize-none min-h-[80px] text-[10px] focus-visible:ring-purple-500/50 transition-all duration-200"
                />
                <div className="flex justify-end space-x-1">
                  <Button
                    onClick={cancelEditing}
                    variant="ghost"
                    size="sm"
                    className="h-5 px-1.5 text-[8px] bg-black/20 hover:bg-black/40 text-white transition-colors duration-200"
                  >
                    <X className="h-2 w-2 mr-1" /> Cancel
                  </Button>
                  <Button
                    onClick={saveEntry}
                    variant="ghost"
                    size="sm"
                    className="h-5 px-1.5 text-[8px] bg-purple-500/20 hover:bg-purple-500/30 text-white transition-colors duration-200"
                  >
                    <Save className="h-2 w-2 mr-1" /> Save
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="bg-black/20 border border-white/10 rounded-md p-2 min-h-[80px] cursor-pointer transition-all duration-200 hover:border-white/20"
                onClick={startEditing}
              >
                {currentEntry.content ? (
                  <p className="whitespace-pre-wrap text-[10px]">{currentEntry.content}</p>
                ) : (
                  // Modificar o texto "Click to write in your journal..." para usar a cor condicional
                  <p className={`italic text-[10px] ${theme === "cute" ? "text-pink-800" : "text-zinc-500"}`}>
                    Click to write in your journal...
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </WidgetContainer>
  )
}
