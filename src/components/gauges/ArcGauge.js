import React, { Children, cloneElement } from 'react'
import styled from 'styled-components'
import { AnimatedPath } from '../Base'

/**
 * Arc gauge component specified by a radius, height, and a width. The gauge will be
 * centered vertically, and it's horizontal position is determined by the radius. The
 * gauge assumes a centered view box. The width specifies the thickness of the gauge
 * itself.
 *
 * The gauge accepts `Indicator` children that will be displayed (in overlapping
 * fashion) and these have values of interest. All values must be normalized by
 * callers to be between 0 and 100.
 */
export default function ArcGauge(props) {
  const { height, radius, children } = props
  const width = props.width || 2

  const bottom = height / 2
  const minAngle = Math.asin(bottom / radius)
  const x1 = Math.cos(minAngle) * radius
  const y1 = Math.sin(minAngle) * radius

  const top = - height / 2
  const maxAngle = Math.asin(top / radius)
  var x2 = Math.cos(maxAngle) * radius
  var y2 = Math.sin(maxAngle) * radius

  return (
    <g className='ArcGauge'>
      <TickedBackground x1={x1} y1={y1} x2={x2} y2={y2} radius={radius} width={width}/>
      {Children.map(children, c => cloneElement(c, {
        ...c.props, x1, y1, x2, y2, radius, width
      }))}
    </g>
  )
}

/**
 * An indicator component for the arc gauge, specified by a value and a color. Values
 * passed to indicators are normalized to 0-100 range. Multiple indicators can be used
 * with in a single gauge and are drawn in order (so the second one is drawn on top of
 * of the first one).
 */
export function Indicator(props) {
  const { value, color, x1, y1, x2, y2, radius, width } = props
  const clampedValue = Math.max(0, Math.min(100, value))
  const offset = (radius > 0 ? 1 : -1) * width / 2
  const sweep = radius > 0 ? 0 : 1
  const dashOffset = (100 - clampedValue) / 100
  return (
    <g className='Indicator'>
      <AnimatedPath style={{strokeDashoffset: dashOffset}} pathLength={1} fill='none' stroke={color} strokeWidth={width}
        d={`
          M ${x1 + offset}, ${y1}
          A ${radius}, ${radius} 0 0 ${sweep} ${x2 + offset}, ${y2}
        `}
        />
    </g>
  )
}

function TickedBackground(props) {
  const { x1, y1, x2, y2, radius, width } = props
  const offset = (radius > 0 ? 1 : -1) * width / 2
  const sweep = radius > 0 ? 0 : 1
  return (
    <g className='HashedBackground'>
      <TickedPath strokeWidth={width}
        d={`
          M ${x1 + offset}, ${y1}
          A ${radius}, ${radius} 0 0 ${sweep} ${x2 + offset}, ${y2}
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
