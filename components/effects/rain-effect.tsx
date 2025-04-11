"use client"

import { useEffect, useRef, useState } from "react"

interface Raindrop {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  splashed: boolean
  angle: number
  length: number
}

interface Splash {
  x: number
  y: number
  size: number
  opacity: number
  speedX: number
  speedY: number
  gravity: number
}

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
}

interface StreamDrop {
  x: number
  y: number
  length: number
  opacity: number
  speed: number
  maxLength: number
}

export default function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const raindrops = useRef<Raindrop[]>([])
  const splashes = useRef<Splash[]>([])
  const obstacles = useRef<Obstacle[]>([])
  const streams = useRef<StreamDrop[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const angleRef = useRef(-15) // Angle in degrees (negative for right-to-left)

  // Function to detect elements and create obstacles
  const detectObstacles = () => {
    const newObstacles: Obstacle[] = []

    // Selecionar apenas elementos visíveis que devem bloquear a chuva
    // Excluindo explicitamente o header
    const elements = document.querySelectorAll(
      '.widget-container, .card:not(.invisible):not([style*="display: none"]):not(.header-element)',
    )

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(element)

      // Verificar se o elemento é realmente visível
      if (
        rect.width > 0 &&
        rect.height > 0 &&
        computedStyle.display !== "none" &&
        computedStyle.visibility !== "hidden" &&
        computedStyle.opacity !== "0"
      ) {
        // Adicionar uma margem negativa para evitar efeitos estranhos nas bordas
        newObstacles.push({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        })
      }
    })

    obstacles.current = newObstacles
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      detectObstacles() // Re-detect obstacles when dimensions change
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Initialize raindrops
    const initRaindrops = () => {
      raindrops.current = []
      for (let i = 0; i < 400; i++) {
        createRaindrop()
      }
      setIsInitialized(true)
    }

    const createRaindrop = () => {
      const angle = angleRef.current + (Math.random() * 5 - 2.5) // Slight variation in angle
      const size = Math.random() * 1.5 + 0.5
      const length = size * (7 + Math.random() * 3) // Vary length based on size

      // Velocidade ligeiramente aumentada para melhor efeito visual
      const speed = Math.random() * 7 + 5

      raindrops.current.push({
        x: Math.random() * (canvas.width + 200) - 100, // Start slightly off-screen
        y: Math.random() * -canvas.height,
        size,
        speed,
        opacity: Math.random() * 0.4 + 0.3,
        splashed: false,
        angle,
        length,
      })
    }

    const createSplash = (x: number, y: number, size: number) => {
      // Create multiple splash particles for more realism
      const particleCount = Math.floor(Math.random() * 3) + 2

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 1 + 0.5 // Reduced splash speed

        splashes.current.push({
          x,
          y,
          size: Math.random() * size + size * 0.5,
          opacity: 0.7 + Math.random() * 0.3,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed - 0.5, // Reduced initial upward velocity
          gravity: 0.05 + Math.random() * 0.03, // Reduced gravity
        })
      }
    }

    const createStream = (x: number, y: number, obstacle: Obstacle) => {
      // Create a stream that flows down from the collision point
      if (Math.random() > 0.7) {
        // Only create streams sometimes
        const maxLength = 5 + Math.random() * 15
        streams.current.push({
          x,
          y,
          length: 0,
          opacity: 0.3 + Math.random() * 0.4,
          speed: 0.5 + Math.random() * 1, // Reduced stream speed
          maxLength,
        })
      }
    }

    // Check if a raindrop collides with any obstacle
    const checkCollision = (drop: Raindrop): { collides: boolean; y: number; x: number; obstacle: Obstacle | null } => {
      // Calculate the end point of the raindrop based on its angle
      const angleRad = (drop.angle * Math.PI) / 180
      const endX = drop.x + Math.sin(angleRad) * drop.length
      const endY = drop.y + Math.cos(angleRad) * drop.length

      for (const obstacle of obstacles.current) {
        // Check if any part of the raindrop line intersects with the obstacle
        // Simple line-rectangle intersection
        if (lineRectIntersection(drop.x, drop.y, endX, endY, obstacle)) {
          // Calculate approximate collision point
          // This is a simplification - for more accuracy, you'd calculate the exact intersection point
          const collisionX = drop.x + (Math.sin(angleRad) * (obstacle.y - drop.y)) / Math.cos(angleRad)

          return {
            collides: true,
            y: obstacle.y,
            x: collisionX,
            obstacle,
          }
        }
      }
      return { collides: false, y: 0, x: 0, obstacle: null }
    }

    // Helper function to check if a line intersects with a rectangle
    const lineRectIntersection = (x1: number, y1: number, x2: number, y2: number, rect: Obstacle): boolean => {
      // Check if either end of the line is inside the rectangle
      if (pointInRect(x1, y1, rect) || pointInRect(x2, y2, rect)) {
        return true
      }

      // Check if the line intersects any of the rectangle's edges
      const rectLines = [
        { x1: rect.x, y1: rect.y, x2: rect.x + rect.width, y2: rect.y }, // top
        { x1: rect.x, y1: rect.y + rect.height, x2: rect.x + rect.width, y2: rect.y + rect.height }, // bottom
        { x1: rect.x, y1: rect.y, x2: rect.x, y2: rect.y + rect.height }, // left
        { x1: rect.x + rect.width, y1: rect.y, x2: rect.x + rect.width, y2: rect.y + rect.height }, // right
      ]

      for (const line of rectLines) {
        if (lineIntersection(x1, y1, x2, y2, line.x1, line.y1, line.x2, line.y2)) {
          return true
        }
      }

      return false
    }

    // Helper function to check if a point is inside a rectangle
    const pointInRect = (x: number, y: number, rect: Obstacle): boolean => {
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height
    }

    // Helper function to check if two line segments intersect
    const lineIntersection = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number,
      x4: number,
      y4: number,
    ): boolean => {
      // Calculate the direction of the lines
      const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
      const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

      // If uA and uB are between 0-1, lines are colliding
      return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1
    }

    // Detect obstacles initially
    detectObstacles()

    // Set up a mutation observer to detect DOM changes
    const observer = new MutationObserver(() => {
      detectObstacles()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    })

    initRaindrops()

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Re-detect obstacles periodically
      if (isInitialized && raindrops.current.length % 60 === 0) {
        detectObstacles()
      }

      // Update and draw raindrops
      for (let i = 0; i < raindrops.current.length; i++) {
        const drop = raindrops.current[i]
        const angleRad = (drop.angle * Math.PI) / 180

        // Update position with angle
        drop.x += Math.sin(angleRad) * drop.speed
        drop.y += Math.cos(angleRad) * drop.speed

        // Check for collisions with obstacles
        const collision = checkCollision(drop)

        if (collision.collides && !drop.splashed) {
          // Create splash at the collision point
          createSplash(collision.x, collision.y, drop.size)

          // Create stream flowing down the obstacle
          if (collision.obstacle) {
            createStream(collision.x, collision.y, collision.obstacle)
          }

          drop.splashed = true

          // Reset raindrop
          drop.y = Math.random() * -100
          drop.x = Math.random() * (canvas.width + 200) - 100
          drop.splashed = false
          drop.angle = angleRef.current + (Math.random() * 5 - 2.5)
        }
        // Check if raindrop hit bottom
        else if (drop.y > canvas.height && !drop.splashed) {
          drop.splashed = true
          createSplash(drop.x, canvas.height, drop.size)

          // Reset raindrop
          drop.y = Math.random() * -100
          drop.x = Math.random() * (canvas.width + 200) - 100
          drop.splashed = false
          drop.angle = angleRef.current + (Math.random() * 5 - 2.5)
        }

        // Draw raindrop as a line with angle
        const endX = drop.x + Math.sin(angleRad) * drop.length
        const endY = drop.y + Math.cos(angleRad) * drop.length

        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = `rgba(180, 220, 255, ${drop.opacity})`
        ctx.lineWidth = drop.size
        ctx.stroke()
      }

      // Update and draw splashes
      for (let i = splashes.current.length - 1; i >= 0; i--) {
        const splash = splashes.current[i]

        // Update splash position with physics
        splash.x += splash.speedX
        splash.y += splash.speedY
        splash.speedY += splash.gravity // Apply gravity

        // Draw splash
        ctx.beginPath()
        ctx.arc(splash.x, splash.y, splash.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 220, 255, ${splash.opacity})`
        ctx.fill()

        // Fade out splash
        splash.opacity -= 0.02 // Slower fade
        splash.size -= 0.05 // Slower shrink

        // Remove faded splashes
        if (splash.opacity <= 0 || splash.size <= 0) {
          splashes.current.splice(i, 1)
        }
      }

      // Update and draw streams
      for (let i = streams.current.length - 1; i >= 0; i--) {
        const stream = streams.current[i]

        // Grow the stream
        if (stream.length < stream.maxLength) {
          stream.length += stream.speed
        } else {
          // Start fading when max length is reached
          stream.opacity -= 0.01 // Slower fade
        }

        // Draw stream as a vertical line
        ctx.beginPath()
        ctx.moveTo(stream.x, stream.y)
        ctx.lineTo(stream.x, stream.y + stream.length)
        ctx.strokeStyle = `rgba(180, 220, 255, ${stream.opacity})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Remove faded streams
        if (stream.opacity <= 0) {
          streams.current.splice(i, 1)
        }
      }

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      observer.disconnect()
    }
  }, [isInitialized])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-20 pointer-events-none" style={{ mixBlendMode: "screen" }} />
  )
}
