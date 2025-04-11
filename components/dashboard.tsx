"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { WidgetType } from "@/types/widget-types";
import { useAppTheme } from "@/components/theme-context";
import Onboarding from "@/components/onboarding";

import DefaultLayout from "@/components/layouts/default-layout";
import CozyLayout from "@/components/layouts/cozy-layout";
import NeonLayout from "@/components/layouts/neon-layout";
import PixelLayout from "@/components/layouts/pixel-layout";
import MinimalLayout from "@/components/layouts/minimal-layout";
import ScifiLayout from "@/components/layouts/scifi-layout";
import CuteLayout from "@/components/layouts/cute-layout";
import { Widget } from "@/types/widget-types";

const defaultWidgets = [
  {
    id: "music-player",
    type: WidgetType.MusicPlayer,
    position: { x: 0, y: 0 },
    visible: true,
  },
  {
    id: "pomodoro",
    type: WidgetType.Pomodoro,
    position: { x: 1, y: 0 },
    visible: true,
  },
  {
    id: "ambient-sounds",
    type: WidgetType.AmbientSounds,
    position: { x: 0, y: 1 },
    visible: false,
  },
  {
    id: "todo-list",
    type: WidgetType.TodoList,
    position: { x: 1, y: 1 },
    visible: false,
  },
  {
    id: "sticky-notes",
    type: WidgetType.StickyNotes,
    position: { x: 0, y: 2 },
    visible: false,
  },
  {
    id: "mini-journal",
    type: WidgetType.MiniJournal,
    position: { x: 1, y: 2 },
    visible: false,
  },
];

export default function Dashboard() {
  const { theme } = useTheme();
  const { theme: appTheme } = useAppTheme();
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({});
  const [showMotivational, setShowMotivational] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("chilled-dev-visited");
    if (!hasVisitedBefore) {
      setShowOnboarding(true);
      localStorage.setItem("chilled-dev-visited", "true");
    }

    const savedWidgets = localStorage.getItem("chilled-dev-widgets");
    if (savedWidgets) {
      try {
        setWidgets(JSON.parse(savedWidgets));
      } catch (e) {
        console.error("Failed to parse widgets from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chilled-dev-widgets", JSON.stringify(widgets));
  }, [widgets]);

  const handleSoundToggle = (id: string, active: boolean) => {
    setActiveSounds((prev) => ({
      ...prev,
      [id]: active,
    }));
  };

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === id ? { ...widget, visible: !widget.visible } : widget
      )
    );
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const renderThemeLayout = () => {
    const layoutProps = {
      widgets,
      activeSounds,
      toggleWidgetVisibility,
      handleSoundToggle,
      showMotivational,
      setShowMotivational,
    };

    switch (appTheme) {
      case "cozy":
        return <CozyLayout {...layoutProps} />;
      case "neon":
        return <NeonLayout {...layoutProps} />;
      case "pixel":
        return <PixelLayout {...layoutProps} />;
      case "minimal":
        return <MinimalLayout {...layoutProps} />;
      case "scifi":
        return <ScifiLayout {...layoutProps} />;
      case "cute":
        return <CuteLayout {...layoutProps} />;
      default:
        return <DefaultLayout {...layoutProps} />;
    }
  };

  return (
    <>
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      {renderThemeLayout()}
    </>
  );
}
