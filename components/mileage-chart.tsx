"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", "Toyota Camry": 2500, "Honda Accord": 2100, "Ford Explorer": 3200 },
  { month: "Feb", "Toyota Camry": 2300, "Honda Accord": 1800, "Ford Explorer": 2900 },
  { month: "Mar", "Toyota Camry": 2800, "Honda Accord": 2400, "Ford Explorer": 3500 },
  { month: "Apr", "Toyota Camry": 2600, "Honda Accord": 2200, "Ford Explorer": 3100 },
  { month: "May", "Toyota Camry": 3000, "Honda Accord": 2500, "Ford Explorer": 3800 },
  { month: "Jun", "Toyota Camry": 2900, "Honda Accord": 2300, "Ford Explorer": 3600 },
]

export function MileageChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Toyota Camry" stroke="#3b82f6" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Honda Accord" stroke="#10b981" />
        <Line type="monotone" dataKey="Ford Explorer" stroke="#f59e0b" />
      </LineChart>
    </ResponsiveContainer>
  )
}

