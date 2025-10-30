'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ScenePlan } from '@/types/video';
import { renderScenesToImages } from '@/lib/canvasRenderer';
import { renderVideoFromScenes } from '@/lib/videoRenderer';

interface DownloadPanelProps {
  scenes: ScenePlan[];
  secondsPerScene: number;
  postingTip: string;
}

export function DownloadPanel({ scenes, secondsPerScene, postingTip }: DownloadPanelProps) {
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleRender = useCallback(async () => {
    if (!scenes.length || isRendering) {
      return;
    }

    setIsRendering(true);
    setProgress(0.05);
    setError(null);

    let assets: Awaited<ReturnType<typeof renderScenesToImages>> | null = null;

    try {
      assets = await renderScenesToImages(scenes);
      setProgress(0.4);

      const videoBlob = await renderVideoFromScenes(assets, {
        durationPerSlide: secondsPerScene,
        onProgress: (ratio) => {
          setProgress(0.4 + ratio * 0.6);
        }
      });

      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }

      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
      setProgress(1);
    } catch (renderError) {
      console.error(renderError);
      setError('Something went wrong while rendering. Please try again with a fresh refresh.');
      setProgress(0);
    } finally {
      assets?.forEach((asset) => URL.revokeObjectURL(asset.dataUrl));
      setIsRendering(false);
    }
  }, [isRendering, scenes, secondsPerScene, videoUrl]);

  return (
    <section className="panel" aria-labelledby="render-heading">
      <h2 id="render-heading">Render Faceless Video</h2>
      <p>
        Click once to assemble the vertical slideshow into a Facebook-ready MP4. Rendering happens inside
        your browser using ffmpeg.wasm — no uploads required.
      </p>

      <div className="download-section">
        <button type="button" className="primary-button" onClick={handleRender} disabled={isRendering}>
          {isRendering ? 'Rendering…' : 'Create Video File'}
        </button>

        {isRendering && (
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        )}

        {videoUrl && !isRendering && (
          <div className="download-section" style={{ marginTop: '1rem' }}>
            <video
              src={videoUrl}
              controls
              playsInline
              style={{ borderRadius: '18px', maxWidth: '320px', alignSelf: 'flex-start' }}
            />
            <a className="primary-button" href={videoUrl} download="golden-stories-video.mp4">
              Download MP4
            </a>
            <p className="helper-text">
              Tip: Upload as a vertical 4:5 Facebook post or Reel. {postingTip}
            </p>
          </div>
        )}

        {error && <p className="helper-text" style={{ color: '#b94a48' }}>{error}</p>}
      </div>
    </section>
  );
}
