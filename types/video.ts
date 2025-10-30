export type ToneOption = 'heartwarming' | 'practical' | 'uplifting';
export type PacingOption = 'gentle' | 'steady' | 'brisk';
export type DurationOption = 'short' | 'standard' | 'extended';

export interface VideoPreferences {
  topic: string;
  tone: ToneOption;
  pacing: PacingOption;
  duration: DurationOption;
  callToAction?: string;
  personalNote?: string;
}

export interface ColorPalette {
  start: string;
  end: string;
  accent: string;
  text: string;
  subtitle: string;
}

export interface ScenePlan {
  id: string;
  title: string;
  mainText: string;
  subtitle: string;
  voiceOver: string;
  tip: string;
  palette: ColorPalette;
}

export interface VideoPlan {
  headline: string;
  summary: string;
  hook: string;
  scenes: ScenePlan[];
  outro: string;
  postingTip: string;
  soundtrack: string;
}
