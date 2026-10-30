/// <reference types="astro/client" />

declare module '*.astro?container' {
  const component: import('astro/runtime/server/index.js').AstroComponentFactory;
  export default component;
}
