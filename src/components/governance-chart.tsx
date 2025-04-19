"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const generateGovernanceData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const data = []

  for (let i = 0; i < months.length; i++) {
    const passed = Math.floor(Math.random() * 5) + 3
    const rejected = Math.floor(Math.random() * 3) + 1

    data.push({
      month: months[i],
      passed,
      rejected,
      total: passed + rejected,
    })
  }

  return data
}

export function GovernanceChart() {
  const [data, setData] = useState(() => generateGovernanceData())

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                  <p className="mb-1 font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-green-600">Passed: {payload[0].value}</p>
                  <p className="text-sm text-red-600">Rejected: {payload[1].value}</p>
                  <p className="text-sm text-gray-600">Total: {payload[0].value + payload[1].value}</p>
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="passed" stackId="a" fill="#4ADE80" radius={[4, 4, 0, 0]} />
        <Bar dataKey="rejected" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
