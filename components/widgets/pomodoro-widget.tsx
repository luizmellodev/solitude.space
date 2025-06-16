"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Info, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import WidgetContainer from "@/components/widgets/widget-container"
import { useAppTheme } from "@/components/theme-context"

// Tempos padrão (em minutos)
const DEFAULT_FOCUS_TIME = 25
const DEFAULT_SHORT_BREAK_TIME = 1
const DEFAULT_LONG_BREAK_TIME = 15
const DEFAULT_TOTAL_CYCLES = 4

// Limites dos sliders
const FOCUS_TIME_LIMITS = { min: 0.1, max: 60, step: 1 }
const SHORT_BREAK_LIMITS = { min: 0.1, max: 30, step: 1 }
const LONG_BREAK_LIMITS = { min: 0.1, max: 60, step: 5 }
const TOTAL_CYCLES_LIMITS = { min: 1, max: 8, step: 1 }

// Configurações visuais
const PROGRESS_CIRCLE_SIZE = 160
const PROGRESS_CIRCLE_STROKE = 8

// Configurações de som
const SOUND_FILE_PATH = "/alarm.mp3"

// Cores dos modos
const MODE_COLORS = {
  focus: { color: "#ef4444", bg: "bg-red-500/20", text: "text-red-400" },
  shortBreak: { color: "#22c55e", bg: "bg-green-500/20", text: "text-green-400" },
  longBreak: { color: "#3b82f6", bg: "bg-blue-500/20", text: "text-blue-400" }
}

// Textos dos modos
const MODE_TEXTS = {
  focus: "Focus Time",
  shortBreak: "Short Break",
  longBreak: "Long Break"
}

// ============================================================================
// COMPONENTES E LÓGICA
// ============================================================================

interface PomodoroWidgetProps {
  id: string
  onToggle: () => void
}

// Progress Circle Component
const ProgressCircle = ({ 
  progress, 
  size = PROGRESS_CIRCLE_SIZE, 
  strokeWidth = PROGRESS_CIRCLE_STROKE,
  color = MODE_COLORS.focus.color
}: { 
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-zinc-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  )
}

