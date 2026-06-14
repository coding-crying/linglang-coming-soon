export type ProductKey = 'local' | 'cloud' | 'edge';

export type ProductPath = {
  key: ProductKey;
  title: string;
  shortTitle: string;
  status: string;
  eyebrow: string;
  line: string;
  href: string;
  featured?: boolean;
  tilePoints: string[];
  heroTitle: string;
  heroAccent: string;
  heroText: string;
  primaryCta: string;
  secondaryCta: string;
  details: Array<{
    title: string;
    text: string;
  }>;
};

export const productPaths: ProductPath[] = [
  {
    key: 'local',
    title: 'LingLang Local',
    shortTitle: 'Local',
    status: 'Alpha',
    eyebrow: 'Self-hosted framework',
    line: 'Own the stack. Run the agent, memory, and language model pipeline yourself.',
    href: '/local',
    tilePoints: ['Docker-first deploy', 'Bring your own model', 'Postgres memory layer'],
    heroTitle: 'LingLang Local',
    heroAccent: 'is the self-hosted stack.',
    heroText:
      'Run the language-learning agent framework on your own infrastructure. Local is for schools, labs, builders, and teams that want control over data, models, and deployment.',
    primaryCta: 'Request alpha access',
    secondaryCta: 'Compare paths',
    details: [
      {
        title: 'Agent runtime',
        text: 'Conversation, correction, memory updates, and lesson state run as an inspectable framework instead of a closed app.',
      },
      {
        title: 'Your infrastructure',
        text: 'Deploy the server, database, and model gateway where your privacy, cost, and compliance needs make sense.',
      },
      {
        title: 'Built to extend',
        text: 'Use LingLang as a base layer for language labs, classrooms, private tutors, or custom research workflows.',
      },
    ],
  },
  {
    key: 'cloud',
    title: 'LingLang Cloud',
    shortTitle: 'Cloud',
    status: 'Beta',
    eyebrow: 'Hosted beta',
    line: 'The hosted version of the voice demo: fast setup, managed memory, no infrastructure.',
    href: '/cloud',
    featured: true,
    tilePoints: ['What the demo uses', 'Managed voice agent', 'Usage-based beta'],
    heroTitle: 'LingLang Cloud',
    heroAccent: 'is what you just tried.',
    heroText:
      'Cloud is the managed LingLang path: browser voice practice, hosted agent sessions, and learner memory without running your own servers.',
    primaryCta: 'Notify me at beta',
    secondaryCta: 'See self-hosted',
    details: [
      {
        title: 'Live voice sessions',
        text: 'The browser demo connects to the hosted agent path, with speech, transcription, and memory updates handled server-side.',
      },
      {
        title: 'Managed memory',
        text: 'Learner vocabulary, corrections, and review signals are captured into a durable profile instead of disappearing after a chat.',
      },
      {
        title: 'Beta pricing',
        text: 'Designed for a hosted monthly plan or usage-based beta while the framework and Edge app mature.',
      },
    ],
  },
  {
    key: 'edge',
    title: 'LingLang Edge',
    shortTitle: 'Edge',
    status: 'Alpha',
    eyebrow: 'On-device voice',
    line: 'A phone-native English speaking agent designed to run locally on device hardware.',
    href: '/edge',
    tilePoints: ['On-device inference', 'English first', 'Private low-latency practice'],
    heroTitle: 'LingLang Edge',
    heroAccent: 'runs on your phone.',
    heroText:
      'Edge is the local mobile path: an English-learning voice agent designed for private, low-latency practice on phone hardware. It is currently in alpha.',
    primaryCta: 'Request alpha access',
    secondaryCta: 'Compare paths',
    details: [
      {
        title: 'Phone-native agent',
        text: 'Built for short practice loops, fast turn-taking, and speech correction without treating the phone as a thin client.',
      },
      {
        title: 'Private by design',
        text: 'The goal is to keep the core learning loop local where possible, reducing dependence on cloud round trips.',
      },
      {
        title: 'English alpha',
        text: 'The first Edge release is focused on English speaking practice before expanding to broader language coverage.',
      },
    ],
  },
];

export function getProductPath(key: ProductKey) {
  return productPaths.find((product) => product.key === key);
}
