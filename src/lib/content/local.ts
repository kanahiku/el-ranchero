import type { NavigationContent } from './types';

export async function getLocalNavigationContent(): Promise<NavigationContent> {
  const { navigationData } = await import('../../data/navigation');
  return navigationData;
}
