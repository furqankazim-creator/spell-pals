import { useWindowDimensions } from 'react-native';

/** Responsive helper: phones get the mobile layout, wide screens (web/tablet) get a desktop layout. */
export function useLayout() {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const cols = wide ? 3 : width >= 640 ? 2 : 1;
  return { width, wide, cols };
}
