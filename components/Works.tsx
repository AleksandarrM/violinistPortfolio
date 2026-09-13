"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { type WorkTrack } from "@/lib/works";
import TrackList from "./TrackList";

const ViolinScene = dynamic(() => import("./ViolinScene"), { ssr: false });

export default function Works() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [missingAudio, setMissingAudio] = useState(false);

  const playTrack = async (track: WorkTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentId === track.id && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (audio.src !== new URL(track.src, window.location.origin).href) {
      audio.src = track.src;
    }

    setCurrentId(track.id);
    setMissingAudio(false);

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      setMissingAudio(true);
    }
  };

  return (
    <section className="works" id="works">
      <div className="works__model">
        <ViolinScene isPlaying={isPlaying} />
      </div>
      <div>
        <h2 className="works__title">Selected works</h2>
        <TrackList
          currentId={currentId}
          isPlaying={isPlaying}
          onToggle={playTrack}
        />
        {missingAudio ? (
          <p className="works__note">
            Audio files are not added yet. Place MP3s in{" "}
            <code>public/audio/</code> using the paths in{" "}
            <code>lib/works.ts</code>.
          </p>
        ) : null}
        <audio
          ref={audioRef}
          preload="none"
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
            setMissingAudio(true);
          }}
        />
      </div>
    </section>
  );
}
