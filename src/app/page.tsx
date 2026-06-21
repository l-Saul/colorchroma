'use client'

import { useEffect, useState } from 'react'
import ColorWheel from '@/components/ColorWheel'
import {
    isValidHex,
    hexToRgb,
    isValidRgb,
    rgbToHex,
    hsvToRgb,
    rgbToHsv,
    randomHsv,
    clamp,
    type Hsv,
} from '@/components/colors'

const SURPRISE_LABELS = [
    '🎲 Surprise me!',
    '✨ Magic color!',
    '🎰 Roll the dice',
    '🪄 Abracadabra',
    '🌈 Gimme another',
    '🚀 To the unknown',
    '🍀 Feeling lucky',
]

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false)

    async function copy() {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
        } catch {
            /* clipboard unavailable */
        }
    }

    return (
        <button
            onClick={copy}
            className="rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/20"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    )
}

function Card({
    title,
    accent,
    children,
}: {
    title: string
    accent: string
    children: React.ReactNode
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-2xl">
            <h2 className={`mb-5 text-xl font-bold ${accent}`}>{title}</h2>
            {children}
        </div>
    )
}

export default function Home() {
    // --- Color picker (wheel) state ---
    const [hsv, setHsv] = useState<Hsv>({ h: 200, s: 80, v: 90 })
    const [surpriseLabel, setSurpriseLabel] = useState(SURPRISE_LABELS[0])
    const pickerRgb = hsvToRgb(hsv)
    const pickerHex = rgbToHex(pickerRgb.r, pickerRgb.g, pickerRgb.b)

    // Start on a fresh random color every visit. This runs after mount on
    // purpose: randomizing during render would mismatch the prerendered
    // (static export) HTML during hydration.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHsv(randomHsv())
    }, [])

    function randomize() {
        setHsv(randomHsv())
        setSurpriseLabel(
            SURPRISE_LABELS[
                Math.floor(Math.random() * SURPRISE_LABELS.length)
            ]
        )
    }

    function handleNativePicker(hex: string) {
        setHsv(rgbToHsv(hexToRgb(hex)))
    }

    // --- HEX -> RGB converter (live) ---
    const [hex, setHex] = useState('')
    const hexValid = isValidHex(hex)
    const hexToRgbResult = hexValid ? hexToRgb(hex) : null

    // --- RGB -> HEX converter (live) ---
    const [rgb, setRgb] = useState({ r: '', g: '', b: '' })
    const rgbNums = {
        r: Number(rgb.r),
        g: Number(rgb.g),
        b: Number(rgb.b),
    }
    const rgbFilled = rgb.r !== '' && rgb.g !== '' && rgb.b !== ''
    const rgbValid =
        rgbFilled && isValidRgb(rgbNums.r, rgbNums.g, rgbNums.b)
    const rgbToHexResult = rgbValid
        ? rgbToHex(rgbNums.r, rgbNums.g, rgbNums.b)
        : null

    // Allow pasting a whole color like "255, 0, 128" or "rgb(255 0 128)"
    // into any field and auto-split it across R, G and B.
    function handleRgbPaste(
        e: React.ClipboardEvent<HTMLInputElement>,
        field: 'r' | 'g' | 'b'
    ) {
        const text = e.clipboardData.getData('text')
        const nums = text.match(/\d+/g)

        if (nums && nums.length >= 3) {
            e.preventDefault()
            const [r, g, b] = nums
            setRgb({ r, g, b })
        } else if (nums && nums.length === 1) {
            // Single number: just drop it into the focused field.
            e.preventDefault()
            setRgb({ ...rgb, [field]: nums[0] })
        }
        // Otherwise let the browser handle the paste normally.
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-gray-950 px-4 py-12 text-white">
            {/* Ambient background that reacts to the picked color */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div
                    className="animate-float-slow absolute -top-32 -left-24 h-96 w-96 rounded-full opacity-30 blur-3xl transition-colors duration-700"
                    style={{ backgroundColor: pickerHex }}
                />
                <div
                    className="animate-float-slow absolute top-1/3 -right-24 h-96 w-96 rounded-full opacity-20 blur-3xl transition-colors duration-700"
                    style={{
                        backgroundColor: pickerHex,
                        animationDelay: '-6s',
                    }}
                />
                <div className="absolute inset-0 bg-gray-950/40" />
            </div>

            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <header className="animate-fade-in-up text-center">
                    <h1 className="animate-gradient bg-linear-to-r from-pink-400 via-teal-300 to-indigo-400 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl">
                        Chroma
                    </h1>
                    <p className="mt-3 text-gray-400">
                        Your playful color studio — pick, convert and copy in a click.
                    </p>
                </header>

                {/* COLOR PICKER */}
                <div
                    className="animate-fade-in-up"
                    style={{ animationDelay: '0.05s' }}
                >
                    <Card title="Color Picker" accent="text-pink-400">
                        <div className="grid items-center gap-8 md:grid-cols-2">
                            <ColorWheel hsv={hsv} onChange={setHsv} />

                            <div className="flex flex-col gap-4">
                                <div
                                    key={pickerHex}
                                    className="animate-pop flex h-28 items-center justify-center rounded-xl shadow-lg ring-1 ring-white/10"
                                    style={{
                                        backgroundColor: pickerHex,
                                        color:
                                            pickerRgb.r * 0.299 +
                                                pickerRgb.g * 0.587 +
                                                pickerRgb.b * 0.114 >
                                            150
                                                ? '#000'
                                                : '#fff',
                                    }}
                                >
                                    <span className="text-xl font-bold tracking-wider">
                                        {pickerHex}
                                    </span>
                                </div>

                                <button
                                    onClick={randomize}
                                    className="group w-full rounded-xl bg-linear-to-r from-pink-500 via-fuchsia-500 to-indigo-500 px-4 py-3 text-base font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-pink-500/30 active:scale-95"
                                >
                                    <span className="inline-block transition-transform duration-300 group-hover:-rotate-12">
                                        {surpriseLabel}
                                    </span>
                                </button>

                                <ReadoutRow label="HEX" value={pickerHex} />
                                <ReadoutRow
                                    label="RGB"
                                    value={`rgb(${pickerRgb.r}, ${pickerRgb.g}, ${pickerRgb.b})`}
                                />

                                <label className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm text-gray-300">
                                    Native picker
                                    <input
                                        type="color"
                                        value={pickerHex}
                                        onChange={e =>
                                            handleNativePicker(e.target.value)
                                        }
                                        className="h-8 w-12 cursor-pointer rounded bg-transparent"
                                    />
                                </label>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* CONVERTERS */}
                <div
                    className="animate-fade-in-up grid gap-8 md:grid-cols-2"
                    style={{ animationDelay: '0.1s' }}
                >
                    {/* HEX -> RGB */}
                    <Card title="HEX to RGB" accent="text-teal-400">
                        <label className="mb-2 block text-sm text-gray-400">
                            HEX Code
                        </label>
                        <input
                            value={hex}
                            onChange={e => setHex(e.target.value)}
                            placeholder="#FFFFFF"
                            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 font-mono text-lg outline-none transition focus:border-teal-400 focus:bg-white/10"
                        />

                        <Result
                            empty={hex.trim() === ''}
                            valid={hexValid}
                            invalidText="Invalid HEX code."
                            bg={
                                hexToRgbResult
                                    ? rgbToHex(
                                          hexToRgbResult.r,
                                          hexToRgbResult.g,
                                          hexToRgbResult.b
                                      )
                                    : undefined
                            }
                            rgb={hexToRgbResult ?? undefined}
                            value={
                                hexToRgbResult
                                    ? `rgb(${hexToRgbResult.r}, ${hexToRgbResult.g}, ${hexToRgbResult.b})`
                                    : ''
                            }
                        />
                    </Card>

                    {/* RGB -> HEX */}
                    <Card title="RGB to HEX" accent="text-indigo-400">
                        <label className="mb-2 flex items-center justify-between text-sm text-gray-400">
                            <span>RGB Values</span>
                            <span className="text-xs text-gray-500">
                                tip: paste “255, 0, 128”
                            </span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['r', 'g', 'b'] as const).map(c => (
                                <input
                                    key={c}
                                    type="number"
                                    min={0}
                                    max={255}
                                    placeholder={c.toUpperCase()}
                                    value={rgb[c]}
                                    onChange={e =>
                                        setRgb({ ...rgb, [c]: e.target.value })
                                    }
                                    onPaste={e => handleRgbPaste(e, c)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-center text-lg outline-none transition focus:border-indigo-400 focus:bg-white/10"
                                />
                            ))}
                        </div>

                        <Result
                            empty={!rgbFilled}
                            valid={rgbValid}
                            invalidText="Invalid RGB values (0–255)."
                            bg={rgbToHexResult ?? undefined}
                            rgb={
                                rgbValid
                                    ? {
                                          r: clamp(rgbNums.r, 0, 255),
                                          g: clamp(rgbNums.g, 0, 255),
                                          b: clamp(rgbNums.b, 0, 255),
                                      }
                                    : undefined
                            }
                            value={rgbToHexResult ?? ''}
                        />
                    </Card>
                </div>
            </div>

            <footer className="animate-fade-in-up mt-12 text-center">
                <p className="text-sm text-gray-500">
                    © 2026 Created by Luis Henrique Engel Saul.
                </p>
            </footer>
        </main>
    )
}

function ReadoutRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 transition-colors hover:bg-white/10">
            <span className="text-xs font-semibold text-gray-400">{label}</span>
            <span className="font-mono text-sm">{value}</span>
            <CopyButton value={value} />
        </div>
    )
}

function Result({
    empty,
    valid,
    invalidText,
    bg,
    rgb,
    value,
}: {
    empty: boolean
    valid: boolean
    invalidText: string
    bg?: string
    rgb?: { r: number; g: number; b: number }
    value: string
}) {
    const textColor =
        rgb && rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 150
            ? '#000'
            : '#fff'

    return (
        <div
            className="mt-4 flex min-h-22 items-center justify-center gap-3 rounded-xl px-4 text-center text-lg ring-1 ring-white/10 transition"
            style={{
                backgroundColor: valid ? bg : 'transparent',
                color: valid ? textColor : '#9ca3af',
            }}
        >
            {empty ? (
                <span>Result will appear here.</span>
            ) : !valid ? (
                <span>{invalidText}</span>
            ) : (
                <>
                    <span className="font-mono">{value}</span>
                    <CopyButton value={value} />
                </>
            )}
        </div>
    )
}
