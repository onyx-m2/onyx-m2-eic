import React, { Children, cloneElement } from 'react'
import styled from 'styled-components'

// TODO: Clean up this mess!

// from, to
// ranges: [{ from, to, color}]
// markers: [{ value, color }]
export default function RingGauge(props) {
  const { from, to, bottom, radius, width, children } = props

  const wedgeAngle = Math.acos(bottom / radius)
  const angle = 2 * Math.PI - 2 * wedgeAngle
  const fromAngle = - 2 * 3 / 4 * Math.PI + wedgeAngle
  const toAngle = fromAngle + angle
  const unitAngle = angle / (to - from)

  return (
    <g>
      {Children.map(children, c => cloneElement(c, {
        ...c.props, bottom, radius, width, fromAngle, toAngle, unitAngle
      }))}
    </g>
  )
}

export function Range(props) {
  const { from, to, color, radius, fromAngle, unitAngle } = props
  const width = props.width || 2

  const rangeFromAngle = fromAngle + from * unitAngle
  const rangeToAngle = fromAngle + to * unitAngle
  const largeArcFlag = (rangeToAngle - rangeFromAngle) > Math.PI ? 1 : 0
  // if (from !== uMin) {
  //   y1 -= 1
  // }
  // if (to !== uMax) {
  //   y2 += 1
  // }

  var x1 = Math.cos(rangeFromAngle) * radius
  var x2 = Math.cos(rangeToAngle) * radius

  var y1 = Math.sin(rangeFromAngle /*- aMin*/) * radius// + top
  var y2 = Math.sin(rangeToAngle /*- aMin*/) * radius// + top

  const outerX1 = Math.cos(rangeFromAngle) * (radius + width)
  const outerY1 = Math.sin(rangeFromAngle) * (radius + width)

  const outerX2 = Math.cos(rangeToAngle) * (radius + width)
  const outerY2 = Math.sin(rangeToAngle) * (radius + width)

  return (
    <AnimatedPath style={{'--stroke-dashoffset': 0}} strokeWidth={3} fill='none' stroke={color}
      d={`
        M ${x1}, ${y1}
        A ${radius}, ${radius} 0 ${largeArcFlag} 1 ${x2}, ${y2}
      `}
    />
  )

  return (
    <g>
      <path fill={color} stroke='none'
        d={`
          M ${x1}, ${y1}
          A ${radius}, ${radius} 0 ${largeArcFlag} 1 ${x2}, ${y2}
          L ${outerX2} ${outerY2}
          A ${radius + width}, ${radius + width} 0 ${largeArcFlag} 0 ${outerX1}, ${outerY1}
          Z
        `}
        />
      {/* {from !== uMin &&
        <Value className='gauge-font' x={x1 + textOffset} y={y1} textAnchor={textAnchor} fill='white'>{from}</Value>
          A ${radius + width}, ${radius + width} 0 0 ${sweep2} ${x1}, ${y1}
          z
      } */}

    </g>
  )

  // // convert up and down to a single frame of reference with zero
  // // as (0, radius), i.e the top of the circle
  // const minDegrees = 360 - up
  // const maxDegrees = down

  // // map the 'from' and 'to' units to degrees in this frame of reference
  // const degreesPerUnit = (down + up) / (max - min)
  // const fromDegrees = minDegrees + from * degreesPerUnit
  // const toDegrees = minDegrees + to * degreesPerUnit

  // //let fromX, fromY
  // // let fromDegreesToHorizontal
  // // if (fromDegrees < 90) {
  // //   fromDegreesToHorizontal = fromDegrees - 90
  // // } else {
  // //   fromDegreesToHorizontal = 90 - fromDegrees
  // // }

  // //const fromRadians = fromDegreesToHorizontal * Math.PI / 180
  // const fromRadians = fromDegrees * Math.PI / 180
  // const fromX = radius * Math.cos(fromRadians) - radius + hOffset
  // const fromY = radius * Math.sin(fromRadians) + radius

  // // let toDegreesToHorizontal, toOffset
  // // if (toDegrees < 90) {
  // //   toDegreesToHorizontal = toDegrees - 90
  // //   toOffset = 0
  // // } else {
  // //   toDegreesToHorizontal = 90 - toDegrees
  // //   toOffset = radius
  // // }

  // //const toRadians = toDegreesToHorizontal * Math.PI / 180
  // const toRadians = toDegrees * Math.PI / 180
  // const toX = radius * Math.cos(toRadians) - radius + hOffset
  // const toY = radius * Math.sin(toRadians) + radius

  // // const sweepUp = -up * Math.PI / 180
  // // const sweepDown = down * Math.PI / 180


  // //const fromX = radius * Math.cos(sweepUp) - radius + hOffset
  // //const fromY = radius * Math.sin(sweepUp) + radius
  // // const toX = radius * Math.cos(sweepDown) - radius + hOffset
  // // const toY = radius * Math.sin(sweepDown) + radius


  // // const fromX = radius * Math.cos(sweepUp) - radius + hOffset
  // // const fromY = radius * Math.sin(sweepUp) + radius
  // // const toX = radius * Math.cos(sweepDown) - radius + hOffset
  // // const toY = radius * Math.sin(sweepDown) + radius

  // return (
  //   <path strokeLinecap='square' strokeWidth={3} fill='none' stroke={color}
  //     d={`
  //       M ${fromX}, ${fromY}
  //       A ${radius}, ${radius} 0 0 1 ${toX}, ${toY}
  //     `}
  //   />
  // )
}

// const Value = styled.text`
//   font-family: 'Gotham Extra Light';
//   font-size: 8px;
// `

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
    <AnimatedPath d='M -8 16 L 0 0 L 8 16 Z'
      fill={color}
      stroke='black'
      stroke-width='2'
      stroke-linecap='square'
      transform={`translate(${x}, -2)`}
    />
  )
}

const AnimatedPath = styled.path`
  --stroke-dashoffset: 0;
  stroke-dasharray: 400;
  stroke-dashoffset: var(--stroke-dashoffset);
`