import { tracks, type WorkTrack } from "@/lib/works";

type TrackListProps = {
  currentId: string | null;
  isPlaying: boolean;
  onToggle: (track: WorkTrack) => void;
};

export default function TrackList({
  currentId,
  isPlaying,
  onToggle,
}: TrackListProps) {
  return (
    <div>
      {tracks.map((track) => {
        const active = currentId === track.id;
        return (
          <button
            key={track.id}
            type="button"
            className={`track${active ? " is-active" : ""}`}
            onClick={() => onToggle(track)}
            aria-pressed={active && isPlaying}
          >
            <div className="track__meta">
              <div className="track__title">{track.title}</div>
              <div className="track__label">{track.label}</div>
            </div>
            <div className="waveform" aria-hidden="true">
              {track.waveform.map((height, index) => (
                <span key={index} style={{ height: `${height}px` }} />
              ))}
            </div>
            <span className="track__play">
              {active && isPlaying ? "❚❚" : "▶"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
