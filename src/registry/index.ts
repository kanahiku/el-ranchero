import registryJson from './components.json';

export interface RegistryPattern {
  id: string;
  name: string;
  figmaNames: string[];
  shape: string;
  component: string;
  import?: string;
  itemCount?: number[];
  notes?: string;
  composable?: boolean;
  props?: Record<string, unknown>;
  slots?: string[];
}

export interface ComponentRegistry {
  version: number;
  name: string;
  description: string;
  sourceOfTruth: Record<string, string>;
  patterns: RegistryPattern[];
}

export const registry = registryJson as ComponentRegistry;

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/**
 * Look up a Figma layer / component name in the inventory.
 * This is a reuse helper, not a layout generator.
 */
export function matchFigmaName(name: string): RegistryPattern | undefined {
  const needle = normalize(name);
  if (!needle) return undefined;

  const exact = registry.patterns.find((pattern) =>
    pattern.figmaNames.some((alias) => normalize(alias) === needle)
  );
  if (exact) return exact;

  return registry.patterns.find((pattern) =>
    pattern.figmaNames.some((alias) => {
      const hay = normalize(alias);
      return needle.includes(hay) || hay.includes(needle);
    })
  );
}

export function registryForBuilder(): ComponentRegistry {
  return registry;
}
