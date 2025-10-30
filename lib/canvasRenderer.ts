'use client';

import type { ScenePlan } from '@/types/video';

export interface SceneImageAsset {
  id: string;
  filename: string;
  data: Uint8Array;
  dataUrl: string;
}

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;

function createCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  return canvas;
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n += 1) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      context.fillText(line.trim(), x, currentY);
      line = `${words[n]} `;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line.trim()) {
    context.fillText(line.trim(), x, currentY);
    currentY += lineHeight;
  }

  return currentY;
}

async function canvasToAsset(canvas: HTMLCanvasElement, id: string, index: number): Promise<SceneImageAsset> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to export canvas to image.'));
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          resolve({
            id,
            filename: `slide_${index.toString().padStart(2, '0')}.png`,
            data: new Uint8Array(arrayBuffer),
            dataUrl: URL.createObjectURL(blob)
          });
        };
        reader.readAsArrayBuffer(blob);
      },
      'image/png',
      0.92
    );
  });
}

export async function renderScenesToImages(scenes: ScenePlan[]): Promise<SceneImageAsset[]> {
  const assets: SceneImageAsset[] = [];

  for (let index = 0; index < scenes.length; index += 1) {
    const scene = scenes[index];
    const canvas = createCanvas();
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Unable to create drawing context.');
    }

    // Background gradient
    const gradient = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gradient.addColorStop(0, scene.palette.start);
    gradient.addColorStop(1, scene.palette.end);
    context.fillStyle = gradient;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Accent overlay
    context.fillStyle = `${scene.palette.accent}33`;
    context.beginPath();
    context.ellipse(CANVAS_WIDTH * 0.55, CANVAS_HEIGHT * 0.25, 280, 140, 0.2, 0, Math.PI * 2);
    context.fill();

    // Title
    context.fillStyle = scene.palette.text;
    context.font = 'bold 64px "Segoe UI", system-ui';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    const titleY = wrapText(context, scene.title, 120, 120, CANVAS_WIDTH - 240, 70);

    // Main text
    context.font = '600 58px "Segoe UI", system-ui';
    const bodyYStart = titleY + 40;
    const bodyY = wrapText(context, scene.mainText, 120, bodyYStart, CANVAS_WIDTH - 240, 66);

    // Subtitle
    context.fillStyle = scene.palette.subtitle;
    context.font = 'normal 44px "Segoe UI", system-ui';
    const subtitleY = wrapText(context, scene.subtitle, 120, bodyY + 30, CANVAS_WIDTH - 240, 54);

    // Tip footer
    context.fillStyle = `${scene.palette.text}cc`;
    context.font = 'italic 38px "Segoe UI", system-ui';
    wrapText(context, scene.tip, 120, Math.max(subtitleY + 40, CANVAS_HEIGHT - 260), CANVAS_WIDTH - 240, 50);

    // Voice over helper bubble
    const bubbleWidth = CANVAS_WIDTH - 240;
    const bubbleX = 120;
    const bubbleY = CANVAS_HEIGHT - 210;
    const bubbleRadius = 26;
    context.fillStyle = `${scene.palette.accent}1f`;
    context.beginPath();
    context.moveTo(bubbleX + bubbleRadius, bubbleY);
    context.lineTo(bubbleX + bubbleWidth - bubbleRadius, bubbleY);
    context.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + bubbleRadius);
    context.lineTo(bubbleX + bubbleWidth, bubbleY + 120 - bubbleRadius);
    context.quadraticCurveTo(
      bubbleX + bubbleWidth,
      bubbleY + 120,
      bubbleX + bubbleWidth - bubbleRadius,
      bubbleY + 120
    );
    context.lineTo(bubbleX + bubbleRadius, bubbleY + 120);
    context.quadraticCurveTo(bubbleX, bubbleY + 120, bubbleX, bubbleY + 120 - bubbleRadius);
    context.lineTo(bubbleX, bubbleY + bubbleRadius);
    context.quadraticCurveTo(bubbleX, bubbleY, bubbleX + bubbleRadius, bubbleY);
    context.closePath();
    context.fill();

    context.fillStyle = scene.palette.text;
    context.font = '500 40px "Segoe UI", system-ui';
    wrapText(context, scene.voiceOver, bubbleX + 28, bubbleY + 24, bubbleWidth - 56, 48);

    const asset = await canvasToAsset(canvas, scene.id, index);
    assets.push(asset);
  }

  return assets;
}
