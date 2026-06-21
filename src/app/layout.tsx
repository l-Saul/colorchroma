import type { Metadata, Viewport } from 'next'
// TypeScript may complain about side-effect CSS imports when no declarations exist.
// @ts-ignore: Allow importing global CSS without type declarations
import './globals.css'

const SITE_URL = 'https://l-saul.github.io/colorconverter/'
const TITLE = 'Chroma — Color Picker & Converter'
const DESCRIPTION =
    'A playful color studio to pick colors and convert between HEX and RGB instantly — with a live color wheel, smart paste and one-click copy.'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: TITLE,
        template: '%s · Chroma',
    },
    description: DESCRIPTION,
    applicationName: 'Chroma',
    authors: [{ name: 'Luis Henrique Engel Saul' }],
    creator: 'Luis Henrique Engel Saul',
    publisher: 'Luis Henrique Engel Saul',
    category: 'technology',
    keywords: [
        'Chroma',
        'Color Picker',
        'Color Converter',
        'Color Wheel',
        'HEX to RGB',
        'RGB to HEX',
        'HEX color code',
        'RGB color code',
        'Web Development',
        'Design Tools',
    ],
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: SITE_URL,
        siteName: 'Chroma',
        locale: 'en_US',
        type: 'website',
        // OG image is auto-detected from src/app/opengraph-image.tsx
    },
    twitter: {
        card: 'summary_large_image',
        title: TITLE,
        description: DESCRIPTION,
        creator: '@l-saul',
        // Twitter image is auto-detected from src/app/twitter-image / opengraph-image
    },
    // Favicon is auto-detected from src/app/icon.svg
}

export const viewport: Viewport = {
    themeColor: '#030712',
    colorScheme: 'dark',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="bg-gray-950 text-white min-h-screen font-sans antialiased">
                {children}
            </body>
        </html>
    )
}
