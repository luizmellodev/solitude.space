"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Clock, CloudRain, CheckSquare, Paintbrush } from "lucide-react";
import { useAppTheme } from "@/components/theme-context";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const { theme, setTheme } = useAppTheme();
  const [isExiting, setIsExiting] = useState(false);

  const steps = [
    {
      title: "Welcome to Solitude",
      description:
        "Your perfect companion for focused and productive work sessions.",
      icon: <Music className="h-12 w-12 text-purple-400" />,
    },
    {
      title: "YouTube Player",
      description:
        "Play your favorite YouTube videos or lofi music while you work.",
      icon: <Music className="h-12 w-12 text-purple-400" />,
    },
    {
      title: "Pomodoro Timer",
      description:
        "Stay focused with the Pomodoro technique - work in focused sprints with short breaks.",
      icon: <Clock className="h-12 w-12 text-red-400" />,
    },
    {
      title: "Ambient Sounds",
      description:
        "Enhance your focus with ambient sounds like rain, coffee shop, or nature.",
      icon: <CloudRain className="h-12 w-12 text-blue-400" />,
    },
    {
      title: "Productivity Tools",
      description:
        "Use to-do lists, sticky notes, and a mini journal to organize your thoughts.",
      icon: <CheckSquare className="h-12 w-12 text-green-400" />,
    },
    {
      title: "Choose Your Theme",
      description: "Personalize your experience with different visual themes.",
      icon: <Paintbrush className="h-12 w-12 text-pink-400" />,
      showThemes: true,
    },
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
  };

  const themes = [
    { id: "default", name: "Default", icon: "🌙" },
    { id: "cozy", name: "Cozy", icon: "🏡" },
    { id: "neon", name: "Neon", icon: "💫" },
    { id: "pixel", name: "Pixel", icon: "👾" },
    { id: "minimal", name: "Minimal", icon: "◽" },
    { id: "scifi", name: "Sci-Fi", icon: "🚀" },
    { id: "cute", name: "Cute", icon: "🌸" },
  ];

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="bg-zinc-900/90 backdrop-blur-xl border border-purple-500/20 rounded-xl p-8 max-w-md w-full shadow-xl"
          >
            <div className="text-center mb-6">
              <motion.div
                key={`icon-${step}`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="flex justify-center mb-4"
              >
                {steps[step].icon}
              </motion.div>
              <motion.h2
                key={`title-${step}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
              >
                {steps[step].title}
              </motion.h2>
              <motion.p
                key={`desc-${step}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-300"
              >
                {steps[step].description}
              </motion.p>
            </div>

            {steps[step].showThemes && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-2 mb-6"
              >
                {themes.map((item) => (
                  <Button
                    key={item.id}
                    variant="outline"
                    className={`flex flex-col items-center p-3 h-auto ${
                      theme === item.id
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-zinc-700 bg-zinc-800/50"
                    }`}
                    onClick={() => handleThemeChange(item.id)}
                  >
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className="text-xs">{item.name}</span>
                  </Button>
                ))}
              </motion.div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={step === 0}
                className="text-zinc-400 hover:text-white"
              >
                {step > 0 ? "Back" : ""}
              </Button>
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 w-6 rounded-full ${
                      index === step ? "bg-purple-500" : "bg-zinc-700"
                    } transition-all duration-300`}
                  />
                ))}
              </div>
              <Button
                variant="default"
                onClick={nextStep}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {step < steps.length - 1 ? "Next" : "Get Started"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
