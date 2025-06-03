// components/AudioPlayer.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function AudioPlayer({ path, label = 'Audio' }) {
  const [audioUrl, setAudioUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        if (!path) {
          throw new Error('No audio path provided')
        }

        const { data, error } = await supabase
          .storage
          .from('audio')
          .createSignedUrl(path, 3600) // 1 hour expiry

        if (error) throw error
        if (!data?.signedUrl) throw new Error('Failed to generate audio URL')

        setAudioUrl(data.signedUrl)
      } catch (err) {
        console.error('Audio loading error:', err.message)
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
  }, [path])

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500">
        {label}: Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        {label}: {error}
      </div>
    )
  }

  return (
    <div className="audio-player my-4">
      <div className="flex items-center justify-between mb-2">
        <label className="font-medium">{label}</label>
        {isPlaying && (
          <span className="text-xs text-green-500">Playing</span>
        )}
      </div>
      <audio
        ref={audioRef}
        controls
        src={audioUrl}
        className="w-full max-w-md"
        onPlay={handlePlay}
        onPause={handlePause}
        onError={() => setError('Audio playback failed')}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}