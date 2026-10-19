import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const motionMediaQuery = '(prefers-reduced-motion: no-preference)';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Creates component-scoped motion only when a visitor has not requested reduced motion.
 * Call the returned function when the component is removed or re-initialised.
 */
export function createMotionContext(scope: Element, setup: () => void | (() => void)): () => void {
  const context = gsap.context(() => {
    const media = gsap.matchMedia();
    media.add(motionMediaQuery, setup);

    return () => media.revert();
  }, scope);

  return () => context.revert();
}
