"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import WidgetContainer from "@/components/widgets/widget-container"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CloudRain, Wind, Coffee, Flame, Waves, Bird, Music } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppTheme } from "@/components/theme-context"

interface AmbientSoundsWidgetProps {
  id: string
  onToggle: () => void
  onSoundToggle: (id: string, active: boolean) => void
}

// Mapeamento de IDs de sons para IDs de vídeos do YouTube
const youtubeVideos = {
  rain: "mPZkdNFkNps", // Som de chuva
  whitenoise: "nMfPqeZjc2c", // Ruído branco
  coffee: "BOdLmxy06bU", // Sons de cafeteria - ID atualizado
  fire: "L_LUpnjgPso", // Som de lareira
  waves: "Nep1qytq9JM", // Sons de ondas do oceano
  birds: "Qm846KdZN_c", // Sons de pássaros
  lofi: "jfKfPfyJRdk", // Lofi beats
}

export default function AmbientSoundsWidget({ id, onToggle, onSoundToggle }: AmbientSoundsWidgetProps) {
  const [soundStates, setSoundStates] = useState<Record<string, { active: boolean; volume: number }>>({})
  const { theme } = useAppTheme()
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({})

  // Map of icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    CloudRain: <CloudRain className="h-3.5 w-3.5 text-zinc-300" />,
    Wind: <Wind className="h-3.5 w-3.5 text-zinc-300" />,
    Coffee: <Coffee className="h-3.5 w-3.5 text-zinc-300" />,
    Flame: <Flame className="h-3.5 w-3.5 text-zinc-300" />,
    Waves: <Waves className="h-3.5 w-3.5 text-zinc-300" />,
    Bird: <Bird className="h-3.5 w-3.5 text-zinc-300" />,
    Music: <Music className="h-3.5 w-3.5 text-purple-300" />,
  }

  // Lista de sons ambientes
  const allSounds = [
    {
      id: "lofi",
      name: "Lofi Beats",
      icon: "Music",
      featured: true,
    },
    {
      id: "rain",
      name: "Rain",
      icon: "CloudRain",
    },
    {
      id: "whitenoise",
      name: "White Noise",
      icon: "Wind",
    },
    {
      id: "coffee",
      name: "Coffee Shop",
      icon: "Coffee",
    },
    {
      id: "fire",
      name: "Fireplace",
      icon: "Flame",
    },
    {
      id: "waves",
      name: "Ocean Waves",
      icon: "Waves",
    },
    {
      id: "birds",
      name: "Birds",
      icon: "Bird",
    },
  ]

  // Initialize sound states
  useEffect(() => {
    const initialStates: Record<string, { active: boolean; volume: number }> = {}
    allSounds.forEach((sound) => {
      initialStates[sound.id] = { active: false, volume: 50 }
    })
    setSoundStates(initialStates)
  }, [])

  // Controlar os vídeos do YouTube
  useEffect(() => {
    Object.entries(soundStates).forEach(([soundId, state]) => {
      const iframe = iframeRefs.current[soundId]
      if (iframe && iframe.contentWindow) {
        try {
          if (state.active) {
            // Iniciar o vídeo
            iframe.contentWindow.postMessage(
              JSON.stringify({
                event: "command",
                func: "playVideo",
                args: "",
              }),
              "*",
            )
            // Ajustar o volume (0-100)
            iframe.contentWindow.postMessage(
              JSON.stringify({
                event: "command",
                func: "setVolume",
                args: [state.volume],
              }),
              "*",
            )
          } else {
            // Pausar o vídeo
            iframe.contentWindow.postMessage(
              JSON.stringify({
                event: "command",
                func: "pauseVideo",
                args: "",
              }),
              "*",
            )
          }
        } catch (error) {
          console.error("Error controlling YouTube video:", error)
        }
      }
    })
  }, [soundStates])

  const toggleSound = (id: string) => {
    setSoundStates((prev) => {
      const newActive = !prev[id].active

      // Notify parent component (em um setTimeout para evitar chamadas durante a renderização)
      if (onSoundToggle) {
        setTimeout(() => {
          onSoundToggle(id, newActive)
        }, 0)
      }

      return {
        ...prev,
        [id]: { ...prev[id], active: newActive },
      }
    })
  }

  const adjustVolume = (id: string, value: number[]) => {
    const newVolume = value[0]
    setSoundStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], volume: newVolume },
    }))
  }

  // Ajustar classes com base no tema
  const getSwitchClasses = (isFeatured: boolean) => {
    const baseClasses = "transition-all duration-300 h-3 w-6"

    if (theme === "cute") {
      return cn(
        baseClasses,
        isFeatured
          ? "data-[state=checked]:bg-pink-500 data-[state=checked]:shadow-glow"
          : "data-[state=checked]:bg-pink-500",
      )
    }

    if (theme === "cozy") {
      return cn(
        baseClasses,
        isFeatured
          ? "data-[state=checked]:bg-amber-600 data-[state=checked]:shadow-glow"
          : "data-[state=checked]:bg-amber-600",
      )
    }

    return cn(
      baseClasses,
      isFeatured
        ? "data-[state=checked]:bg-purple-600 data-[state=checked]:shadow-glow"
        : "data-[state=checked]:bg-purple-600",
    )
  }

  return (
    <WidgetContainer id={id} title="Ambient Sounds" onToggle={onToggle}>
      {/* YouTube iframes invisíveis para cada som */}
      <div className="hidden">
        {allSounds.map((sound) => (
          <iframe
            key={sound.id}
            ref={(el) => (iframeRefs.current[sound.id] = el)}
            width="1"
            height="1"
            src={`https://www.youtube.com/embed/${youtubeVideos[sound.id]}?enablejsapi=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&loop=1&playlist=${youtubeVideos[sound.id]}`}
            title={`${sound.name} Sound`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
          ></iframe>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-1.5 max-h-none overflow-visible pr-1">
        {allSounds.map((sound) => {
          const state = soundStates[sound.id] || { active: false, volume: 50 }
          const isFeatured = "featured" in sound && sound.featured

          return (
            <div
              key={sound.id}
              className={cn(
                "p-1.5 rounded-md bg-black/30 border transition-all duration-300 hover:border-white/10 overflow-hidden",
                state.active && "shadow-glow-sm",
                isFeatured
                  ? "col-span-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30"
                  : "border-white/5",
              )}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                  {iconMap[sound.icon]}
                  <Label
                    htmlFor={`sound-${sound.id}`}
                    className={`text-[10px] font-medium truncate ${isFeatured ? "text-purple-300" : ""}`}
                  >
                    {sound.name}
                    {isFeatured && <span className="ml-1 text-[8px] bg-purple-500/30 px-1 py-0.5 rounded">New</span>}
                  </Label>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <Switch
                    id={`sound-${sound.id}`}
                    checked={state.active}
                    onCheckedChange={() => toggleSound(sound.id)}
                    className={getSwitchClasses(isFeatured)}
                  />
                </div>
              </div>

              {state.active && (
                <div className="mt-1.5 pl-5 animate-fade-in w-full">
                  <Slider
                    value={[state.volume]}
                    max={100}
                    step={1}
                    onValueChange={(value) => adjustVolume(sound.id, value)}
                    className={`cursor-pointer w-full ${isFeatured ? "bg-purple-900/30" : ""}`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </WidgetContainer>
  )
}
