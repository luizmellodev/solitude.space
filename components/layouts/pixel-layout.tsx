"use client"
import RainEffect from "@/components/effects/rain-effect"
import ThemeEffects from "@/components/effects/theme-effects"
import ThemeSwitcher from "@/components/theme-switcher"
import WidgetGrid from "@/components/widgets/widget-grid"
import WidgetControls from "@/components/widgets/widget-controls"
import MotivationalQuote from "@/components/widgets/motivational-quote"
import { Gamepad2, Trophy, Sword, Shield } from "lucide-react"

export default function PixelLayout({
  widgets,
  activeSounds,
  toggleWidgetVisibility,
  handleSoundToggle,
  showMotivational,
  setShowMotivational,
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/themes/pixel-background.png')",
            imageRendering: "pixelated",
          }}
        />
        <div className="absolute inset-0 bg-indigo-950/40" style={{ imageRendering: "pixelated" }} />
      </div>

      {/* Theme-specific effects */}
      <ThemeEffects />

      {/* Rain Effect */}
      {activeSounds["rain"] && <RainEffect />}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
        {/* Header */}
        <div className="flex justify-center items-center mb-8">
          <div className="pixel-border p-4 w-full max-w-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Gamepad2 className="h-8 w-8 mr-3 text-indigo-300" />
                <h1 className="text-4xl font-mono uppercase tracking-widest text-white pixel-text">PIXEL MODE</h1>
              </div>
              <ThemeSwitcher />
            </div>
            <div className="mt-2 flex justify-center">
              <p className="text-indigo-300 font-mono uppercase">play • win • create</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="pixel-border p-2 flex items-center justify-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-300" />
            <span className="text-white font-mono uppercase text-sm">SCORE: 1337</span>
          </div>
          <div className="pixel-border p-2 flex items-center justify-center">
            <Sword className="h-5 w-5 mr-2 text-red-400" />
            <span className="text-white font-mono uppercase text-sm">POWER: 42</span>
          </div>
          <div className="pixel-border p-2 flex items-center justify-center">
            <Shield className="h-5 w-5 mr-2 text-blue-400" />
            <span className="text-white font-mono uppercase text-sm">DEFENSE: 24</span>
          </div>
          <div className="pixel-border p-2 flex items-center justify-center">
            <div className="w-full bg-gray-800 h-3 rounded-none">
              <div className="bg-green-500 h-3 rounded-none" style={{ width: "65%" }}></div>
            </div>
            <span className="text-white font-mono uppercase text-sm ml-2">HP: 65/100</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="md:col-span-1">
            <div className="space-y-4">
              {/* Motivational Quote */}
              {showMotivational && (
                <div className="pixel-border p-4">
                  <MotivationalQuote onClose={() => setShowMotivational(false)} />
                </div>
              )}

              {/* Widget Controls */}
              <div className="pixel-border p-4">
                <h3 className="text-white font-mono uppercase mb-4 border-b-2 border-indigo-700/70 pb-2">INVENTORY</h3>
                <WidgetControls
                  widgets={widgets}
                  onToggleWidget={toggleWidgetVisibility}
                  onShowMotivational={() => setShowMotivational(true)}
                  showMotivational={showMotivational}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="pixel-border p-4">
              <h3 className="text-white font-mono uppercase mb-4 border-b-2 border-indigo-700/70 pb-2">QUEST BOARD</h3>
              <WidgetGrid widgets={widgets} onToggleWidget={toggleWidgetVisibility} onSoundToggle={handleSoundToggle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
