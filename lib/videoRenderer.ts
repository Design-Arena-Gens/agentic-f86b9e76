'use client';

import type { SceneImageAsset } from './canvasRenderer';

type FFmpegInstance = {
  isLoaded: () => boolean;
  load: () => Promise<void>;
  FS: (method: string, ...args: any[]) => any;
  run: (...args: string[]) => Promise<void>;
};

let ffmpegInstance: FFmpegInstance | null = null;

const CORE_PATH = 'https://unpkg.com/@ffmpeg/core@0.12.9/dist/ffmpeg-core.js';

async function getFFmpeg(onProgress?: (ratio: number) => void): Promise<FFmpegInstance> {
  if (!ffmpegInstance) {
    const ffmpegModule = (await import('@ffmpeg/ffmpeg')) as any;
    const createFFmpeg = ffmpegModule.createFFmpeg ?? ffmpegModule.default;
    ffmpegInstance = createFFmpeg({
      corePath: CORE_PATH,
      log: false,
      progress: ({ ratio }: { ratio: number }) => {
        if (typeof onProgress === 'function') {
          onProgress(Math.min(Math.max(ratio, 0), 1));
        }
      }
    });
  }

  if (!ffmpegInstance) {
    throw new Error('Unable to initialize FFmpeg.');
  }

  if (!ffmpegInstance.isLoaded()) {
    await ffmpegInstance.load();
  }

  return ffmpegInstance;
}

export interface VideoRenderOptions {
  durationPerSlide: number;
  onProgress?: (ratio: number) => void;
}

export async function renderVideoFromScenes(
  assets: SceneImageAsset[],
  options: VideoRenderOptions
): Promise<Blob> {
  if (!assets.length) {
    throw new Error('No scenes available to render.');
  }

  const ffmpeg = await getFFmpeg(options.onProgress);

  assets.forEach((asset) => {
    ffmpeg.FS('writeFile', asset.filename, asset.data);
  });

  const concatScriptLines: string[] = [];
  assets.forEach((asset) => {
    concatScriptLines.push(`file '${asset.filename}'`);
    concatScriptLines.push(`duration ${options.durationPerSlide.toFixed(2)}`);
  });
  // Repeat last frame to signal ending
  concatScriptLines.push(`file '${assets[assets.length - 1].filename}'`);

  const encoder = new TextEncoder();
  ffmpeg.FS('writeFile', 'input.txt', encoder.encode(concatScriptLines.join('\n')));

  await ffmpeg.run(
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    'input.txt',
    '-vsync',
    'vfr',
    '-pix_fmt',
    'yuv420p',
    '-vf',
    'fps=30',
    '-movflags',
    '+faststart',
    'output.mp4'
  );

  const data = ffmpeg.FS('readFile', 'output.mp4');
  return new Blob([data.buffer], { type: 'video/mp4' });
}
