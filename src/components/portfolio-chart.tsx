"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface PortfolioChartProps {
  timeframe: string
}

const generateData = (timeframe: string) => {
  const data = []
  let points = 0
  let labels = []
  const startValue = 450000
  let volatility = 0

  switch (timeframe) {
    case "1w":
      points = 7
      labels = Array.from({ length: points }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (points - i - 1))
        return d.toLocaleDateString("en-US", { weekday: "short" })
      })
      volatility = 0.01
      break
    case "1m":
      points = 30
      labels = Array.from({ length: points }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (points - i - 1))
        return d.getDate()
      })
      volatility = 0.015
      break
    case "3m":
      points = 12
      labels = Array.from({ length: points }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (points - i - 1) * 7)
        return `Week ${i + 1}`
      })
      volatility = 0.02
      break
    case "1y":
      points = 12
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      volatility = 0.03
      break
    case "all":
      points = 5
      labels = ["2020", "2021", "2022", "2023", "2024"]
      volatility = 0.05
      break
    default:
      points = 30
      labels = Array.from({ length: points }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (points - i - 1))
        return d.getDate()
      })
      volatility = 0.015
  }

  let value = startValue

  for (let i = 0; i < points; i++) {
    // Random fluctuation with upward trend
    const change = value * (Math.random() * volatility * 2 - volatility + 0.005)
    value += change

    data.push({
      name: labels[i],
      value: Math.round(value),
    })
  }

  return data
}

export function PortfolioChart({ timeframe }: PortfolioChartProps) {
  const [data, setData] = useState(() => generateData(timeframe))

  useEffect(() => {
    setData(generateData(timeframe))
  }, [timeframe])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FFE66D" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={["auto", "auto"]}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                  <p className="text-sm text-gray-500">{payload[0].payload.name}</p>
                  <p className="text-base font-bold text-gray-900">${payload[0].value?.toLocaleString()}</p>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="url(#gradient)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: "#FF6B6B", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
