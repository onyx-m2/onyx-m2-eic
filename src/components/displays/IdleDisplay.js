import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

/**
 * Display component that is automatically shown when the car is idle (i.e. the drive
 * inverter is off). This can be at the start of a driver, before the brake pedal is
 * depressed, or after a drive once the driver leaves (but before all doors are closed).
 * @param {} props
 * @returns
 */
export default function IdleDisplay() {
  const theme = useContext(ThemeContext)
  return (
    <g className='IdleDisplay'>
      <circle r='38' fill='url(#ball-gradient)' />
      <text
        fontFamily={theme.font.family.bold}
        textAnchor='middle'
        dominantBaseline='middle'
      >
        ONYX
      </text>
    </g>
  )
}
