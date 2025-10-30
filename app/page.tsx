'use client';

import { useEffect, useMemo, useState } from 'react';
import { DownloadPanel } from '@/components/DownloadPanel';
import { PreviewCarousel } from '@/components/PreviewCarousel';
import { SceneList } from '@/components/SceneList';
import { VideoForm } from '@/components/VideoForm';
import { generateVideoPlan } from '@/lib/contentGenerator';
import type { VideoPlan, VideoPreferences } from '@/types/video';

const pacingRotationMs: Record<VideoPreferences['pacing'], number> = {
  gentle: 9000,
  steady: 7000,
  brisk: 5500
};

const pacingSecondsPerScene: Record<VideoPreferences['pacing'], number> = {
  gentle: 7,
  steady: 6,
  brisk: 5
};

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState<VideoPreferences | null>(null);
  const [plan, setPlan] = useState<VideoPlan | null>(null);
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    if (!plan) {
      return undefined;
    }

    const rotationDuration = pacingRotationMs[preferences?.pacing ?? 'gentle'];
    const interval = window.setInterval(() => {
      setActiveScene((prev) => {
        if (!plan.scenes.length) return prev;
        return (prev + 1) % plan.scenes.length;
      });
    }, rotationDuration);

    return () => {
      window.clearInterval(interval);
    };
  }, [plan, preferences?.pacing]);

  const secondsPerScene = useMemo(() => {
    if (!preferences) {
      return pacingSecondsPerScene.gentle;
    }
    return pacingSecondsPerScene[preferences.pacing];
  }, [preferences]);

  const handleGenerate = async (prefs: VideoPreferences) => {
    setIsGenerating(true);
    try {
      const generatedPlan = generateVideoPlan(prefs);
      setPreferences(prefs);
      setPlan(generatedPlan);
      setActiveScene(0);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="page-flow">
      <VideoForm onGenerate={handleGenerate} generating={isGenerating} />

      {plan && preferences && (
        <>
          <section className="panel" aria-labelledby="plan-overview-heading">
            <h2 id="plan-overview-heading">Story Overview</h2>
            <div className="utility-grid">
              <div>
                <h3 style={{ marginTop: 0, fontSize: '1.4rem', color: '#4f3827' }}>{plan.headline}</h3>
                <p>{plan.summary}</p>
                <p className="helper-text">{plan.outro}</p>
              </div>
              <div>
                <div className="pill">Delivery pace: {preferences.pacing}</div>
                <div className="pill" style={{ marginTop: '0.75rem' }}>
                  Duration setting: {preferences.duration}
                </div>
                {preferences.callToAction && (
                  <p className="helper-text" style={{ marginTop: '1rem' }}>
                    CTA emphasis: {preferences.callToAction}
                  </p>
                )}
              </div>
            </div>
          </section>

          <PreviewCarousel
            scenes={plan.scenes}
            activeIndex={activeScene}
            hook={plan.hook}
            soundtrack={plan.soundtrack}
            onAdvance={setActiveScene}
          />

          <SceneList scenes={plan.scenes} activeSceneId={plan.scenes[activeScene]?.id} />

          <DownloadPanel
            scenes={plan.scenes}
            secondsPerScene={secondsPerScene}
            postingTip={plan.postingTip}
          />
        </>
      )}
    </div>
  );
}
