"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface TradingChartProps {
  pair: {
    name: string
    price: number
    change: number
  }
}

const generateChartData = (basePrice: number, volatility: number) => {
  const data = []
  const timeLabels = []

  // Generate time labels for the last 24 hours
  for (let i = 24; i >= 0; i--) {
    const date = new Date()
    date.setHours(date.getHours() - i)
    timeLabels.push(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }

  let price = basePrice

  for (let i = 0; i < 25; i++) {
    // Random price movement with trend based on change percentage
    const change = (Math.random() - 0.5) * volatility * basePrice
    price += change

    // Ensure price doesn't go below 0.1
    price = Math.max(price, 0.1)

    data.push({
      time: timeLabels[i],
      price: price,
    })
  }

  return data
}

export function TradingChart({ pair }: TradingChartProps) {
  const [data, setData] = useState(() => generateChartData(pair.price, 0.01))

  // Regenerate data when pair changes
  useEffect(() => {
    setData(generateChartData(pair.price, 0.01))
  }, [pair])

  const isPositive = pair.change >= 0
  const gradientColor = isPositive ? "#4ADE80" : "#EF4444"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
            <stop offset="95%" stopColor={gradientColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={["auto", "auto"]}
          tickFormatter={(value) => `${value.toFixed(2)}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                  <p className="text-sm text-gray-500">{payload[0].payload.time}</p>
                  <p className="text-base font-bold text-gray-900">${payload[0].value?.toFixed(4)}</p>
                </div>
              )
            }
            return null
          }}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={gradientColor}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorPrice)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
