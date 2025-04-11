"use client"
import RainEffect from "@/components/effects/rain-effect"
import ThemeEffects from "@/components/effects/theme-effects"
import ThemeSwitcher from "@/components/theme-switcher"
import WidgetGrid from "@/components/widgets/widget-grid"
import WidgetControls from "@/components/widgets/widget-controls"
import MotivationalQuote from "@/components/widgets/motivational-quote"
import { Heart, Star, Music, Cloud } from "lucide-react"

export default function CuteLayout({
  widgets,
  activeSounds,
  toggleWidgetVisibility,
  handleSoundToggle,
  showMotivational,
  setShowMotivational,
}) {
  // Funções para os quick links
  const handleCutePlaylist = () => {
    handleSoundToggle("lofi", true)
    // Abrir o widget de música se estiver fechado
    const musicWidget = widgets.find((w) => w.id === "music-player")
    if (musicWidget && !musicWidget.visible) {
      toggleWidgetVisibility("music-player")
    }
  }

  const handleStickers = () => {
    // Abrir o widget de notas se estiver fechado
    const notesWidget = widgets.find((w) => w.id === "sticky-notes")
    if (notesWidget && !notesWidget.visible) {
      toggleWidgetVisibility("sticky-notes")
    }
  }

  const handleDreamySounds = () => {
    handleSoundToggle("birds", true)
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
            backgroundImage: "url('/themes/cute-background.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100/30 to-pink-300/40" />
      </div>

      {/* Theme-specific effects */}
      <ThemeEffects />

      {/* Rain Effect */}
      {activeSounds["rain"] && <RainEffect />}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
        {/* Header */}
        <div className="flex justify-center items-center mb-8">
          <div className="text-center relative cute-header bg-pink-100/90 backdrop-blur-sm border-2 border-pink-300 p-6 rounded-xl">
            <h1 className="text-4xl font-bold mb-2 text-pink-800 cute-text">
              Kawaii Focus <span className="cute-emoji ml-2">✨</span>
            </h1>
            <p className="text-pink-600">relax • enjoy • create</p>
            <div className="absolute right-4 top-4 z-20">
              <ThemeSwitcher />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="space-y-4">
              {/* Quick Links */}
              <div className="cute-widget bg-pink-100/90 backdrop-blur-sm border-2 border-pink-300 p-4 rounded-xl">
                <h3 className="text-pink-800 font-medium text-lg mb-3 border-b-2 border-pink-300 pb-2 flex items-center">
                  <Heart className="h-4 w-4 text-pink-500 mr-2" />
                  Favorites
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleCutePlaylist}
                    className="flex w-full items-center gap-2 text-pink-700 hover:text-pink-900 transition-colors p-2 rounded-lg hover:bg-pink-200"
                  >
                    <Music className="h-4 w-4 text-pink-500" />
                    <span>Cute Playlist</span>
                  </button>
                  <button
                    onClick={handleStickers}
                    className="flex w-full items-center gap-2 text-pink-700 hover:text-pink-900 transition-colors p-2 rounded-lg hover:bg-pink-200"
                  >
                    <Star className="h-4 w-4 text-pink-500" />
                    <span>Stickers</span>
                  </button>
                  <button
                    onClick={handleDreamySounds}
                    className="flex w-full items-center gap-2 text-pink-700 hover:text-pink-900 transition-colors p-2 rounded-lg hover:bg-pink-200"
                  >
                    <Cloud className="h-4 w-4 text-pink-500" />
                    <span>Dreamy Sounds</span>
                  </button>
                </div>
              </div>

              {/* Motivational Quote */}
              {showMotivational && (
                <div className="cute-widget bg-pink-100/90 backdrop-blur-sm border-2 border-pink-300 p-4 rounded-xl">
                  <MotivationalQuote onClose={() => setShowMotivational(false)} />
                </div>
              )}

              {/* Widget Controls */}
              <div className="cute-widget bg-pink-100/90 backdrop-blur-sm border-2 border-pink-300 p-4 rounded-xl">
                <h3 className="text-pink-800 font-medium text-lg mb-3 border-b-2 border-pink-300 pb-2 flex items-center">
                  <Star className="h-4 w-4 text-pink-500 mr-2" />
                  Widgets
                </h3>
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
          <div className="md:col-span-3">
            <div className="cute-widget bg-pink-100/90 backdrop-blur-sm border-2 border-pink-300 p-6 rounded-xl">
              <WidgetGrid widgets={widgets} onToggleWidget={toggleWidgetVisibility} onSoundToggle={handleSoundToggle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
