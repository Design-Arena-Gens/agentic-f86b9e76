'use client';

import type { ScenePlan } from '@/types/video';

interface PreviewCarouselProps {
  scenes: ScenePlan[];
  activeIndex: number;
  hook: string;
  soundtrack: string;
  onAdvance?: (index: number) => void;
}

export function PreviewCarousel({
  scenes,
  activeIndex,
  hook,
  soundtrack,
  onAdvance
}: PreviewCarouselProps) {
  if (!scenes?.length) {
    return null;
  }

  const activeScene = scenes[activeIndex % scenes.length];

  const handleAdvance = () => {
    const nextIndex = (activeIndex + 1) % scenes.length;
    onAdvance?.(nextIndex);
  };

  return (
    <section className="panel" aria-labelledby="preview-heading">
      <div className="utility-grid" style={{ alignItems: 'start' }}>
        <div>
          <h2 id="preview-heading">Animated Preview</h2>
          <p>
            Each slide is designed with large, high-contrast typography, gentle gradients, and pacing
            tailored for older viewers. The preview loops softly to mimic the final MP4 output.
          </p>
          <div className="pill" style={{ marginTop: '0.75rem' }}>
            Suggested soundtrack: {soundtrack}
          </div>
          <p className="helper-text" style={{ marginTop: '1.25rem' }}>
            Hook to highlight in your caption: <strong>{hook}</strong>
          </p>
        </div>

        <div className="video-preview" role="presentation">
          <div
            className="preview-stage"
            onClick={handleAdvance}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleAdvance();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Advance preview"
          >
            <div className="preview-transition">
              <div className="pill" style={{ alignSelf: 'center' }}>
                Scene {activeIndex + 1} of {scenes.length}
              </div>
              <div className="preview-title">{activeScene.title}</div>
              <div className="preview-subtitle">{activeScene.mainText}</div>
              <div className="preview-subtitle" style={{ fontSize: '1.05rem' }}>
                {activeScene.subtitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
