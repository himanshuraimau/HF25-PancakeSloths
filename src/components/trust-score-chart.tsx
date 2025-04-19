"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const generateTrustScoreData = () => {
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"]
  const data = []

  // Start with a base score and gradually improve it
  let score = 75

  for (let i = 0; i < months.length; i++) {
    // Add some random fluctuation but with an upward trend
    const change = Math.random() * 5 - 1 + i * 0.5
    score = Math.min(100, Math.max(0, score + change))

    data.push({
      month: months[i],
      score: Math.round(score),
    })
  }

  return data
}

export function TrustScoreChart() {
  const [data, setData] = useState(() => generateTrustScoreData())

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[50, 100]}
          ticks={[50, 60, 70, 80, 90, 100]}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                  <p className="mb-1 font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-blue-600">Trust Score: {payload[0].value}</p>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#00A3FF"
          strokeWidth={2}
          dot={{ fill: "#00A3FF", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "#00A3FF", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
