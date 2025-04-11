"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import WidgetContainer from "@/components/widgets/widget-container"

// Garantir que a importação do useAppTheme está correta
import { useAppTheme } from "@/components/theme-context"

interface MusicPlayerWidgetProps {
  id: string
  onToggle: () => void
}

interface YouTubeVideo {
  id: string
  title: string
  url: string
}

export default function MusicPlayerWidget({ id, onToggle }: MusicPlayerWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(50)
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [error, setError] = useState("")
  // Adicionar o hook após a linha que contém "const [error, setError] = useState("")"
  const { theme } = useAppTheme()
  const playerRef = useRef<HTMLIFrameElement>(null)
  const [isHovering, setIsHovering] = useState<number | null>(null)

  // Carregar vídeos do localStorage
  useEffect(() => {
    const savedVideos = localStorage.getItem("youtube-videos")
    if (savedVideos) {
      try {
        setVideos(JSON.parse(savedVideos))
      } catch (e) {
        console.error("Failed to parse videos from localStorage")
      }
    }
  }, [])

  // Salvar vídeos no localStorage
  useEffect(() => {
    localStorage.setItem("youtube-videos", JSON.stringify(videos))
  }, [videos])

  // Função para extrair o ID do vídeo do YouTube a partir da URL
  const extractVideoId = (url: string): string | null => {
    // Padrões de URL do YouTube
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/i,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    // Verificar se é uma playlist
    const playlistMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([^&]+)/i)
    if (playlistMatch && playlistMatch[1]) {
      return `videoseries?list=${playlistMatch[1]}`
    }

    return null
  }

  const addVideo = () => {
    if (!newVideoUrl.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    const videoId = extractVideoId(newVideoUrl)
    if (!videoId) {
      setError("Invalid YouTube URL")
      return
    }

    setError("")

    // Adicionar novo vídeo à lista
    const newVideo: YouTubeVideo = {
      id: videoId,
      title: `YouTube Video ${videos.length + 1}`,
      url: newVideoUrl,
    }

    setVideos([...videos, newVideo])
    setNewVideoUrl("")
  }

  const removeVideo = (index: number) => {
    const newVideos = [...videos]
    newVideos.splice(index, 1)
    setVideos(newVideos)

    // Ajustar o índice atual se necessário
    if (currentTrack >= newVideos.length) {
      setCurrentTrack(Math.max(0, newVideos.length - 1))
    }
  }

  const playVideo = (index: number) => {
    setCurrentTrack(index)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)

    // Tentar controlar o player do YouTube via postMessage
    try {
      if (playerRef.current && playerRef.current.contentWindow) {
        const command = isPlaying ? "pauseVideo" : "playVideo"
        playerRef.current.contentWindow.postMessage(`{"event":"command","func":"${command}","args":""}`, "*")
      }
    } catch (e) {
      console.error("Failed to control YouTube player", e)
    }
  }

  const nextTrack = () => {
    if (videos.length === 0) return
    setCurrentTrack((prev) => (prev + 1) % videos.length)
  }

  const prevTrack = () => {
    if (videos.length === 0) return
    setCurrentTrack((prev) => (prev - 1 + videos.length) % videos.length)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])

    // Tentar ajustar o volume do player do YouTube via postMessage
    try {
      if (playerRef.current && playerRef.current.contentWindow) {
        playerRef.current.contentWindow.postMessage(`{"event":"command","func":"setVolume","args":[${value[0]}]}`, "*")
      }
    } catch (e) {
      console.error("Failed to set YouTube volume", e)
    }
  }

  const getCurrentVideoId = (): string => {
    if (videos.length === 0) return ""
    return videos[currentTrack].id
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addVideo()
    }
  }

  return (
    <WidgetContainer id={id} title="YouTube Player" onToggle={onToggle}>
      <div className="space-y-2">
        {/* YouTube Player */}
        <div className="aspect-video w-full bg-black/50 rounded-md overflow-hidden transition-all duration-300 hover:shadow-glow">
          {videos.length > 0 ? (
            <iframe
              ref={playerRef}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${getCurrentVideoId()}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&mute=0&controls=0&modestbranding=1&rel=0&showinfo=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
              Add a YouTube video to start playing
            </div>
          )}
        </div>

        {/* Add Video Form */}
        <div className="flex space-x-1">
          <Input
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste YouTube URL..."
            className="bg-black/30 border-white/10 text-white text-xs h-7 rounded-l-md rounded-r-none focus-visible:ring-purple-500/50 transition-all duration-200"
          />
          <Button
            onClick={addVideo}
            variant="ghost"
            size="icon"
            className="rounded-l-none rounded-r-md bg-purple-500/20 hover:bg-purple-500/30 text-white border border-white/10 border-l-0 h-7 w-7 transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {error && <p className="text-red-400 text-xs animate-pulse">{error}</p>}

        {/* Video List */}
        <div className="max-h-[100px] overflow-y-auto pr-1 space-y-1">
          {videos.length === 0 ? (
            <div
              className={`text-xs ${theme === "cute" ? "text-pink-800" : "text-zinc-400"} text-center py-2 ${theme === "cute" ? "bg-pink-100/50" : "bg-black/20"} rounded-md border ${theme === "cute" ? "border-pink-300/50" : "border-white/5"}`}
            >
              No videos added
            </div>
          ) : (
            videos.map((video, index) => (
              <div
                key={index}
                className={`p-1.5 rounded-md flex justify-between items-center cursor-pointer transition-all duration-200 ${
                  currentTrack === index
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                    : "bg-black/20 hover:bg-black/30 border border-white/5"
                }`}
                onClick={() => playVideo(index)}
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div className="truncate flex-1 mr-1">
                  <p className="font-medium text-xs truncate">{video.title || `Video ${index + 1}`}</p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeVideo(index)
                  }}
                  variant="ghost"
                  size="icon"
                  className={`h-5 w-5 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400 flex-shrink-0 transition-opacity duration-200 ${
                    isHovering === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Trash2 className="h-2.5 w-2.5" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between bg-black/30 p-2 rounded-md border border-white/5">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full text-white hover:bg-white/10 transition-all duration-200"
              onClick={prevTrack}
              disabled={videos.length === 0}
            >
              <SkipBack className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-black/40 text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
              onClick={togglePlayPause}
              disabled={videos.length === 0}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full text-white hover:bg-white/10 transition-all duration-200"
              onClick={nextTrack}
              disabled={videos.length === 0}
            >
              <SkipForward className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-1 w-20">
            <Volume2 className="h-3 w-3 text-white" />
            <Slider value={[volume]} max={100} step={1} onValueChange={handleVolumeChange} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </WidgetContainer>
  )
}
