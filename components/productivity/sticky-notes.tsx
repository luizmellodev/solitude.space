"use client"

import { useState, useEffect } from "react"
import { Plus, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Note {
  id: string
  content: string
  color: string
}

const COLORS = [
  "bg-yellow-500/20 border-yellow-500/30",
  "bg-pink-500/20 border-pink-500/30",
  "bg-blue-500/20 border-blue-500/30",
  "bg-green-500/20 border-green-500/30",
  "bg-purple-500/20 border-purple-500/30",
]

export default function StickyNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("lofi-notes")
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
    localStorage.setItem("lofi-notes", JSON.stringify(notes))
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
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-white">Notas Rápidas</h3>
        <Button
          onClick={addNote}
          variant="outline"
          size="sm"
          className="bg-purple-500/20 hover:bg-purple-500/30 text-white border-white/10"
        >
          <Plus className="h-4 w-4 mr-1" /> Nova Nota
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
        {notes.length === 0 ? (
          <div className="text-sm text-zinc-400 text-center py-8 bg-black/20 rounded-xl border border-white/5 col-span-2">
            <p>Nenhuma nota adicionada</p>
            <p className="mt-1 text-xs">Clique em "Nova Nota" para criar uma</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "p-4 rounded-xl border shadow-md transition-all duration-200",
                note.color,
                "backdrop-blur-md",
              )}
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Escreva sua nota aqui..."
                    className="bg-black/10 border-0 text-white resize-none min-h-[120px] focus-visible:ring-white/20"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-xs bg-black/20 hover:bg-black/40 text-white"
                    >
                      <X className="h-3 w-3 mr-1" /> Cancelar
                    </Button>
                    <Button
                      onClick={saveNote}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-white"
                    >
                      <Save className="h-3 w-3 mr-1" /> Salvar
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="min-h-[120px] cursor-pointer whitespace-pre-wrap text-sm"
                  onClick={() => startEditing(note)}
                >
                  {note.content || <span className="text-zinc-500 italic">Clique para editar</span>}
                </div>
              )}
              {editingId !== note.id && (
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={() => deleteNote(note.id)}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
