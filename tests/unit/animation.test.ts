import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
};

describe('animation foundation', () => {
  it('keeps GSAP available as an explicit production dependency', () => {
    expect(packageJson.dependencies?.gsap).toMatch(/^\^?3\./);
  });

  it('keeps GSAP and ScrollTrigger behind the component-scoped helper', () => {
    const helper = readFileSync(resolve(process.cwd(), 'src/scripts/animation/gsap.ts'), 'utf8');

    expect(helper).toContain("import { ScrollTrigger } from 'gsap/ScrollTrigger'");
    expect(helper).toContain('gsap.registerPlugin(ScrollTrigger)');
    expect(helper).toContain("'(prefers-reduced-motion: no-preference)'");
  });
});
