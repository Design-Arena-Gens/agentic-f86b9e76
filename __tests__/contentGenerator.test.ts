import { generateVideoPlan } from '@/lib/contentGenerator';
import type { DurationOption, ToneOption, VideoPreferences } from '@/types/video';

describe('generateVideoPlan', () => {
  const basePreferences: VideoPreferences = {
    topic: 'Daily gratitude rituals',
    tone: 'heartwarming',
    pacing: 'gentle',
    duration: 'standard',
    callToAction: 'Share this with a neighbor you appreciate.',
    personalNote: 'Remembering how my parents wrote thank-you notes on Sunday evenings.'
  };

  it.each<DurationOption>(['short', 'standard', 'extended'])('creates scene count for %s duration', (duration) => {
    const plan = generateVideoPlan({ ...basePreferences, duration });
    const expectedSceneCounts: Record<DurationOption, number> = {
      short: 4,
      standard: 5,
      extended: 6
    };

    expect(plan.scenes).toHaveLength(expectedSceneCounts[duration]);
    plan.scenes.forEach((scene) => {
      expect(scene.id).toBeTruthy();
      expect(scene.title.length).toBeGreaterThan(0);
      expect(scene.voiceOver.length).toBeGreaterThan(0);
    });
  });

  it.each<ToneOption>(['heartwarming', 'practical', 'uplifting'])(
    'adapts tone-driven soundtrack for %s tone',
    (tone) => {
      const plan = generateVideoPlan({ ...basePreferences, tone });
      expect(plan.soundtrack.length).toBeGreaterThan(0);
      expect(typeof plan.soundtrack).toBe('string');
    }
  );

  it('weaves personal notes and call-to-action when provided', () => {
    const plan = generateVideoPlan(basePreferences);
    const personalNoteFragment = basePreferences.personalNote!.split(' ')[0];
    const containsPersonalNote = plan.scenes.some(
      (scene) =>
        scene.mainText.includes(personalNoteFragment) || scene.subtitle.includes(personalNoteFragment)
    );
    const containsCallToAction = plan.scenes.some((scene) =>
      scene.mainText.includes(basePreferences.callToAction!.slice(0, 5))
    );

    expect(containsPersonalNote || containsCallToAction).toBe(true);
  });
});
