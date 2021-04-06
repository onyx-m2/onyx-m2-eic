import React from 'react'

/**
 * Display component that is automatically shown when the car is idle (i.e. the drive
 * inverter is off). This can be at the start of a driver, before the brake pedal is
 * depressed, or after a drive once the driver leaves (but before all doors are closed).
 * @param {} props
 * @returns
 */
export default function IdleDisplay() {
  return (
    <g className='IdleDisplay'>
      <circle r='32' fill='url(#ball-gradient)' />
      <text y='0' fontFamily='Gotham Bold' textAnchor='middle' dominantBaseline='middle'>
        ONYX
      </text>
    </g>
  )
}
