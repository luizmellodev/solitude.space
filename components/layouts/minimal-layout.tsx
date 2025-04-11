"use client"
import RainEffect from "@/components/effects/rain-effect"
import ThemeEffects from "@/components/effects/theme-effects"
import ThemeSwitcher from "@/components/theme-switcher"
import WidgetGrid from "@/components/widgets/widget-grid"
import WidgetControls from "@/components/widgets/widget-controls"
import MotivationalQuote from "@/components/widgets/motivational-quote"

export default function MinimalLayout({
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
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />
      </div>

      {/* Theme-specific effects */}
      <ThemeEffects />

      {/* Rain Effect */}
      {activeSounds["rain"] && <RainEffect />}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col items-center">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-light tracking-widest text-zinc-100 uppercase">Focus</h1>
          <div className="h-px w-24 bg-zinc-700 mx-auto my-4" />
          <p className="text-zinc-500 font-light text-xs tracking-wider uppercase">minimal experience</p>
          <div className="absolute right-8 top-8">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-3xl">
          {/* Motivational Quote */}
          {showMotivational && (
            <div className="mb-12">
              <MotivationalQuote onClose={() => setShowMotivational(false)} />
            </div>
          )}

          {/* Widget Controls */}
          <div className="mb-12 flex justify-center">
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
      </div>
    </div>
  )
}
