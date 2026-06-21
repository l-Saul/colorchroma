'use client'

import { useCallback, useRef } from 'react'
import { clamp, hsvToRgb, type Hsv } from '@/components/colors'

type Props = {
    hsv: Hsv
    onChange: (hsv: Hsv) => void
}

const SIZE = 240
const HANDLE = 18

export default function ColorWheel({ hsv, onChange }: Props) {
    const wheelRef = useRef<HTMLDivElement>(null)

    const updateFromPointer = useCallback(
        (clientX: number, clientY: number) => {
            const el = wheelRef.current
            if (!el) return

            const rect = el.getBoundingClientRect()
            const radius = rect.width / 2
            const x = clientX - rect.left - radius
            const y = clientY - rect.top - radius

            const dist = Math.sqrt(x * x + y * y)
            // Hue from angle, saturation from distance to center.
            let angle = (Math.atan2(y, x) * 180) / Math.PI
            if (angle < 0) angle += 360

            const saturation = clamp((dist / radius) * 100, 0, 100)

            onChange({ h: Math.round(angle), s: Math.round(saturation), v: hsv.v })
        },
        [hsv.v, onChange]
    )

    const handlePointerDown = (e: React.PointerEvent) => {
        ;(e.target as Element).setPointerCapture(e.pointerId)
        updateFromPointer(e.clientX, e.clientY)
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (e.buttons !== 1) return
        updateFromPointer(e.clientX, e.clientY)
    }

    // Position of the handle inside the wheel.
    const radius = SIZE / 2
    const rad = (hsv.h * Math.PI) / 180
    const r = (hsv.s / 100) * radius
    const handleX = radius + Math.cos(rad) * r
    const handleY = radius + Math.sin(rad) * r

    const selected = hsvToRgb(hsv)

    return (
        <div className="flex flex-col items-center gap-5">
            <div
                ref={wheelRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                className="relative cursor-crosshair touch-none rounded-full shadow-inner ring-1 ring-white/10"
                style={{
                    width: SIZE,
                    height: SIZE,
                    background: `
                        radial-gradient(circle at center, #fff 0%, rgba(255,255,255,0) 70%),
                        conic-gradient(from 90deg, red, magenta, blue, cyan, lime, yellow, red)
                    `,
                }}
            >
                {/* Brightness overlay (value) */}
                <div
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{ backgroundColor: '#000', opacity: 1 - hsv.v / 100 }}
                />

                {/* Draggable handle */}
                <div
                    className="pointer-events-none absolute rounded-full border-2 border-white shadow-md"
                    style={{
                        width: HANDLE,
                        height: HANDLE,
                        left: handleX - HANDLE / 2,
                        top: handleY - HANDLE / 2,
                        backgroundColor: `rgb(${selected.r}, ${selected.g}, ${selected.b})`,
                    }}
                />
            </div>

            {/* Brightness slider */}
            <div className="w-full">
                <label className="mb-1 block text-xs font-medium text-gray-400">
                    Brightness
                </label>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={hsv.v}
                    onChange={e =>
                        onChange({ ...hsv, v: Number(e.target.value) })
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full"
                    style={{
                        background: `linear-gradient(to right, #000, ${`rgb(${hsvToRgb({ ...hsv, v: 100 }).r}, ${hsvToRgb({ ...hsv, v: 100 }).g}, ${hsvToRgb({ ...hsv, v: 100 }).b})`})`,
                    }}
                />
            </div>
        </div>
    )
}
