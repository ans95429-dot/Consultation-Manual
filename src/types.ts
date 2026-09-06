export interface SituationScript {
  id: number;
  title: string;
  tag: string;
  diagnosis: string;
  coreMessage: string;
  keyPoints?: string[];
  counselorMindset?: string;
  steps: {
    stage: string;
    label: string;
    script: string;
    tip?: string;
  }[];
  dont: string;
  do: string;
  followUp: string[];
}

export interface PromptInput {
  institution: string;
  courseName: string;
  additionalSituation: string;
}

export interface GenerationResult {
  markdown: string;
  promptUsed?: string;
  source: "gemini-3.8-flash" | "prebuilt";
  generatedAt: string;
}
