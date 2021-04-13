import React, { Children, cloneElement } from 'react'
import styled from 'styled-components'
import { AnimatedPath } from '../Base'

// TODO: Clean up this mess!

// from, to
// ranges: [{ from, to, color}]
// markers: [{ value, color }]
export default function RingGauge(props) {
  const { bottom, radius, width, children } = props

  const wedgeAngle = Math.acos(bottom / radius)
  const startAngle = - 2 * 3 / 4 * Math.PI + wedgeAngle
  const angle = 2 * Math.PI - 2 * wedgeAngle
  const angleIncrements = angle / 100

  return (
    <g>
      {Children.map(children, c => cloneElement(c, {
        ...c.props, bottom, radius, width, startAngle, angleIncrements
      }))}
    </g>
  )
}

export function Section(props) {
  const { from, to, direction, tickGap, radius, width, startAngle, angleIncrements, children } = props

  const sectionFromAngle = startAngle + from * angleIncrements
  const x1 = Math.cos(sectionFromAngle) * radius
  const y1 = Math.sin(sectionFromAngle) * radius

  const sectionToAngle = startAngle + to * angleIncrements
  const x2 = Math.cos(sectionToAngle) * radius
  const y2 = Math.sin(sectionToAngle) * radius

  return (
    <g>
      <TickedBackground x1={x1} y1={y1} x2={x2} y2={y2} radius={radius} width={width} direction={direction} tickGap={tickGap} />
      {Children.map(children, c => cloneElement(c, {
        ...c.props, x1, y1, x2, y2, radius, width, direction
      }))}
    </g>
  )
}

export function Indicator(props) {
  const { value, color, x1, y1, x2, y2, radius, width, direction } = props
  const clampedValue = Math.max(0, Math.min(100, value))
  const dashOffset = (100 - clampedValue) / 100
  const sweepFlag = (direction > 0) ? 1 : 0
  const largeArcFlag = (direction > 0) ? 1 : 0
  return (
    <g className='Indicator'>
      <AnimatedPath style={{strokeDashoffset: dashOffset}} pathLength={1} fill='none' stroke={color} strokeWidth={width}
        d={`
          M ${x1}, ${y1}
          A ${radius}, ${radius} 0 ${sweepFlag} ${largeArcFlag} ${x2}, ${y2}
        `}
        />
    </g>
  )
}


function TickedBackground(props) {
  const { x1, y1, x2, y2, direction, radius, width } = props
  const sweepFlag = (direction > 0) ? 1 : 0
  const largeArcFlag = (direction > 0) ? 1 : 0
  return (
    <g className='TickedBackground'>
      <TickedPath strokeWidth={width}
        d={`
          M ${x1}, ${y1}
          A ${radius}, ${radius} 0 ${sweepFlag} ${largeArcFlag} ${x2}, ${y2}
        `}
        />
    </g>
  )
}

const TickedPath = styled.path`
  fill: none;
  stroke: grey;
  stroke-dasharray: 0.8 1;
 `
