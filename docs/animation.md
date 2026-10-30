# Animation

GSAP is available for client-approved motion. It is a component-scoped enhancement, not a global site runtime: the default boilerplate does not import the helper, so it emits no GSAP or ScrollTrigger JavaScript until a component explicitly uses it.

## Supported foundation

`gsap` is a production dependency. `src/scripts/animation/gsap.ts` exports GSAP, ScrollTrigger, and `createMotionContext()`.

The helper registers ScrollTrigger once, creates motion only for visitors who have not requested reduced motion, and returns a cleanup function. Import it only from an Astro client script or another browser-only module owned by the component or page using the animation.

```astro
---
// The component renders complete, readable content without this script.
---

<section class="feature" data-feature-motion>
  <h2>Section title</h2>
  <p>Visible, useful content is never hidden pending JavaScript.</p>
</section>

<script>
  import { createMotionContext, gsap } from '../../scripts/animation/gsap';

  const scope = document.querySelector<HTMLElement>('[data-feature-motion]');

  if (scope) {
    const dispose = createMotionContext(scope, () => {
      gsap.from(scope.querySelectorAll('h2, p'), {
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.08,
        y: 16,
      });
    });

    // Retain this cleanup when the component is used with Astro view transitions.
    document.addEventListener('astro:before-swap', dispose, { once: true });
  }
</script>
```

The `astro:before-swap` listener is harmless in the current static site and makes the component safe if view transitions are introduced later. Do not put this import in `BaseLayout.astro`, `global.css`, or a site-wide script.

## ScrollTrigger

Use ScrollTrigger for a specific component’s reveal, progress, pin, or scroll-linked effect. Configure a trigger from that component’s own DOM reference and retain the `createMotionContext()` cleanup.

```ts
createMotionContext(scope, () => {
  gsap.from(scope.querySelector('.feature__visual'), {
    autoAlpha: 0,
    scrollTrigger: {
      trigger: scope,
      start: 'top 75%',
      once: true,
    },
    y: 24,
  });
});
```

Use CSS for hover, focus, color, and short state transitions. Keep native scrolling. Do not add ScrollSmoother or a scroll-jacking layer to the starter. Prefer `transform` and `opacity`, avoid animating layout properties, and use pinning only when it supports the page narrative.

## Accessibility and content rules

- Respect `prefers-reduced-motion`; `createMotionContext()` does not initialise motion when the visitor opts out.
- Render the final content state in static HTML and CSS. Motion may enhance its entrance or relationship, never reveal required content.
- Preserve focus order, heading hierarchy, link destinations, button behavior, and reading order while animating.
- Do not use motion as the only way to communicate a state, error, progress value, or instruction.
- Test keyboard navigation and reduced-motion behavior whenever a motion component is introduced.

## Licensed plugins and the legacy archive

The supplied historical GSAP archive is not part of this repository and must not be copied into `src/`, `public/`, or Git history. It includes plugins whose licensing and distribution terms may differ from the public package. For a client project that needs a licensed plugin, confirm the current licence and redistribution rights, keep the original private distribution outside the shared boilerplate, and add only the minimum approved files through the client project’s private dependency process.

## Client-project checklist

1. Confirm the animation intent, affected routes, performance budget, and accessibility acceptance criteria with the client.
2. Keep the implementation within a named component or page-specific script.
3. Use `createMotionContext()` and test both normal and reduced-motion states.
4. Check compact and large layouts, keyboard behavior, scroll performance, and the page without JavaScript.
5. Run `pnpm run verify` and relevant Playwright coverage.
