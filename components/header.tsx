"use client";
import { useState, useEffect } from "react";
import ThemeSwitcher from "@/components/theme-switcher";
import { useAppTheme } from "@/components/theme-context";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isFlickering, setIsFlickering] = useState(false);
  const { theme } = useAppTheme();

  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsFlickering(true);
        setTimeout(() => setIsFlickering(false), 100 + Math.random() * 150);
      }
    }, 2000);

    return () => clearInterval(flickerInterval);
  }, []);

  const renderThemeHeader = () => {
    switch (theme) {
      case "cozy":
        return (
          <div className="flex justify-center items-center mb-8 header-element animate-fade-in">
            <div className="text-center relative">
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-2 text-amber-100">
                Cozy Space
              </h1>
              <p className="text-amber-200/80 font-serif">
                relax • focus • create
              </p>
              <div className="absolute -right-16 top-2">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        );

      case "neon":
        return (
          <div className="flex justify-between items-center mb-6 header-element animate-fade-in">
            <div className="flex-1 text-center relative">
              <h1
                className={cn(
                  "text-5xl md:text-6xl font-mono font-bold mb-1 tracking-wider text-cyan-300 neon-text",
                  isFlickering && "neon-flicker"
                )}
              >
                CYBER FOCUS
              </h1>
              <p className="text-cyan-400/80 font-mono">
                connect • hack • create
              </p>
              <div className="absolute right-4 top-4">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        );

      case "pixel":
        return (
          <div className="flex justify-center items-center mb-8 header-element animate-fade-in">
            <div className="text-center relative pixel-border p-4">
              <h1 className="text-5xl md:text-6xl font-mono uppercase tracking-widest text-white pixel-text">
                PIXEL MODE
              </h1>
              <p className="text-indigo-300 font-mono uppercase mt-2">
                play • win • create
              </p>
              <div className="absolute right-4 top-4">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div className="flex justify-between items-center mb-12 header-element animate-fade-in">
            <div className="flex-1 flex justify-between items-center">
              <div />
              <div className="text-center">
                <h1 className="text-4xl font-light tracking-widest text-zinc-100 uppercase">
                  Focus
                </h1>
                <div className="h-px w-24 bg-zinc-700 mx-auto my-4" />
                <p className="text-zinc-500 font-light text-xs tracking-wider uppercase">
                  minimal experience
                </p>
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        );

      case "scifi":
        return (
          <div className="flex justify-between items-center mb-6 header-element animate-fade-in">
            <div className="flex-1 text-center relative">
              <div className="scifi-header-decoration" />
              <h1 className="text-5xl md:text-6xl font-mono uppercase tracking-widest text-blue-100 scifi-text">
                QUANTUM FOCUS
              </h1>
              <p className="text-blue-300 font-mono">
                analyze • optimize • create
              </p>
              <div className="absolute right-4 top-4">
                <ThemeSwitcher />
              </div>
              <div className="scifi-header-decoration-2" />
            </div>
          </div>
        );

      case "cute":
        return (
          <div className="flex justify-center items-center mb-8 header-element animate-fade-in">
            <div className="text-center relative cute-header">
              <h1 className="text-5xl md:text-6xl font-bold mb-2 text-pink-100 cute-text">
                Cute Focus<span className="cute-emoji">✨</span>
              </h1>
              <p className="text-pink-200">relax • enjoy • create</p>
              <div className="absolute -right-16 top-2">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex justify-between items-center mb-6 header-element animate-fade-in">
            <div className="flex-1 text-center relative">
              <h1
                className={cn(
                  "text-5xl md:text-6xl font-bold mb-1 transition-all duration-100 theme-title",
                  isFlickering && "theme-title-flicker"
                )}
              >
                FOCUS MODE
              </h1>
              <p className="text-zinc-400 text-sm theme-subtitle">
                relax • focus • create
              </p>
              <div className="absolute right-4 top-4">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        );
    }
  };

  return renderThemeHeader();
}
