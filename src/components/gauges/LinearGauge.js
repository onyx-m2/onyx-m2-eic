import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { FadeableGroup } from '../Base'

// SVG doesn't seem to want to play nice with dynamic sizing (which is ironic for a
// scalable vector format), so we'll have to pass in the length of the gauge.

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
      <Range from={from} to={to} min={from} max={to} offset={0} interval={interval} color={'white'} />
      <Marker min={from} max={to} value={value} color={color} offset={0} interval={interval}  />
    </FadeableGroup>
    // <g transform={`scale(${scaleX}, 1)`}>
    //   {Children.map(children, c => cloneElement(c, {
    //     ...c.props, offset, interval, min, max, vertical
    //   }))}
    // </g>
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
    <path fill='none' stroke={theme.scale.white} strokeWidth={1}
      d={`
        M -21 4
        H 21
        M 0 -2
        V 4
      `}
      />
    // <AnimatedRect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill={color} />
  )
}

// const AnimatedRect = styled.rect`
//   transition: all 0.3s ease;
// `

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
    // <AnimatedPath fill={color} stroke='black' strokeWidth='2' strokeLinecap='square' transform={`translate(${x}, -2)`}
    //   d='
    //     M -8 16
    //     L 0 0
    //     L 8 16
    //     Z
    //   '
    // />
  )
}

const AnimatedCircle = styled.circle`
  transition: all 0.3s ease;
`