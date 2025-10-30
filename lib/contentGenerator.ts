import type {
  DurationOption,
  ScenePlan,
  ToneOption,
  VideoPlan,
  VideoPreferences
} from '@/types/video';

const createId = () => Math.random().toString(36).slice(2, 10);

const toneDescriptors: Record<
  ToneOption,
  {
    headlinePattern: (topic: string) => string;
    summaryFragments: string[];
    soundtrack: string[];
    outroFragments: string[];
  }
> = {
  heartwarming: {
    headlinePattern: (topic) => `Remembering ${topic} Together`,
    summaryFragments: [
      'Share a gentle stroll down memory lane with warm visuals and soft narration.',
      'Celebrate treasured moments that feel familiar, comforting, and kind.',
      'Offer a peaceful reflection that feels like sitting on a porch at dusk.'
    ],
    soundtrack: [
      'Tender acoustic guitar with soft vinyl crackle',
      'Slow waltz piano with warm reverb',
      'Gentle strings with mellow harmonies'
    ],
    outroFragments: [
      'Thank viewers for sharing the memory and invite them to reminisce in the comments.',
      'Encourage a loved one to watch and add their own cherished moment.',
      'Close with a quiet pause and a simple invitation to keep the tradition alive.'
    ]
  },
  practical: {
    headlinePattern: (topic) => `Simple Wisdom on ${topic}`,
    summaryFragments: [
      'Offer steady, trustworthy guidance that feels like advice from a cherished friend.',
      'Focus on practical tips shared in a calm, reassuring pace.',
      'Blend visual cues and easy steps that are gentle on the eyes and mind.'
    ],
    soundtrack: [
      'Laid-back acoustic bass with soft brushes',
      'Light instrumental folk with calm tempo',
      'Warm instrumental lullaby with soft chimes'
    ],
    outroFragments: [
      'Invite viewers to pass along their own wisdom in the comments.',
      'Encourage saving the clip so family can revisit the advice later.',
      'Close with a peaceful reminder that it is never too late to learn or teach.'
    ]
  },
  uplifting: {
    headlinePattern: (topic) => `A Gentle Lift: ${topic}`,
    summaryFragments: [
      'Blend gentle motion and bright colors to spark a hopeful smile.',
      'Share kind words that feel like a friendly neighbor dropping by.',
      'Keep the pacing relaxed yet optimistic, with uplifting imagery.'
    ],
    soundtrack: [
      'Sunny ukulele with soft humming background',
      'Slow swing with brushed drums and upright bass',
      'Dreamy synth pads with tranquil bells'
    ],
    outroFragments: [
      'Invite viewers to send the video to someone who could use a lift.',
      'Close with a gentle affirmation and friendly wave goodbye.',
      'Encourage everyone to take a slow breath and carry the warmth forward.'
    ]
  }
};

const pacingDurations: Record<DurationOption, number> = {
  short: 4,
  standard: 5,
  extended: 6
};

const palettePool = [
  {
    start: '#f9e9d3',
    end: '#f4d1bc',
    accent: '#bb7b4b',
    text: '#4a3021',
    subtitle: '#5d3b27'
  },
  {
    start: '#f3f5d7',
    end: '#dcebd3',
    accent: '#7c9c6b',
    text: '#37442d',
    subtitle: '#4b5b3f'
  },
  {
    start: '#f2e9ff',
    end: '#d7d9f4',
    accent: '#8079c9',
    text: '#342f51',
    subtitle: '#4e4777'
  },
  {
    start: '#fdf1f0',
    end: '#f7dada',
    accent: '#d27d78',
    text: '#603636',
    subtitle: '#744646'
  }
];

const pacingNotes: Record<DurationOption, string[]> = {
  short: [
    'Keep each slide on screen long enough for relaxed reading (around 6-7 seconds).',
    'Use gentle zoom-ins and soft dissolves between visuals.'
  ],
  standard: [
    'Allow a calm breath between each idea; avoid sudden transitions.',
    'Add subtle ambient sounds like birdsong or kettle boiling very softly.'
  ],
  extended: [
    'Include breathing room between segments so viewers never feel rushed.',
    'Consider repeating the main takeaway softly near the end for emphasis.'
  ]
};

const supportiveHooks = [
  'A soft glide through yesterday’s wisdom.',
  'Stories that feel like a familiar armchair by the window.',
  'Thoughtful reflections to share over afternoon tea.'
];

type SceneTemplateInput = {
  topic: string;
  personalNote?: string;
  callToAction?: string;
  tone: ToneOption;
  index: number;
  total: number;
};

const sceneTemplates: Array<
  (input: SceneTemplateInput) => Omit<ScenePlan, 'id' | 'palette'>
