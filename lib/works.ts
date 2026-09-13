export type WorkTrack = {
  id: string;
  title: string;
  label: string;
  src: string;
  waveform: number[];
};

export const tracks: WorkTrack[] = [
  {
    id: "nocturne",
    title: "Nocturne in Lorem",
    label: "Recording 01",
    src: "/audio/violin1.mp3",
    waveform: [6, 14, 9, 18, 7],
  },
  {
    id: "suite",
    title: "Ipsum Suite No. 2",
    label: "Recording 02",
    src: "/audio/violin2.mp3",
    waveform: [10, 16, 6, 12, 8],
  },
  {
    id: "concerto",
    title: "Dolor Concerto",
    label: "Recording 03",
    src: "/audio/violin2.mp3",
    waveform: [8, 12, 17, 9, 6],
  },
];
