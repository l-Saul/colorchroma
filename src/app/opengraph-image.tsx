import { ImageResponse } from 'next/og'

// Required for `output: 'export'` (GitHub Pages) — generate the image at build time.
export const dynamic = 'force-static'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Chroma — Color Picker & Converter'

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#030712',
                    position: 'relative',
                }}
            >
                {/* Ambient color blobs */}
                <div
                    style={{
                        position: 'absolute',
                        top: -160,
                        left: -120,
                        width: 520,
                        height: 520,
                        borderRadius: '50%',
                        background: '#f472b6',
                        opacity: 0.35,
                        filter: 'blur(120px)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: -180,
                        right: -120,
                        width: 520,
                        height: 520,
                        borderRadius: '50%',
                        background: '#818cf8',
                        opacity: 0.35,
                        filter: 'blur(120px)',
                    }}
                />

                {/* Brand title */}
                <div
                    style={{
                        fontSize: 160,
                        fontWeight: 900,
                        letterSpacing: '-4px',
                        backgroundImage:
                            'linear-gradient(90deg, #f472b6, #5eead4, #818cf8)',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    Chroma
                </div>

                <div
                    style={{
                        fontSize: 38,
                        color: '#9ca3af',
                        marginTop: 8,
                    }}
                >
                    Your playful color studio
                </div>

                <div
                    style={{
                        fontSize: 28,
                        color: '#6b7280',
                        marginTop: 28,
                    }}
                >
                    Pick colors · Convert HEX ↔ RGB · Copy in a click
                </div>
            </div>
        ),
        size
    )
}
