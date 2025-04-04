"use client"

import { useEffect, useRef } from "react"

export default function TokenPriceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Generate mock price data
    const generatePriceData = () => {
      const data = []
      let price = 0.04

      for (let i = 0; i < 30; i++) {
        // Random price movement
        price = price + (Math.random() * 0.006 - 0.003)
        // Ensure price doesn't go below 0.01
        price = Math.max(0.01, price)
        data.push(price)
      }

      return data
    }

    const priceData = generatePriceData()

    // Draw chart
    const drawChart = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Find min and max values for scaling
      const minPrice = Math.min(...priceData) * 0.9
      const maxPrice = Math.max(...priceData) * 1.1
      const priceRange = maxPrice - minPrice

      // Draw grid lines
      ctx.strokeStyle = "#e5e7eb" // Light gray
      ctx.lineWidth = 1

      // Horizontal grid lines
      for (let i = 0; i <= 4; i++) {
        const y = height - height * (i / 4)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()

        // Price labels
        const price = minPrice + priceRange * (i / 4)
        ctx.fillStyle = "#6b7280" // Gray
        ctx.font = "12px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(`$${price.toFixed(4)}`, 5, y - 5)
      }

      // Draw price line
      ctx.strokeStyle = "#3b82f6" // Blue
      ctx.lineWidth = 2
      ctx.beginPath()

      // Calculate x and y coordinates for each data point
      priceData.forEach((price, index) => {
        const x = (index / (priceData.length - 1)) * width
        const normalizedPrice = (price - minPrice) / priceRange
        const y = height - normalizedPrice * height

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Fill area under the line
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fillStyle = "rgba(59, 130, 246, 0.1)" // Light blue
      ctx.fill()
    }

    drawChart()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

