import React from 'react'
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'

// Maximum possible score (e.g., 5)
const MAX_SCORE = 5

// Determine gauge color based on score thresholds
const getColor = (score) => {
  if (score >= 3.5) return '#67BF4F'    // Green (Thriving)
  if (score >= 2.3) return '#FDD835'    // Yellow (Challenged)
  return '#EF5350'                      // Red (Needs Improvement)
}

// Determine descriptor text based on score
const getDescriptor = (score) => {
  if (score >= 3.5) return 'Thriving'
  if (score >= 2.3) return 'Challenged'
  return 'Needs Improvement'
}

/**
 * MFADials component displays four half-circle gauges for different MFA dimensions.
 * @param {{ emotional: number, social: number, family: number, spiritual: number }} scores
 */
export default function MFADials({ scores }) {
  const dimensions = [
    { key: 'emotional', label: 'EMOTIONAL', score: scores.emotional },
    { key: 'social',    label: 'SOCIAL/PROFESSIONAL', score: scores.social },
    { key: 'family',    label: 'FAMILY/PERSONAL', score: scores.family },
    { key: 'spiritual', label: 'SPIRITUAL', score: scores.spiritual }
  ]

  return (
    <div className="mx-auto w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Your Mental Fitness Scores</h3>
      <div className="grid grid-cols-2 gap-8 items-center">
        {dimensions.map(({ key, label, score }) => {
          // Calculate percentage of 180° arc
          const raw = (score / MAX_SCORE) * 100
          const percentage = Math.max(0, Math.min(100, raw))
          const color = getColor(score)
          const descriptor = getDescriptor(score)

          return (
            <div key={key} className="flex flex-col items-center">
              <span className="text-sm font-semibold text-gray-700 mb-2">{label}</span>
              <RadialBarChart
                width={160}
                height={80}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={50}
                outerRadius={72}
                data={[{ value: percentage }]}
              >
                {/* Force domain to [0,100] so arc length scales properly */}
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  dataKey="value"
                  background={{ fill: '#F2F2F2' }}
                  cornerRadius={72}
                  clockWise
                  fill={color}
                />
              </RadialBarChart>
              <div className="mt-2 text-lg font-bold" style={{ color }}>
                {score.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">{descriptor}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
