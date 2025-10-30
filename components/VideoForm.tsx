'use client';

import { useState } from 'react';
import type { VideoPreferences } from '@/types/video';

interface VideoFormProps {
  onGenerate: (preferences: VideoPreferences) => void;
  generating: boolean;
}

const toneChoices = [
  { value: 'heartwarming', label: 'Heartwarming & Nostalgic' },
  { value: 'practical', label: 'Practical & Reassuring' },
  { value: 'uplifting', label: 'Uplifting & Hopeful' }
] as const;

const pacingChoices = [
  { value: 'gentle', label: 'Gentle (slow transitions)' },
  { value: 'steady', label: 'Steady (comfortable pace)' },
  { value: 'brisk', label: 'Brisk (still relaxed)' }
] as const;

const durationChoices = [
  { value: 'short', label: '45 seconds (4 scenes)' },
  { value: 'standard', label: '60 seconds (5 scenes)' },
  { value: 'extended', label: '90 seconds (6 scenes)' }
] as const;

export function VideoForm({ onGenerate, generating }: VideoFormProps) {
  const [formState, setFormState] = useState<VideoPreferences>({
    topic: 'Neighborhood kindness and small gestures',
    tone: 'heartwarming',
    pacing: 'gentle',
    duration: 'standard',
    callToAction: 'Share this with someone who loves simple acts of kindness.',
    personalNote: 'Remember how the whole block rallied around one another each winter.'
  });

  const handleChange = (field: keyof VideoPreferences) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onGenerate({
      ...formState,
      topic: formState.topic.trim(),
      callToAction: formState.callToAction?.trim() ?? undefined,
      personalNote: formState.personalNote?.trim() ?? undefined
    });
  };

  return (
    <section className="panel" aria-labelledby="video-generator-heading">
      <h2 id="video-generator-heading">Design a Faceless Facebook Video</h2>
      <p>
        Tune the mood, pacing, and storytelling focus. The automation will craft a calm, senior-friendly
        slideshow script and assemble a downloadable video file.
      </p>
      <form onSubmit={handleSubmit} className="form-grid" aria-describedby="form-helper">
        <label>
          Central Topic
          <textarea
            value={formState.topic}
            onChange={handleChange('topic')}
            required
            aria-required="true"
            maxLength={220}
            placeholder="e.g. Cherished Sunday dinners, local community fairs, helpful household wisdom"
          />
        </label>

        <label>
          Tone
          <select value={formState.tone} onChange={handleChange('tone')}>
            {toneChoices.map((choice) => (
              <option value={choice.value} key={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Pacing
          <select value={formState.pacing} onChange={handleChange('pacing')}>
            {pacingChoices.map((choice) => (
              <option value={choice.value} key={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Duration
          <select value={formState.duration} onChange={handleChange('duration')}>
            {durationChoices.map((choice) => (
              <option value={choice.value} key={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Gentle Call-to-Action (optional)
          <input
            type="text"
            value={formState.callToAction ?? ''}
            onChange={handleChange('callToAction')}
            placeholder="Invite viewers to comment, call a friend, or revisit a memory."
            maxLength={140}
          />
        </label>

        <label>
          Memory Spark (optional)
          <textarea
            value={formState.personalNote ?? ''}
            onChange={handleChange('personalNote')}
            placeholder="Include a personal detail or memory fragment to weave into the story."
            maxLength={220}
          />
        </label>

        <div className="download-section">
          <button type="submit" className="primary-button" disabled={generating}>
            {generating ? 'Crafting plan…' : 'Generate Video Blueprint'}
          </button>
          <p id="form-helper" className="helper-text">
            The automation creates a warm slide-by-slide plan with narration prompts, then renders a
            vertical 4:5 MP4 that is ready for Facebook upload.
          </p>
        </div>
      </form>
    </section>
  );
}
