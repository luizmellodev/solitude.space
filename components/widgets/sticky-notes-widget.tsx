"use client"

import { useState, useEffect } from "react"
import { Plus, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import WidgetContainer from "@/components/widgets/widget-container"

interface Note {
  id: string
  content: string
  color: string
}

interface StickyNotesWidgetProps {
  id: string
  onToggle: () => void
}

const COLORS = [
  "bg-yellow-500/20 border-yellow-500/30",
  "bg-pink-500/20 border-pink-500/30",
  "bg-blue-500/20 border-blue-500/30",
  "bg-green-500/20 border-green-500/30",
  "bg-purple-500/20 border-purple-500/30",
]

export default function StickyNotesWidget({ id, onToggle }: StickyNotesWidgetProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [hoveredNote, setHoveredNote] = useState<string | null>(null)

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("chilled-dev-notes")
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes))
      } catch (e) {
        console.error("Failed to parse notes from localStorage")
      }
    }
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("chilled-dev-notes", JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    const newNote = {
      id: Date.now().toString(),
      content: "",
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }
    setNotes([...notes, newNote])
    setEditingId(newNote.id)
    setEditContent("")
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
    if (editingId === id) {
      setEditingId(null)
    }
  }

  const startEditing = (note: Note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const saveNote = () => {
    if (!editingId) return

    setNotes(notes.map((note) => (note.id === editingId ? { ...note, content: editContent } : note)))
    setEditingId(null)
  }

  return (
    <WidgetContainer id={id} title="Sticky Notes" onToggle={onToggle}>
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={addNote}
            variant="outline"
            size="sm"
            className="bg-purple-500/20 hover:bg-purple-500/30 text-white border-white/10 h-6 text-[10px] px-2 transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-3 w-3 mr-1" /> New Note
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto pr-1">
          {notes.length === 0 ? (
            <div className="text-[10px] text-zinc-400 text-center py-3 bg-black/20 rounded-md border border-white/5 col-span-2">
              <p>No notes yet</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "p-2 rounded-md border shadow-md transition-all duration-300 hover:shadow-lg",
                  note.color,
                  "backdrop-blur-md",
                )}
                onMouseEnter={() => setHoveredNote(note.id)}
                onMouseLeave={() => setHoveredNote(null)}
              >
                {editingId === note.id ? (
                  <div className="space-y-1.5 animate-fade-in">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Write your note here..."
                      className="bg-black/10 border-0 text-white resize-none min-h-[60px] text-[10px] focus-visible:ring-white/20 transition-all duration-200"
                    />
                    <div className="flex justify-end space-x-1">
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="ghost"
                        size="sm"
                        className="h-5 px-1.5 text-[8px] bg-black/20 hover:bg-black/40 text-white transition-colors duration-200"
                      >
                        <X className="h-2 w-2 mr-1" /> Cancel
                      </Button>
                      <Button
                        onClick={saveNote}
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
                    className="min-h-[60px] cursor-pointer whitespace-pre-wrap text-[10px]"
                    onClick={() => startEditing(note)}
                  >
                    {note.content || <span className="text-zinc-500 italic text-[10px]">Click to edit</span>}
                  </div>
                )}
                {editingId !== note.id && (
                  <div className="flex justify-end mt-1">
                    <Button
                      onClick={() => deleteNote(note.id)}
                      variant="ghost"
                      size="sm"
                      className={`h-5 w-5 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-opacity duration-200 ${
                        hoveredNote === note.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </WidgetContainer>
  )
}
