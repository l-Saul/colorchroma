// Ambient declaration so the Next.js TypeScript language-service plugin
// accepts side-effect imports of global stylesheets (e.g. `import './globals.css'`).
// The `tsc` CLI tolerates these without it, but the editor plugin flags them (TS 2882).
declare module '*.css'
