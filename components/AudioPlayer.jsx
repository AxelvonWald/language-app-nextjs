// components/AudioPlayer.jsx
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AudioPlayer({ path, label = 'Audio' }) {
  const [audioUrl, setAudioUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .from('audio')         // Bucket name
          .createSignedUrl(path, 3600) // path includes full path inside bucket
          
        if (error) {
          throw new Error('Supabase signed URL error')
        }

        setAudioUrl(data.signedUrl)
      } catch (err) {
        console.error('Error loading audio:', err.message)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (path) {
      fetchAudioUrl()
    }
  }, [path])

  if (isLoading) {
    return <div className="text-sm">{label}: Loading audio...</div>
  }

  if (error || !audioUrl) {
    return <div className="text-red-500 text-sm">{label}: Audio unavailable</div>
  }

  return (
    <div className="audio-player my-4">
      <label className="block mb-2 font-medium">{label}</label>
      <audio
        controls
        src={audioUrl}
        className="w-full max-w-md"
        onError={() => console.error('Audio playback failed')}
      >
        Your browser does not support the <code>audio</code> element.
      </audio>
    </div>
  )
}