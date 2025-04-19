"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface InterestRateChartProps {
  asset: {
    symbol: string
    name: string
    apy: number
  }
}

const generateInterestData = (baseApy: number) => {
  const data = []

  // Generate utilization rates from 0% to 100%
  for (let utilization = 0; utilization <= 100; utilization += 5) {
    // Interest rate model: base rate at 0% utilization,
    // optimal rate at 80% utilization (baseApy),
    // and then sharp increase after 80%
    let rate

    if (utilization <= 80) {
      // Linear increase up to optimal point
      rate = (baseApy * utilization) / 80
    } else {
      // Exponential increase after optimal point
      const excess = utilization - 80
      rate = baseApy + baseApy * excess * 0.25
    }

    data.push({
      utilization: utilization,
      rate: Number.parseFloat(rate.toFixed(2)),
    })
  }

  return data
}

export function InterestRateChart({ asset }: InterestRateChartProps) {
  const [data, setData] = useState(() => generateInterestData(asset.apy))

  useEffect(() => {
    setData(generateInterestData(asset.apy))
  }, [asset])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <XAxis
          dataKey="utilization"
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                  <p className="text-sm text-gray-500">Utilization: {payload[0].payload.utilization}%</p>
                  <p className="text-base font-bold text-gray-900">Interest Rate: {payload[0].value}%</p>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#00A3FF"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: "#00A3FF", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
