"use client"

import { useEffect, useRef } from "react"

export default function VantaCloud({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const effectRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    const el = ref.current
    if (!el) return

    ;(async () => {
      const THREE = await import("three")
      const CLOUDS = await import("vanta/dist/vanta.clouds.min" as string)

      if (cancelled) return
      effectRef.current = CLOUDS.default({
        el,
        THREE,
        skyColor: 0x87ceeb,
        cloudColor: 0xffffff,
        cloudShadowColor: 0xc8d8e8,
        sunColor: 0xffffff,
        sunGlareColor: 0xffffff,
        sunlightColor: 0xffffff,
        speed: 0.3,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 0.75,
        scaleMobile: 0.75,
      })
    })()

    return () => {
      cancelled = true
      if (effectRef.current) {
        effectRef.current.destroy()
        effectRef.current = null
      }
    }
  }, [])

  return <div ref={ref} className={className} />
}
