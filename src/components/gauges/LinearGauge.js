import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { FadeableGroup } from '../Base'

// from, to
// ranges: [{ from, to, color}]
// markers: [{ value, color }]
export default function LinearGauge(props) {
  const { from, to, length, visible, value, color } = props
  // const scaleX = invert ? -1 : 1
  // const offset = -from
  const interval = length / (to - from)
  return (
    <FadeableGroup visible={visible}>
      <Range from={from} to={to} min={from} max={to} offset={0} interval={interval} />
      <Marker min={from} max={to} value={value} color={color} offset={0} interval={interval}  />
    </FadeableGroup>
  )
}

export function Range(props) {
  const theme = useContext(ThemeContext)
  const { from, to, offset, interval, min, max, vertical } = props

  var x1 = from
  if (from !== min) {
    x1 += 1
  }
  x1 = (x1 + offset) * interval

  var x2 = to
  if (to !== max) {
    x2 -= 1
  }
  x2 = (x2 + offset) * interval

  var y1 = -2
  var y2 = 2

  if (vertical) {
    var t = y1
    y1 = x1
    x1 = t
    t = y2
    y2 = x2
    x2 = t
  }

  return (
    <path fill='none' stroke={theme.color.primary} strokeWidth={1}
      d={`
        M -27 4
        H 27
        M 0 -2
        V 4
      `}
      />
  )
}

export function Marker(props) {
  const { value, color, offset, interval, min, max } = props
  var x = value
  if (x < min) {
    x = min
  }
  if (x > max) {
    x = max
  }
  x = (x + offset) * interval
  return (
    <AnimatedCircle stroke='black' strokeWidth={2} fill={color} cy={4} r={3} transform={`translate(${x}, 0)`} />
  )
}

const AnimatedCircle = styled.circle`
  transition: all 0.3s ease;
`