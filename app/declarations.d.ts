declare module '*.mp3' {
    const src: string;
    export default src;
  }

declare module 'spotify-preview-finder' {
  // Basic type definition for the default function
  export default function SpotifyPreviewFinder(
    trackName: string,
    callback: (err: any, url: string) => void
  ): void;
}
  