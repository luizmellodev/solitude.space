"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Maximize, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface PomodoroTimerProps {
  onFullscreen: () => void
  isFullscreen: boolean
}

export default function PomodoroTimer({ onFullscreen, isFullscreen }: PomodoroTimerProps) {
  const [mode, setMode] = useState<"work" | "break">("work")
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [hideDistractions, setHideDistractions] = useState(false)
  const [mute, setMute] = useState(false)
  const [motivationalQuote, setMotivationalQuote] = useState("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const quotes = [
    "Foco no processo, não no resultado.",
    "Pequenos passos levam a grandes conquistas.",
    "A consistência é mais importante que a intensidade.",
    "Não espere por inspiração, crie-a.",
    "Cada minuto de foco é um investimento em você.",
    "Sua produtividade de hoje molda seu amanhã.",
    "Comece onde você está, use o que você tem.",
    "Progresso, não perfeição.",
    "Um pomodoro de cada vez.",
    "Respire. Foque. Conquiste.",
  ]

  useEffect(() => {
    // Set a random quote on mount
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)])

    // Create audio element
    audioRef.current = new Audio("/bell-sound.mp3")

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Time's up
            if (!mute && audioRef.current) {
              audioRef.current.play().catch((e) => console.error("Failed to play sound", e))
            }

            // Switch modes
            if (mode === "work") {
              setMode("break")
              return breakDuration * 60
            } else {
              setMode("work")
              return workDuration * 60
            }
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, mode, workDuration, breakDuration, mute])

  const toggleTimer = () => {
    setIsActive(!isActive)

    // Show a new quote when starting
    if (!isActive) {
      setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)])
    }
  }

  const resetTimer = () => {
    setIsActive(false)
    setMode("work")
    setTimeLeft(workDuration * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleWorkDurationChange = (value: number[]) => {
    const newDuration = value[0]
    setWorkDuration(newDuration)
    if (mode === "work" && !isActive) {
      setTimeLeft(newDuration * 60)
    }
  }

  const handleBreakDurationChange = (value: number[]) => {
    const newDuration = value[0]
    setBreakDuration(newDuration)
    if (mode === "break" && !isActive) {
      setTimeLeft(newDuration * 60)
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-medium mb-6 text-white">Pomodoro Timer</h3>

      <div className="flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="text-5xl font-bold mb-3">{formatTime(timeLeft)}</div>
          <div
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-full",
              mode === "work" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400",
            )}
          >
            {mode === "work" ? "Tempo de Foco" : "Tempo de Pausa"}
          </div>
        </div>

        <div className="flex space-x-3 mb-8">
          <Button
            onClick={toggleTimer}
            variant="outline"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full border-white/10 hover:bg-black/40 text-white",
              isActive ? "bg-red-500/20" : "bg-green-500/20",
            )}
          >
            {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/30 border-white/10 hover:bg-black/40 text-white"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            onClick={onFullscreen}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/30 border-white/10 hover:bg-black/40 text-white"
          >
            <Maximize className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => setMute(!mute)}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/30 border-white/10 hover:bg-black/40 text-white"
          >
            {mute ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>

        <div className="w-full space-y-6 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-sm">Duração do foco: {workDuration} min</Label>
            </div>
            <Slider
              value={[workDuration]}
              min={5}
              max={60}
              step={5}
              onValueChange={handleWorkDurationChange}
              disabled={isActive}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-sm">Duração da pausa: {breakDuration} min</Label>
            </div>
            <Slider
              value={[breakDuration]}
              min={1}
              max={15}
              step={1}
              onValueChange={handleBreakDurationChange}
              disabled={isActive}
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <Switch
            id="hide-distractions"
            checked={hideDistractions}
            onCheckedChange={setHideDistractions}
            className="data-[state=checked]:bg-purple-600"
          />
          <Label htmlFor="hide-distractions" className="text-sm">
            Esconder distrações durante o foco
          </Label>
        </div>

        <div className="text-center text-sm italic text-zinc-300 px-6 py-4 bg-black/30 rounded-xl border border-white/5">
          "{motivationalQuote}"
        </div>
      </div>
    </div>
  )
}
