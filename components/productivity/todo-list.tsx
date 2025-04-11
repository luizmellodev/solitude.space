"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("lofi-todos")
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
    localStorage.setItem("lofi-todos", JSON.stringify(todos))
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
    <div className="w-full">
      <h3 className="text-xl font-medium mb-4 text-white">Suas Tarefas</h3>

      <div className="flex mb-6">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Adicionar nova tarefa..."
          className="bg-black/30 border-white/10 text-white rounded-l-xl rounded-r-none focus-visible:ring-purple-500/50"
        />
        <Button
          onClick={addTodo}
          variant="ghost"
          size="icon"
          className="rounded-l-none rounded-r-xl bg-purple-500/20 hover:bg-purple-500/30 text-white border border-white/10 border-l-0"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {todos.length === 0 ? (
          <div className="text-sm text-zinc-400 text-center py-8 bg-black/20 rounded-xl border border-white/5">
            <p>Nenhuma tarefa adicionada</p>
            <p className="mt-1 text-xs">Adicione tarefas para acompanhar seu progresso</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/10 transition-all duration-200 hover:border-white/20"
            >
              <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full border mr-3 transition-all duration-200",
                    todo.completed
                      ? "bg-green-500/20 border-green-500 shadow-sm shadow-green-500/30"
                      : "border-zinc-600 hover:border-white/50",
                  )}
                >
                  {todo.completed && <Check className="h-3.5 w-3.5 text-green-500" />}
                </div>
                <span className={cn("text-sm", todo.completed && "line-through text-zinc-500")}>{todo.text}</span>
              </div>
              <Button
                onClick={() => deleteTodo(todo.id)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
