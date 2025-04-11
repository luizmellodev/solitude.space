"use client"

import { useState } from "react"
import RainEffect from "@/components/effects/rain-effect"
import ThemeEffects from "@/components/effects/theme-effects"
import ThemeSwitcher from "@/components/theme-switcher"
import WidgetGrid from "@/components/widgets/widget-grid"
import WidgetControls from "@/components/widgets/widget-controls"
import MotivationalQuote from "@/components/widgets/motivational-quote"
import { cn } from "@/lib/utils"
import { Zap, Radio, Cpu, Disc } from "lucide-react"

export default function NeonLayout({
  widgets,
  activeSounds,
  toggleWidgetVisibility,
  handleSoundToggle,
  showMotivational,
  setShowMotivational,
}) {
  const [isFlickering, setIsFlickering] = useState(false)

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/themes/neon-background.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/80" />
      </div>

      {/* Theme-specific effects */}
      <ThemeEffects />

      {/* Rain Effect */}
      {activeSounds["rain"] && <RainEffect />}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 text-center relative">
            <h1
              className={cn(
                "text-5xl md:text-6xl font-mono font-bold mb-1 tracking-wider text-cyan-300 neon-text",
                isFlickering && "neon-flicker",
              )}
            >
              CYBER FOCUS
            </h1>
            <p className="text-cyan-400/80 font-mono">connect • hack • create</p>
          </div>
          <div className="absolute right-4 top-4">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <div className="col-span-2">
            <div className="space-y-4">
              <div className="neon-widget p-3 flex flex-col items-center">
                <div className="neon-border" />
                <Zap className="h-6 w-6 text-cyan-400 mb-2" />
                <span className="text-cyan-300 font-mono text-xs uppercase tracking-wider">Energy</span>
              </div>
              <div className="neon-widget p-3 flex flex-col items-center">
                <div className="neon-border" />
                <Radio className="h-6 w-6 text-cyan-400 mb-2" />
                <span className="text-cyan-300 font-mono text-xs uppercase tracking-wider">Signal</span>
              </div>
              <div className="neon-widget p-3 flex flex-col items-center">
                <div className="neon-border" />
                <Cpu className="h-6 w-6 text-cyan-400 mb-2" />
                <span className="text-cyan-300 font-mono text-xs uppercase tracking-wider">System</span>
              </div>
              <div className="neon-widget p-3 flex flex-col items-center">
                <div className="neon-border" />
                <Disc className="h-6 w-6 text-cyan-400 mb-2" />
                <span className="text-cyan-300 font-mono text-xs uppercase tracking-wider">Data</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-8">
            {/* Motivational Quote */}
            {showMotivational && (
              <div className="mb-6">
                <MotivationalQuote onClose={() => setShowMotivational(false)} />
              </div>
            )}

            {/* Widget Controls */}
            <div className="mb-6 neon-widget p-4">
              <div className="neon-border" />
              <WidgetControls
                widgets={widgets}
                onToggleWidget={toggleWidgetVisibility}
                onShowMotivational={() => setShowMotivational(true)}
                showMotivational={showMotivational}
              />
            </div>

            {/* Widget Grid */}
            <WidgetGrid widgets={widgets} onToggleWidget={toggleWidgetVisibility} onSoundToggle={handleSoundToggle} />
          </div>

          {/* Right Sidebar - System Status */}
          <div className="col-span-2">
            <div className="neon-widget p-4 h-full">
              <div className="neon-border" />
              <h3 className="text-cyan-300 font-mono text-xs uppercase tracking-wider mb-4">System Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-400 font-mono text-xs">CPU</span>
                    <span className="text-cyan-300 font-mono text-xs">67%</span>
                  </div>
                  <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-cyan-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-400 font-mono text-xs">RAM</span>
                    <span className="text-cyan-300 font-mono text-xs">42%</span>
                  </div>
                  <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full w-2/5 bg-cyan-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-400 font-mono text-xs">NETWORK</span>
                    <span className="text-cyan-300 font-mono text-xs">89%</span>
                  </div>
                  <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full w-[89%] bg-cyan-500 rounded-full animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-cyan-400 font-mono text-xs">STORAGE</span>
                    <span className="text-cyan-300 font-mono text-xs">35%</span>
                  </div>
                  <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-cyan-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
