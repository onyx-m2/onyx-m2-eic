import React, { Children, cloneElement } from 'react'
import styled from 'styled-components'


// from, to
// ranges: [{ from, to, color}]
// markers: [{ value, color }]
export default function ArcGauge(props) {
  const { from, to, height, radius, width, children } = props

  const top = - height / 2
  const bottom = height / 2

  const uMin = from
  const uMax = to

  const aMin = Math.asin(bottom / radius)
  const aMax = Math.asin(top / radius)

  const aPerU = (aMax - aMin) / (uMax - uMin)

  return (
    // <svg style={{position: 'absolute'}} viewBox='-100, -46, 200, 100' >
    <g>
      {Children.map(children, c => cloneElement(c, {
        ...c.props, top, bottom, radius, uMin, uMax, aMin, aMax, aPerU, width
      }))}
    </g>
  )
}

export function Ranges(props) {
  return (
    <g>
      {props.children}
    </g>
  )
}

export function Scale(props) {
  const { from, to, color, radius, aMin, aPerU } = props
  const width = props.width || 2

  const a1 = aMin + from * aPerU
  const a2 = aMin + to * aPerU
  // if (from !== uMin) {
  //   y1 -= 1
  // }
  // if (to !== uMax) {
  //   y2 += 1
  // }

  var x1 = Math.cos(a1) * radius
  var x2 = Math.cos(a2) * radius

  var y1 = Math.sin(a1 /*- aMin*/) * radius// + top
  var y2 = Math.sin(a2 /*- aMin*/) * radius// + top

  var hOffset = (radius > 0 ? 1 : -1) * width

  var sweep1 = radius > 0 ? 0 : 1
  var sweep2 = radius < 0 ? 0 : 1

  // var textOffset = radius > 0 ? width + 3 : - width - 3
  // var textAnchor = radius > 0 ? 'start' : 'end'

  return (
    <g>
      <path fill={color} stroke='none'
        d={`
          M ${x1}, ${y1}
          A ${radius}, ${radius} 0 0 ${sweep1} ${x2}, ${y2}
          h ${hOffset}
          A ${radius + hOffset }, ${radius + hOffset} 0 0 ${sweep2} ${x1 + hOffset}, ${y1}
          z
        `}
        />
      {/* {from !== uMin &&
        <Value className='gauge-font' x={x1 + textOffset} y={y1} textAnchor={textAnchor} fill='white'>{from}</Value>
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

export function Indicator(props) {
  const { from, to, color, radius, aMin, aPerU } = props
  const width = props.width || 2

  const a1 = aMin + from * aPerU
  const a2 = aMin + to * aPerU

  var x1 = Math.cos(a1) * radius
  var x2 = Math.cos(a2) * radius

  var y1 = Math.sin(a1 /*- aMin*/) * radius// + top
  var y2 = Math.sin(a2 /*- aMin*/) * radius// + top

  var hOffset = (radius > 0 ? 1 : -1) * width / 2

  var sweep = radius > 0 ? 0 : 1

  // var textOffset = radius > 0 ? width + 3 : - width - 3
  // var textAnchor = radius > 0 ? 'start' : 'end'

  return (
    <g>
      <path fill='none' stroke={color} strokeWidth={width}
        d={`
          M ${x1 + hOffset}, ${y1}
          A ${radius}, ${radius} 0 0 ${sweep} ${x2 + hOffset}, ${y2}
        `}
        />
      {/* {from !== uMin &&
        <Value className='gauge-font' x={x1 + textOffset} y={y1} textAnchor={textAnchor} fill='white'>{from}</Value>
      } */}

    </g>
  )
}

const AnimatedPath = styled.path`
  transition: all 0.3s ease;
`