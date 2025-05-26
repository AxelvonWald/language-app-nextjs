// components/AudioPlayer.jsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AudioPlayer({ path }) {
  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAudioUrl = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .from('audio')
          .createSignedUrl(path, 3600); // 1-hour expiry

        if (error) throw error;
        setAudioUrl(data.signedUrl);
      } finally {
        setIsLoading(false);
      }
    };

    getAudioUrl();
  }, [path]);

  if (isLoading) return <div className="text-sm">Loading audio...</div>;

  return (
    <div className="audio-player">
      <audio
        controls
        src={audioUrl}
        className="w-full max-w-xs"
        onError={(e) => console.error('Playback failed:', e.target.error)}
      />
      <style jsx>{`
        .audio-player {
          min-height: 40px; // Prevents layout shift
        }
      `}</style>
    </div>
  );
}