> = [
  ({ topic, personalNote, tone }) => ({
    title: 'A Warm Welcome',
    mainText: `Let’s take a moment to appreciate ${topic.toLowerCase()}.`,
    subtitle:
      personalNote?.length
        ? `Inspired by a personal note: “${personalNote.trim()}.”`
        : 'Slow down, breathe deeply, and settle into a familiar story.',
    voiceOver:
      tone === 'heartwarming'
        ? 'Close your eyes and imagine a gentle afternoon sun, lighting up old memories.'
        : tone === 'practical'
        ? 'Sometimes the best guidance comes from slowing down and noticing the simple details.'
        : 'A hopeful whisper reminds us there is always something bright to hold onto.',
    tip: 'Fade in from a soft sepia tone, then brighten as the text appears.'
  }),
  ({ topic, tone }) => ({
    title: 'Gentle Scene',
    mainText: `Picture ${topic.toLowerCase()} with soft colors and easy motion.`,
    subtitle:
      tone === 'practical'
        ? 'Highlight one thoughtful insight at a time with readable captions.'
        : 'Pair the words with imagery of calm mornings, gardens, or seaside horizons.',
    voiceOver:
      tone === 'heartwarming'
        ? 'This is how it felt when time moved slowly and every detail mattered.'
        : tone === 'practical'
        ? 'Step by step, the lesson unfolds without hurry.'
        : 'Let the rhythm lift spirits gently, like humming a favorite tune.',
    tip: 'Use a slow Ken Burns effect over archival-style photos or illustrations.'
  }),
  ({ topic, personalNote }) => ({
    title: 'Memory Spark',
    mainText:
      personalNote?.length
        ? `“${personalNote.trim()}.” Let that memory glow a little brighter.`
        : `Share a kind detail about ${topic.toLowerCase()} that makes people smile.`
        ,
    subtitle: 'Hold each word on screen long enough for restful reading.',
    voiceOver: 'Pause for a heartbeat between sentences to keep everyone comfortable.',
    tip: 'Add a soft vignette to focus the eye on the center text.'
  }),
  ({ topic, callToAction }) => ({
    title: 'Passing the Gift',
    mainText:
      callToAction?.length
        ? callToAction
        : `Invite a loved one to reflect on ${topic.toLowerCase()} today.`,
    subtitle: 'Keep the message warm, direct, and encouraging.',
    voiceOver: 'Close with a sincere thank you and an open invitation to share stories.',
    tip: 'Gently animate the call-to-action text so it settles like falling leaves.'
  })
];

const extendedTemplates: Array<
  (input: SceneTemplateInput) => Omit<ScenePlan, 'id' | 'palette'>
> = [
  ({ topic }: SceneTemplateInput) => ({
    title: 'Steady Reminder',
    mainText: `A simple ritual around ${topic.toLowerCase()} to keep close.`,
    subtitle: 'Encourage viewers to revisit the clip whenever they need peace.',
    voiceOver: 'Soft-spoken, like a trusted friend sitting across the table.',
    tip: 'Add a slow crossfade between two mellow background images.'
  }),
  ({ topic }: SceneTemplateInput) => ({
    title: 'Gentle Farewell',
    mainText: `Take one more peaceful look at ${topic.toLowerCase()}.`,
    subtitle: 'Let the colors dim softly as the story concludes.',
    voiceOver: 'Offer gratitude for the shared moment and invite quiet reflection.',
    tip: 'Finish with a soft glow that lingers for a second before fading out.'
  })
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateVideoPlan(preferences: VideoPreferences): VideoPlan {
  const tone = toneDescriptors[preferences.tone];
  const headline = tone.headlinePattern(preferences.topic.trim());
  const summary = pick(tone.summaryFragments);
  const hook = pick(supportiveHooks);
  const sceneCount = pacingDurations[preferences.duration];

  const baseScenes = sceneTemplates
    .slice(0, Math.min(sceneCount, sceneTemplates.length))
    .map((template, index) =>
      template({
        topic: preferences.topic.trim(),
        personalNote: preferences.personalNote?.trim(),
        callToAction: preferences.callToAction?.trim(),
        tone: preferences.tone,
        index,
        total: sceneCount
      })
    );

  let allScenes = baseScenes;
  if (sceneCount > baseScenes.length) {
    const extrasNeeded = sceneCount - baseScenes.length;
    const extras = extendedTemplates.slice(0, extrasNeeded).map((template, index) =>
      template({
        topic: preferences.topic.trim(),
        personalNote: preferences.personalNote?.trim(),
        callToAction: preferences.callToAction?.trim(),
        tone: preferences.tone,
        index: baseScenes.length + index,
        total: sceneCount
      })
    );
    allScenes = [...baseScenes, ...extras];
  }

  const scenes: ScenePlan[] = allScenes.map((scene) => ({
    ...scene,
    id: createId(),
    palette: pick(palettePool)
  }));

  return {
    headline,
    summary,
    hook,
    scenes,
    outro: pick(tone.outroFragments),
    postingTip: pick(pacingNotes[preferences.duration]),
    soundtrack: pick(tone.soundtrack)
  };
}
