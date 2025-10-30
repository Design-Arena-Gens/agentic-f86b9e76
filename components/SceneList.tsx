'use client';

import clsx from 'clsx';
import type { ScenePlan } from '@/types/video';

interface SceneListProps {
  scenes: ScenePlan[];
  activeSceneId?: string;
}

export function SceneList({ scenes, activeSceneId }: SceneListProps) {
  if (!scenes?.length) {
    return null;
  }

  return (
    <section className="panel" aria-labelledby="scene-plan-heading">
      <h2 id="scene-plan-heading">Scene-by-Scene Guidance</h2>
      <div className="scene-stack">
        {scenes.map((scene, index) => (
          <article
            key={scene.id}
            className={clsx('scene-card', {
              'scene-card--active': scene.id === activeSceneId
            })}
            aria-current={scene.id === activeSceneId ? 'step' : undefined}
          >
            <div className="pill">Scene {index + 1}</div>
            <h3 className="scene-title">{scene.title}</h3>
            <p className="scene-body">{scene.mainText}</p>
            <p className="scene-note">{scene.subtitle}</p>
            <p className="scene-note">Voiceover cue: {scene.voiceOver}</p>
            <p className="scene-note">Visual tip: {scene.tip}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
