"use client";
import RainEffect from "@/components/effects/rain-effect";
import ThemeEffects from "@/components/effects/theme-effects";
import Header from "@/components/header";
import WidgetGrid from "@/components/widgets/widget-grid";
import WidgetControls from "@/components/widgets/widget-controls";
import MotivationalQuote from "@/components/widgets/motivational-quote";
import { Widget } from "@/types/widget-types";

interface DefaultLayoutProps {
  widgets: Widget[];
  activeSounds: Record<string, boolean>;
  toggleWidgetVisibility: (widgetId: string) => void;
  handleSoundToggle: (id: string, active: boolean) => void;
  showMotivational: boolean;
  setShowMotivational: (value: boolean) => void;
}

export default function DefaultLayout({
  widgets,
  activeSounds,
  toggleWidgetVisibility,
  handleSoundToggle,
  showMotivational,
  setShowMotivational,
}: DefaultLayoutProps): JSX.Element {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lofi-background.webp')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Theme-specific effects */}
      <ThemeEffects />

      {/* Rain Effect */}
      {activeSounds["rain"] && <RainEffect />}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-4 min-h-screen">
        {/* Header */}
        <Header />

        {/* Motivational Quote */}
        {showMotivational && (
          <div className="mb-6">
            <MotivationalQuote onClose={() => setShowMotivational(false)} />
          </div>
        )}

        {/* Widget Controls - Para reabrir widgets fechados */}
        <WidgetControls
          widgets={widgets}
          onToggleWidget={toggleWidgetVisibility}
          onShowMotivational={() => setShowMotivational(true)}
          showMotivational={showMotivational}
        />

        {/* Widget Grid */}
        <WidgetGrid
          widgets={widgets}
          onToggleWidget={toggleWidgetVisibility}
          onSoundToggle={handleSoundToggle}
        />
      </div>
    </div>
  );
}
