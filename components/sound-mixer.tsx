"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CloudRain, Wind, Coffee, Flame, Waves, Bird } from "lucide-react"

interface Sound {
  id: string
  name: string
  icon: string
  src?: string
}

interface SoundMixerProps {
  sounds: Sound[]
  onSoundToggle?: (id: string, active: boolean) => void
}

export default function SoundMixer({ sounds, onSoundToggle }: SoundMixerProps) {
  const [soundStates, setSoundStates] = useState<Record<string, { active: boolean; volume: number }>>({})

  // Map of icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    CloudRain: <CloudRain className="h-5 w-5 text-zinc-300" />,
    Wind: <Wind className="h-5 w-5 text-zinc-300" />,
    Coffee: <Coffee className="h-5 w-5 text-zinc-300" />,
    Flame: <Flame className="h-5 w-5 text-zinc-300" />,
    Waves: <Waves className="h-5 w-5 text-zinc-300" />,
    Bird: <Bird className="h-5 w-5 text-zinc-300" />,
  }

  // Initialize sound states
  useEffect(() => {
    const initialStates: Record<string, { active: boolean; volume: number }> = {}
    sounds.forEach((sound) => {
      initialStates[sound.id] = { active: false, volume: 50 }
    })
    setSoundStates(initialStates)
  }, [sounds])

  const toggleSound = (id: string) => {
    setSoundStates((prev) => {
      const newState = {
        ...prev,
        [id]: { ...prev[id], active: !prev[id].active },
      }

      // Notify parent component
      if (onSoundToggle) {
        onSoundToggle(id, newState[id].active)
      }

      return newState
    })
  }

  const adjustVolume = (id: string, value: number[]) => {
    const newVolume = value[0]
    setSoundStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], volume: newVolume },
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
      {sounds.map((sound) => {
        const state = soundStates[sound.id] || { active: false, volume: 50 }

        return (
          <div
            key={sound.id}
            className="ambient-item p-4 rounded-xl bg-black/50 border border-white/5 transition-all duration-200 hover:border-white/10"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {iconMap[sound.icon]}
                <Label htmlFor={`sound-${sound.id}`} className="text-sm font-medium">
                  {sound.name}
                </Label>
              </div>
              <Switch
                id={`sound-${sound.id}`}
                checked={state.active}
                onCheckedChange={() => toggleSound(sound.id)}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            {state.active && (
              <div className="mt-3 pl-8">
                <Slider
                  value={[state.volume]}
                  max={100}
                  step={1}
                  onValueChange={(value) => adjustVolume(sound.id, value)}
                  className="cursor-pointer"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