export default function PomodoroWidget({ id, onToggle }: PomodoroWidgetProps) {
  // Timer states
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS_TIME * 60) // seconds
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus")
  
  // Settings
  const [focusTime, setFocusTime] = useState(DEFAULT_FOCUS_TIME) // minutes
  const [shortBreakTime, setShortBreakTime] = useState(DEFAULT_SHORT_BREAK_TIME) // minutes
  const [longBreakTime, setLongBreakTime] = useState(DEFAULT_LONG_BREAK_TIME) // minutes
  const [totalCycles, setTotalCycles] = useState(DEFAULT_TOTAL_CYCLES) // number of focus cycles
  const [muted, setMuted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [autoStart, setAutoStart] = useState(false)
  
  // Progress tracking
  const [completedCycles, setCompletedCycles] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(1)
  
  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { theme } = useAppTheme()

  // Initialize audio
  useEffect(() => {
    try {
      audioRef.current = new Audio(SOUND_FILE_PATH)
      audioRef.current.preload = "auto"
      audioRef.current.volume = 0.7 // Set a reasonable volume
      
      // Try to load the audio
      audioRef.current.load()
    } catch (error) {
      console.warn("Failed to initialize audio:", error)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, timeLeft])

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsActive(false)
    playSound()
    
    if (mode === "focus") {
      const newCompletedCycles = completedCycles + 1
      setCompletedCycles(newCompletedCycles)
      
      if (newCompletedCycles >= totalCycles) {
        // All cycles completed - long break
        setMode("longBreak")
        setTimeLeft(longBreakTime * 60)
      } else {
        // Short break
        setMode("shortBreak")
        setTimeLeft(shortBreakTime * 60)
      }
    } else {
      // Break completed - back to focus
      if (completedCycles >= totalCycles) {
        // Reset everything after long break
        setCompletedCycles(0)
        setCurrentCycle(1)
      } else {
        // Next cycle
        setCurrentCycle(prev => prev + 1)
      }
      setMode("focus")
      setTimeLeft(focusTime * 60)
    }
    
    // Auto-start next session if enabled
    if (autoStart) {
      setIsActive(true)
    }
  }

  // Play sound with better error handling and user interaction requirement
  const playSound = async () => {
    if (!muted && audioRef.current) {
      try {
        // Reset audio to beginning
        audioRef.current.currentTime = 0
        
        // Ensure audio is loaded
        if (audioRef.current.readyState < 2) {
          await new Promise((resolve) => {
            audioRef.current!.addEventListener('canplay', resolve, { once: true })
            audioRef.current!.load()
          })
        }
        
        // Play the audio
        await audioRef.current.play()
        console.log("Sound played successfully")
      } catch (error: any) {
        console.warn("Audio play failed:", error)
        // If autoplay fails, we might need user interaction first
        if (error.name === 'NotAllowedError') {
          console.warn("Audio autoplay blocked. User interaction required.")
        }
      }
    }
  }



  // Control functions
  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMode("focus")
    setTimeLeft(focusTime * 60)
    setCompletedCycles(0)
    setCurrentCycle(1)
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const getProgress = () => {
    const totalTime = mode === "focus" ? focusTime * 60 
                    : mode === "shortBreak" ? shortBreakTime * 60 
                    : longBreakTime * 60
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  // Get colors based on mode
  const getColors = () => {
    return MODE_COLORS[mode]
  }

  // Get mode display text
  const getModeText = () => {
    return MODE_TEXTS[mode]
  }

  // Settings handlers
  const handleFocusTimeChange = (value: number[]) => {
    setFocusTime(value[0])
    if (mode === "focus" && !isActive) {
      setTimeLeft(value[0] * 60)
    }
  }

  const handleShortBreakChange = (value: number[]) => {
    setShortBreakTime(value[0])
    if (mode === "shortBreak" && !isActive) {
      setTimeLeft(value[0] * 60)
    }
  }

  const handleLongBreakChange = (value: number[]) => {
    setLongBreakTime(value[0])
    if (mode === "longBreak" && !isActive) {
      setTimeLeft(value[0] * 60)
    }
  }

  const handleTotalCyclesChange = (value: number[]) => {
    setTotalCycles(value[0])
  }

  const colors = getColors()

  return (
    <WidgetContainer id={id} title="Pomodoro Timer" onToggle={onToggle}>
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="w-full bg-black/30 rounded-xl p-3 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-400">Progress</span>
            <span className="text-xs font-medium text-white">
              Cycle {currentCycle}/{totalCycles}
            </span>
          </div>
          
          <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden flex">
            {Array.from({ length: totalCycles }).map((_, index) => {
              const cycleNumber = index + 1
              const isCompleted = cycleNumber <= completedCycles
              const isCurrent = cycleNumber === currentCycle && mode === "focus"
              
              return (
                <div 
                  key={index} 
                  className="flex-1 relative bg-zinc-700"
                  style={{ 
                    borderRight: index < totalCycles - 1 ? '1px solid rgb(63, 63, 70)' : 'none' 
                  }}
                >
                  {isCompleted && (
                    <div className="absolute inset-0 bg-green-500" />
                  )}
                  {isCurrent && (
                    <div
                      className="absolute inset-0 bg-red-500 transition-all duration-300"
                      style={{ width: `${getProgress()}%` }}
                    />
                  )}
                </div>
              )
            })}
          </div>
          
          <div className="flex justify-between mt-1 text-[10px] text-zinc-400">
            <span>🔴 Focus</span>
            <span>Completed: {completedCycles}/{totalCycles}</span>
            <span>🟢 Done</span>
          </div>
        </div>

        {/* Timer Circle */}
        <div className="relative flex justify-center">
          <ProgressCircle 
            progress={getProgress()} 
            color={colors.color}
            size={PROGRESS_CIRCLE_SIZE}
            strokeWidth={PROGRESS_CIRCLE_STROKE}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold mb-1 text-white">
              {formatTime(timeLeft)}
            </div>
            <div className={cn("text-xs font-medium px-2 py-1 rounded-full", colors.bg, colors.text)}>
              {getModeText()}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-2">
          <Button
            onClick={toggleTimer}
            variant="outline"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full border-white/10 hover:bg-black/40 text-white transition-all duration-300",
              isActive ? "bg-red-500/20" : "bg-green-500/20"
            )}
          >
            {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-black/30 border-white/10 hover:bg-black/40 text-white"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => setMuted(!muted)}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-black/30 border-white/10 hover:bg-black/40 text-white"
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          
          {/* Auto-start Button */}
          <Button
            onClick={() => setAutoStart(!autoStart)}
            variant="outline"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full border-white/10",
              autoStart 
                ? "bg-blue-500/20 text-blue-400 border-blue-500/30" 
                : "bg-black/30 text-zinc-400"
            )}
            title={autoStart ? "Auto-start enabled" : "Auto-start disabled"}
          >
            <Zap className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full bg-black/30 border-white/10 hover:bg-black/40 text-white",
              showSettings && "bg-purple-500/20"
            )}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="space-y-3 p-3 bg-black/20 rounded-xl border border-white/5">
            <h4 className="text-sm font-medium text-white mb-2">Settings</h4>
            
            {/* Auto-start Info */}
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-3 w-3 text-blue-400" />
                <span className="text-xs font-medium text-blue-400">Auto-start</span>
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  autoStart ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                )}>
                  {autoStart ? "ON" : "OFF"}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                When enabled, the next session starts automatically after each timer completes. 
                No need to manually click play between focus and break periods.
              </p>
            </div>
            
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-zinc-400">Focus Time: {focusTime} min</Label>
                <Slider
                  value={[focusTime]}
                  min={FOCUS_TIME_LIMITS.min}
                  max={FOCUS_TIME_LIMITS.max}
                  step={FOCUS_TIME_LIMITS.step}
                  onValueChange={handleFocusTimeChange}
                  disabled={isActive}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-xs text-zinc-400">Short Break: {shortBreakTime} min</Label>
                <Slider
                  value={[shortBreakTime]}
                  min={SHORT_BREAK_LIMITS.min}
                  max={SHORT_BREAK_LIMITS.max}
                  step={SHORT_BREAK_LIMITS.step}
                  onValueChange={handleShortBreakChange}
                  disabled={isActive}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-xs text-zinc-400">Long Break: {longBreakTime} min</Label>
                <Slider
                  value={[longBreakTime]}
                  min={LONG_BREAK_LIMITS.min}
                  max={LONG_BREAK_LIMITS.max}
                  step={LONG_BREAK_LIMITS.step}
                  onValueChange={handleLongBreakChange}
                  disabled={isActive}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-xs text-zinc-400">Total Cycles: {totalCycles}</Label>
                <Slider
                  value={[totalCycles]}
                  min={TOTAL_CYCLES_LIMITS.min}
                  max={TOTAL_CYCLES_LIMITS.max}
                  step={TOTAL_CYCLES_LIMITS.step}
                  onValueChange={handleTotalCyclesChange}
                  disabled={isActive}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </WidgetContainer>
  )
}
