"use client"

import { useRef, useEffect } from "react"

interface VisualizerProps {
  isPlaying: boolean
}

export default function Visualizer({ isPlaying }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, "#9333ea") // purple-600
    gradient.addColorStop(1, "#ec4899") // pink-500

    // Animation variables
    const bars = 60
    const barWidth = canvas.width / bars
    const barHeights: number[] = Array(bars).fill(0)
    const maxBarHeight = canvas.height * 0.8

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update bar heights with smooth transitions
      for (let i = 0; i < bars; i++) {
        if (isPlaying) {
          // Generate random heights when playing
          const targetHeight = Math.random() * maxBarHeight
          // Smooth transition
          barHeights[i] = barHeights[i] + (targetHeight - barHeights[i]) * 0.1
        } else {
          // When paused, gradually reduce heights
          barHeights[i] = Math.max(0, barHeights[i] * 0.95)
        }

        // Draw bar
        ctx.fillStyle = gradient
        const x = i * (barWidth + 1)
        const height = barHeights[i]
        const y = (canvas.height - height) / 2

        // Rounded bars
        const radius = barWidth / 2
        ctx.beginPath()
        ctx.moveTo(x, y + radius)
        ctx.lineTo(x, y + height - radius)
        ctx.arcTo(x, y + height, x + radius, y + height, radius)
        ctx.lineTo(x + barWidth - radius, y + height)
        ctx.arcTo(x + barWidth, y + height, x + barWidth, y + height - radius, radius)
        ctx.lineTo(x + barWidth, y + radius)
        ctx.arcTo(x + barWidth, y, x + barWidth - radius, y, radius)
        ctx.lineTo(x + radius, y)
        ctx.arcTo(x, y, x, y + radius, radius)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [isPlaying])

  return <canvas ref={canvasRef} className="w-full h-32 rounded-lg bg-zinc-900/50" />
}
