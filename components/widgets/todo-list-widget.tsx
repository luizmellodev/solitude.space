"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import WidgetContainer from "@/components/widgets/widget-container"

interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoListWidgetProps {
  id: string
  onToggle: () => void
}

export default function TodoListWidget({ id, onToggle }: TodoListWidgetProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [hoveredTodo, setHoveredTodo] = useState<string | null>(null)

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("chilled-dev-todos")
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (e) {
        console.error("Failed to parse todos from localStorage")
      }
    }
  }, [])

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("chilled-dev-todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() === "") return

    setTodos([
      ...todos,
      {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
      },
    ])
    setNewTodo("")
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  return (
    <WidgetContainer id={id} title="To-Do List" onToggle={onToggle}>
      <div className="space-y-1.5">
        <div className="flex">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="bg-black/30 border-white/10 text-white rounded-l-md rounded-r-none focus-visible:ring-purple-500/50 h-6 text-[10px] transition-all duration-200"
          />
          <Button
            onClick={addTodo}
            variant="ghost"
            size="icon"
            className="rounded-l-none rounded-r-md bg-purple-500/20 hover:bg-purple-500/30 text-white border border-white/10 border-l-0 h-6 w-6 transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
          {todos.length === 0 ? (
            <div className="text-[10px] text-zinc-400 text-center py-2 bg-black/20 rounded-md border border-white/5">
              <p>No tasks yet</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-1.5 rounded-md bg-black/30 border border-white/10 transition-all duration-200 hover:border-white/20 ${
                  todo.completed ? "bg-opacity-20" : ""
                }`}
                onMouseEnter={() => setHoveredTodo(todo.id)}
                onMouseLeave={() => setHoveredTodo(null)}
              >
                <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                  <div
                    className={cn(
                      "flex items-center justify-center w-3.5 h-3.5 rounded-full border mr-1.5 transition-all duration-300",
                      todo.completed
                        ? "bg-green-500/20 border-green-500 shadow-sm shadow-green-500/30"
                        : "border-zinc-600 hover:border-white/50",
                    )}
                  >
                    {todo.completed && <Check className="h-2 w-2 text-green-500" />}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] transition-all duration-300",
                      todo.completed && "line-through text-zinc-500",
                    )}
                  >
                    {todo.text}
                  </span>
                </div>
                <Button
                  onClick={() => deleteTodo(todo.id)}
                  variant="ghost"
                  size="icon"
                  className={`h-4 w-4 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-opacity duration-200 ${
                    hoveredTodo === todo.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Trash2 className="h-2 w-2" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </WidgetContainer>
  )
}
