"use client"

import { useEffect, useRef } from "react"

interface Order {
  price: number
  amount: number
}

interface OrderbookProps {
  orderbook: {
    asks: Order[]
    bids: Order[]
  }
}

export function OrderbookVisualizer({ orderbook }: OrderbookProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Calculate max amount for scaling
    const allOrders = [...orderbook.asks, ...orderbook.bids]
    const maxAmount = Math.max(...allOrders.map((order) => order.amount))

    // Calculate price range
    const allPrices = allOrders.map((order) => order.price)
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const priceRange = maxPrice - minPrice
    const pricePadding = priceRange * 0.1

    // Draw background
    ctx.fillStyle = "rgba(249, 250, 251, 0.8)"
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Draw grid lines
    ctx.strokeStyle = "rgba(203, 213, 225, 0.5)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = (rect.height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(rect.width, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i <= 4; i++) {
      const x = (rect.width / 4) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, rect.height)
      ctx.stroke()
    }

    // Draw asks (sell orders)
    const drawOrders = (orders: Order[], color: string, isAsk: boolean) => {
      const halfHeight = rect.height / 2
      const startY = isAsk ? 0 : halfHeight
      const height = halfHeight

      ctx.fillStyle = color

      orders.forEach((order, index) => {
        // Calculate width based on amount relative to max amount
        const width = (order.amount / maxAmount) * rect.width

        // Calculate x position based on price
        const pricePosition =
          (order.price - minPrice + (isAsk ? pricePadding : -pricePadding)) / (priceRange + 2 * pricePadding)
        const x = isAsk ? rect.width - width : 0

        // Calculate y position
        const orderHeight = height / orders.length
        const y = startY + index * orderHeight

        // Draw order rectangle
        ctx.globalAlpha = 0.5
        ctx.fillRect(x, y, width, orderHeight)

        // Draw price line
        ctx.globalAlpha = 1
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x + (isAsk ? 0 : width), y)
        ctx.lineTo(x + (isAsk ? 0 : width), y + orderHeight)
        ctx.stroke()
      })
    }

    // Draw asks (sell orders) in red
    drawOrders(orderbook.asks, "rgba(239, 68, 68, 0.8)", true)

    // Draw bids (buy orders) in green
    drawOrders(orderbook.bids, "rgba(74, 222, 128, 0.8)", false)

    // Draw spread line
    const spreadY = rect.height / 2
    ctx.strokeStyle = "rgba(59, 130, 246, 0.5)"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, spreadY)
    ctx.lineTo(rect.width, spreadY)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw energy flow particles
    const drawParticles = () => {
      const particleCount = 20
      const now = Date.now() / 1000

      for (let i = 0; i < particleCount; i++) {
        const t = now + i * 0.2
        const x = (Math.sin(t * 2) * 0.5 + 0.5) * rect.width
        const y = spreadY + Math.sin(t * 5) * 5

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 5)
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)")
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    drawParticles()
  }, [orderbook])

  return <canvas ref={canvasRef} className="h-full w-full rounded-md" style={{ width: "100%", height: "100%" }} />
}
