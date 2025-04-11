"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface MotivationalQuoteProps {
  onClose: () => void
}

const quotes = [
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Quality is not an act, it is a habit.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Your time is limited, don't waste it living someone else's life.",
  "The best way to predict the future is to create it.",
  "Simplicity is the ultimate sophistication.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "The journey of a thousand miles begins with one step.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Focus on being productive instead of busy.",
  "Small progress is still progress.",
  "Dream big, start small, but most of all, start.",
  "The difference between ordinary and extraordinary is that little extra.",
  "The only place where success comes before work is in the dictionary.",
  "Your attitude determines your direction.",
]

export default function MotivationalQuote({ onClose }: MotivationalQuoteProps) {
  const [quote, setQuote] = useState("")
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Selecionar uma citação aleatória
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [])

  return (
    <Card
      className="bg-black/40 backdrop-blur-xl border-white/10 shadow-lg relative overflow-hidden header-element animate-fade-in-up"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-2 right-2 h-6 w-6 text-zinc-400 hover:text-white hover:bg-black/30 z-10 transition-opacity duration-300 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      >
        <X className="h-3 w-3" />
      </Button>
      <CardContent className="p-6 text-center">
        <p className="text-lg md:text-xl font-medium italic text-white">{quote}</p>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-50 pulse-animation" />
    </Card>
  )
}
