import type { MetadataRoute } from 'next'

// Required for `output: 'export'` (GitHub Pages) — generate at build time.
export const dynamic = 'force-static'

// Mesma lógica do next.config.ts: em produção o site vive em /colorchroma.
const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/colorchroma' : ''

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Chroma: Escolha e Converta Cores',
        short_name: 'Chroma',
        description:
            'Um estúdio de cores super divertido pra escolher suas cores favoritas e converter entre HEX e RGB num instante.',
        lang: 'pt-BR',
        start_url: `${basePath}/`,
        scope: `${basePath}/`,
        display: 'standalone',
        background_color: '#030712',
        theme_color: '#030712',
        icons: [
            { src: `${basePath}/icon.svg`, type: 'image/svg+xml', sizes: 'any' },
            { src: `${basePath}/icon-192.png`, type: 'image/png', sizes: '192x192' },
            { src: `${basePath}/icon-512.png`, type: 'image/png', sizes: '512x512' },
        ],
    }
}
