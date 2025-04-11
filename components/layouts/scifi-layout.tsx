"use client"
import RainEffect from "@/components/effects/rain-effect"
import ThemeEffects from "@/components/effects/theme-effects"
import ThemeSwitcher from "@/components/theme-switcher"
import WidgetGrid from "@/components/widgets/widget-grid"
import WidgetControls from "@/components/widgets/widget-controls"
import MotivationalQuote from "@/components/widgets/motivational-quote"
import { BarChart3, Layers, Atom, Database, Satellite } from "lucide-react"

export default function ScifiLayout({
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
            backgroundImage: "url('/themes/scifi-background.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 to-blue-950/80" />
      </div>

      {/* Theme-specific effects */}
      <ThemeEffects />

      {/* Rain Effect */}
      {activeSounds["rain"] && <RainEffect />}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-8 scifi-widget p-2">
          <div className="flex items-center">
            <div className="scifi-indicator mr-3" />
            <Satellite className="h-5 w-5 text-blue-300 mr-2" />
            <span className="text-blue-200 font-mono uppercase tracking-wider text-sm">QUANTUM NETWORK</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-blue-300 font-mono text-xs">SYSTEM TIME: {new Date().toLocaleTimeString()}</div>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Sidebar - Navigation */}
          <div className="col-span-2">
            <div className="scifi-widget p-4">
              <div className="scifi-widget-decoration" />
              <h3 className="text-blue-200 font-mono uppercase tracking-wider text-xs mb-4 flex items-center">
                <div className="scifi-indicator mr-2" />
                NAVIGATION
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center text-blue-300 hover:text-blue-100 transition-colors text-xs font-mono"
                >
                  <Database className="h-3 w-3 mr-2" />
                  DATA CENTER
                </a>
                <a
                  href="#"
                  className="flex items-center text-blue-300 hover:text-blue-100 transition-colors text-xs font-mono"
                >
                  <BarChart3 className="h-3 w-3 mr-2" />
                  ANALYTICS
                </a>
                <a
                  href="#"
                  className="flex items-center text-blue-300 hover:text-blue-100 transition-colors text-xs font-mono"
                >
                  <Layers className="h-3 w-3 mr-2" />
                  SYSTEMS
                </a>
                <a
                  href="#"
                  className="flex items-center text-blue-300 hover:text-blue-100 transition-colors text-xs font-mono"
                >
                  <Atom className="h-3 w-3 mr-2" />
                  QUANTUM CORE
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-8">
            <div className="scifi-widget p-4 mb-4">
              <div className="scifi-widget-decoration" />
              <div className="flex justify-between items-center">
                <h2 className="text-blue-100 font-mono uppercase tracking-wider text-lg scifi-text">QUANTUM FOCUS</h2>
                <div className="flex space-x-2">
                  <div className="scifi-indicator" />
                  <div className="scifi-indicator" />
                  <div className="scifi-indicator" />
                </div>
              </div>
            </div>

            {/* Motivational Quote */}
            {showMotivational && (
              <div className="mb-4">
                <MotivationalQuote onClose={() => setShowMotivational(false)} />
              </div>
            )}

            {/* Widget Controls */}
            <div className="scifi-widget p-4 mb-4">
              <div className="scifi-widget-decoration" />
              <h3 className="text-blue-200 font-mono uppercase tracking-wider text-xs mb-4 flex items-center">
                <div className="scifi-indicator mr-2" />
                SYSTEM MODULES
              </h3>
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
            <div className="scifi-widget p-4">
              <div className="scifi-widget-decoration" />
              <h3 className="text-blue-200 font-mono uppercase tracking-wider text-xs mb-4 flex items-center">
                <div className="scifi-indicator mr-2" />
                SYSTEM STATUS
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-blue-300 font-mono text-xs">QUANTUM CPU</span>
                    <span className="text-blue-200 font-mono text-xs">87%</span>
                  </div>
                  <div className="h-1 bg-blue-950 rounded-none overflow-hidden">
                    <div className="h-full w-[87%] bg-blue-500 rounded-none" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-blue-300 font-mono text-xs">NEURAL NET</span>
                    <span className="text-blue-200 font-mono text-xs">62%</span>
                  </div>
                  <div className="h-1 bg-blue-950 rounded-none overflow-hidden">
                    <div className="h-full w-[62%] bg-blue-500 rounded-none" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-blue-300 font-mono text-xs">BANDWIDTH</span>
                    <span className="text-blue-200 font-mono text-xs">45%</span>
                  </div>
                  <div className="h-1 bg-blue-950 rounded-none overflow-hidden">
                    <div className="h-full w-[45%] bg-blue-500 rounded-none" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-blue-300 font-mono text-xs">STORAGE</span>
                    <span className="text-blue-200 font-mono text-xs">23%</span>
                  </div>
                  <div className="h-1 bg-blue-950 rounded-none overflow-hidden">
                    <div className="h-full w-[23%] bg-blue-500 rounded-none" />
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
