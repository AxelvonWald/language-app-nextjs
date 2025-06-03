'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'

export default function AudioPlayer({ path, label = 'Audio' }) {
  const supabase = createClient()
  const [audioUrl, setAudioUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        if (!path) return
        
        const { data, error } = await supabase
          .storage
          .from('audio')
          .createSignedUrl(path, 3600) // 1 hour expiry

        if (error) throw error
        setAudioUrl(data?.signedUrl || '')
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAudioUrl()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [path, supabase]) // Added supabase to dependencies

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)

  if (isLoading) return (
    <div className="text-sm text-gray-500">
      {label}: Loading...
    </div>
  )

  if (error) return (
    <div className="text-sm text-red-500">
      {label}: Error loading audio
    </div>
  )

  return (
    <div className="audio-player my-4">
      <label className="block mb-2 font-medium">{label}</label>
      <audio
        ref={audioRef}
        controls
        src={audioUrl}
        className="w-full max-w-md"
        onPlay={handlePlay}
        onPause={handlePause}
        onError={() => setError('Playback failed')}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}