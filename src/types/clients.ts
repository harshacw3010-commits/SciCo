export type ClientLogo = {
  name: string;
  src?: string;
  href?: string;
};

export type ClientsSectionProps = {
  variant?: 'grid' | 'marquee';
  title?: string;
  logos: ClientLogo[];
  grayscale?: boolean;
  maxColumns?: 4 | 5 | 6;
};

export const DEFAULT_CLIENTS: ClientLogo[] = [
  { name: 'Duolingo' },
  { name: 'Traya' },
  { name: 'Lenskart' },
  { name: 'Unacademy' },
  { name: 'Deconstruct' },
  { name: 'Policy Bazaar' },
  { name: 'Scaler' },
  { name: 'MuscleBlaze' },
  { name: 'Pharmeasy' },
  { name: 'Amazon Mini TV' },
];

