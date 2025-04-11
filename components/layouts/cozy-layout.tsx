"use client"
import RainEffect from "@/components/effects/rain-effect"
import ThemeEffects from "@/components/effects/theme-effects"
import ThemeSwitcher from "@/components/theme-switcher"
import WidgetGrid from "@/components/widgets/widget-grid"
import WidgetControls from "@/components/widgets/widget-controls"
import MotivationalQuote from "@/components/widgets/motivational-quote"
import { BookOpen, Coffee, Music, Flame } from "lucide-react"

export default function CozyLayout({
  widgets,
  activeSounds,
  toggleWidgetVisibility,
  handleSoundToggle,
  showMotivational,
  setShowMotivational,
}) {
  // Funções para os quick links
  const handleCoffeeShopSounds = () => {
    handleSoundToggle("coffee", true)
    // Abrir o widget de sons ambientes se estiver fechado
    const ambientWidget = widgets.find((w) => w.id === "ambient-sounds")
    if (ambientWidget && !ambientWidget.visible) {
      toggleWidgetVisibility("ambient-sounds")
    }
  }

  const handleLofiPlaylist = () => {
    handleSoundToggle("lofi", true)
    // Abrir o widget de música se estiver fechado
    const musicWidget = widgets.find((w) => w.id === "music-player")
    if (musicWidget && !musicWidget.visible) {
      toggleWidgetVisibility("music-player")
    }
  }

  const handleReadingJournal = () => {
    // Abrir o widget de journal se estiver fechado
    const journalWidget = widgets.find((w) => w.id === "mini-journal")
    if (journalWidget && !journalWidget.visible) {
      toggleWidgetVisibility("mini-journal")
    }
  }

  const handleFireplaceAmbience = () => {
    handleSoundToggle("fire", true)
    // Abrir o widget de sons ambientes se estiver fechado
    const ambientWidget = widgets.find((w) => w.id === "ambient-sounds")
    if (ambientWidget && !ambientWidget.visible) {
      toggleWidgetVisibility("ambient-sounds")
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/themes/cozy-background.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/50 to-amber-950/80" />
      </div>

      {/* Theme-specific effects */}
      <ThemeEffects />

      {/* Rain Effect */}
      {activeSounds["rain"] && <RainEffect />}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-8 py-8 min-h-screen">
        {/* Sidebar */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4 space-y-6">
            {/* Logo/Header */}
            <div className="text-center bg-amber-950/70 backdrop-blur-sm border-amber-800/30 p-6 rounded-xl">
              <h1 className="text-4xl font-serif font-bold mb-2 text-amber-100">Cozy Space</h1>
              <p className="text-amber-200/80 font-serif">relax • focus • create</p>
              <div className="mt-4">
                <ThemeSwitcher />
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-amber-950/70 backdrop-blur-sm border-amber-800/30 p-4 rounded-xl">
              <h3 className="text-amber-100 font-serif text-lg mb-3 border-b border-amber-800/30 pb-2">Quick Links</h3>
              <div className="space-y-2">
                <button
                  onClick={handleCoffeeShopSounds}
                  className="flex w-full items-center gap-2 text-amber-200 hover:text-amber-100 transition-colors p-2 rounded-lg hover:bg-amber-800/20"
                >
                  <Coffee className="h-4 w-4" />
                  <span className="font-serif">Coffee Shop Sounds</span>
                </button>
                <button
                  onClick={handleLofiPlaylist}
                  className="flex w-full items-center gap-2 text-amber-200 hover:text-amber-100 transition-colors p-2 rounded-lg hover:bg-amber-800/20"
                >
                  <Music className="h-4 w-4" />
                  <span className="font-serif">Lofi Playlist</span>
                </button>
                <button
                  onClick={handleReadingJournal}
                  className="flex w-full items-center gap-2 text-amber-200 hover:text-amber-100 transition-colors p-2 rounded-lg hover:bg-amber-800/20"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="font-serif">Reading Journal</span>
                </button>
                <button
                  onClick={handleFireplaceAmbience}
                  className="flex w-full items-center gap-2 text-amber-200 hover:text-amber-100 transition-colors p-2 rounded-lg hover:bg-amber-800/20"
                >
                  <Flame className="h-4 w-4" />
                  <span className="font-serif">Fireplace Ambience</span>
                </button>
              </div>
            </div>

            {/* Motivational Quote */}
            {showMotivational && (
              <div className="bg-amber-950/70 backdrop-blur-sm border-amber-800/30 p-4 rounded-xl">
                <MotivationalQuote onClose={() => setShowMotivational(false)} />
              </div>
            )}

            {/* Widget Controls */}
            <div className="bg-amber-950/70 backdrop-blur-sm border-amber-800/30 p-4 rounded-xl">
              <h3 className="text-amber-100 font-serif text-lg mb-3 border-b border-amber-800/30 pb-2">Widgets</h3>
              <WidgetControls
                widgets={widgets}
                onToggleWidget={toggleWidgetVisibility}
                onShowMotivational={() => setShowMotivational(true)}
                showMotivational={showMotivational}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-amber-950/70 backdrop-blur-sm border-amber-800/20 p-6 rounded-xl">
              <WidgetGrid widgets={widgets} onToggleWidget={toggleWidgetVisibility} onSoundToggle={handleSoundToggle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
