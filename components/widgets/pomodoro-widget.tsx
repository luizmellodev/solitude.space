"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import WidgetContainer from "@/components/widgets/widget-container"
import { useAppTheme } from "@/components/theme-context"

interface PomodoroWidgetProps {
  id: string
  onToggle: () => void
}

export default function PomodoroWidget({ id, onToggle }: PomodoroWidgetProps) {
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
  const { theme } = useAppTheme()

  // Determinar as cores do texto com base no tema
  const getTextColor = () => {
    if (theme === "cute") {
      return "text-pink-900" // Texto escuro para o tema cute
    }
    return "text-white" // Texto claro para outros temas
  }

  const quotes = [
    "Focus on the process, not the outcome.",
    "Small steps lead to big achievements.",
    "Consistency is more important than intensity.",
    "Don't wait for inspiration, create it.",
    "Each minute of focus is an investment in yourself.",
    "Today's productivity shapes your tomorrow.",
    "Start where you are, use what you have.",
    "Progress, not perfection.",
    "One pomodoro at a time.",
    "Breathe. Focus. Achieve.",
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
    <WidgetContainer id={id} title="Pomodoro Timer" onToggle={onToggle}>
      <div className="space-y-2">
        <div
          className={`text-center p-2 bg-black/30 rounded-md border border-white/5 transition-all duration-500 ${
            isActive ? (mode === "work" ? "shadow-glow-red" : "shadow-glow-green") : ""
          }`}
        >
          <div className={`text-3xl font-bold mb-1 ${getTextColor()}`}>{formatTime(timeLeft)}</div>
          <div
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full inline-block transition-all duration-300",
              mode === "work" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400",
            )}
          >
            {mode === "work" ? "Focus Time" : "Break Time"}
          </div>
        </div>

        <div className="flex justify-center space-x-2">
          <Button
            onClick={toggleTimer}
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full border-white/10 hover:bg-black/40 text-white transition-all duration-300 hover:scale-110",
              isActive ? "bg-red-500/20 animate-pulse-slow" : "bg-green-500/20",
            )}
          >
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/30 border-white/10 hover:bg-black/40 text-white transition-all duration-200"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/30 border-white/10 hover:bg-black/40 text-white transition-all duration-200"
            onClick={() => setMute(!mute)}
          >
            {mute ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="space-y-0.5">
            <div className="flex justify-between">
              <Label className="text-[10px]">Focus: {workDuration} min</Label>
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

          <div className="space-y-0.5">
            <div className="flex justify-between">
              <Label className="text-[10px]">Break: {breakDuration} min</Label>
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

        <div className="flex items-center space-x-1.5">
          <Switch
            id="hide-distractions"
            checked={hideDistractions}
            onCheckedChange={setHideDistractions}
            className="data-[state=checked]:bg-purple-600 h-3 w-6 transition-all duration-200"
          />
          <Label htmlFor="hide-distractions" className="text-[10px]">
            Hide distractions during focus
          </Label>
        </div>

        <div
          className={`text-center text-[10px] italic ${theme === "cute" ? "text-pink-800" : "text-zinc-300"} px-2 py-1.5 ${theme === "cute" ? "bg-pink-100/50" : "bg-black/20"} rounded-md border ${theme === "cute" ? "border-pink-300/50" : "border-white/5"}`}
        >
          "{motivationalQuote}"
        </div>
      </div>
    </WidgetContainer>
  )
}
