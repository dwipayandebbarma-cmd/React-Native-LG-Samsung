import { init } from '@noriginmedia/norigin-spatial-navigation';

/**
 * One-time setup for D-pad / remote spatial navigation (Tizen, webOS, web).
 */
export function initSpatialNavigation() {
  init({
    debug: false,
    visualDebug: false,
    distanceCalculationMethod: 'center',
    // RN Web flex layouts often break the default offsetParent layout; use real geometry.
    useGetBoundingClientRect: true,
    // Sync browser focus with spatial focus (helps TV + keyboard).
    shouldFocusDOMNode: true,
  });
}
