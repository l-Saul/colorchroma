// utils/colors.ts

export type Rgb = { r: number; g: number; b: number }
export type Hsv = { h: number; s: number; v: number }

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}

export function isValidHex(hex: string): boolean {
    return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim())
}

export function hexToRgb(hex: string): Rgb {
    let cleanHex = hex.trim().replace('#', '')

    // Expand shorthand form (e.g. "abc" -> "aabbcc")
    if (cleanHex.length === 3) {
        cleanHex = cleanHex
            .split('')
            .map(c => c + c)
            .join('')
    }

    return {
        r: parseInt(cleanHex.substring(0, 2), 16),
        g: parseInt(cleanHex.substring(2, 4), 16),
        b: parseInt(cleanHex.substring(4, 6), 16),
    }
}

export function isValidRgb(r: number, g: number, b: number): boolean {
    return [r, g, b].every(v => Number.isFinite(v) && v >= 0 && v <= 255)
}

export function rgbToHex(r: number, g: number, b: number): string {
    return (
        '#' +
        [r, g, b]
            .map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0'))
            .join('')
    ).toUpperCase()
}

export function getContrastTextColor(
    r: number,
    g: number,
    b: number
): 'black' | 'white' {
    return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? 'black' : 'white'
}

// --- HSV <-> RGB (used by the color wheel) ---

export function hsvToRgb({ h, s, v }: Hsv): Rgb {
    const sat = s / 100
    const val = v / 100
    const c = val * sat
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = val - c

    let r = 0
    let g = 0
    let b = 0

    if (h < 60) [r, g, b] = [c, x, 0]
    else if (h < 120) [r, g, b] = [x, c, 0]
    else if (h < 180) [r, g, b] = [0, c, x]
    else if (h < 240) [r, g, b] = [0, x, c]
    else if (h < 300) [r, g, b] = [x, 0, c]
    else [r, g, b] = [c, 0, x]

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    }
}

export function randomHsv(): Hsv {
    return {
        h: Math.floor(Math.random() * 360),
        s: 55 + Math.floor(Math.random() * 45), // 55-100: stay vivid
        v: 60 + Math.floor(Math.random() * 40), // 60-100: stay bright
    }
}

export function rgbToHsv({ r, g, b }: Rgb): Hsv {
    const rn = r / 255
    const gn = g / 255
    const bn = b / 255

    const max = Math.max(rn, gn, bn)
    const min = Math.min(rn, gn, bn)
    const d = max - min

    let h = 0
    if (d !== 0) {
        if (max === rn) h = ((gn - bn) / d) % 6
        else if (max === gn) h = (bn - rn) / d + 2
        else h = (rn - gn) / d + 4
        h *= 60
        if (h < 0) h += 360
    }

    const s = max === 0 ? 0 : d / max

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        v: Math.round(max * 100),
    }
}
