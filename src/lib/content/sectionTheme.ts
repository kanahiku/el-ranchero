export type SectionSurface = 'grey' | 'dark' | 'white';

export function isDarkSurface(surface: SectionSurface) {
  return surface === 'dark';
}

export function cardVariant(surface: SectionSurface): 'light' | 'dark' {
  return surface === 'white' ? 'light' : 'dark';
}

export function pointVariant(surface: SectionSurface): 'light' | 'dark' {
  return surface === 'dark' ? 'dark' : 'light';
}

export function introClass(surface: SectionSurface) {
  return surface === 'dark' ? 'text-white/70' : 'text-muted';
}
