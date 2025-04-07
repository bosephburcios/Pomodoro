import { NextResponse } from 'next/server';

export async function GET() {
  // Deezer’s public “Jazz Classics” playlist ID
  const playlistId = '11702336744';

  const res = await fetch(`https://api.deezer.com/playlist/${playlistId}`);
  const data = await res.json();

  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 404 });
  }

  // Extract only name + preview clip, forcing HTTPS on preview URLs
  const tracks = data.tracks.data.map((track: any) => ({
    name: track.title,
    preview_url: track.preview ? track.preview.replace(/^http:\/\//, 'https://') : null
  })).filter((t: any) => t.preview_url);

  return NextResponse.json({ tracks });
}
