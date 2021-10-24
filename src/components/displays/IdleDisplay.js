import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { TextUnits } from '../Base'
import BannerIndicator from '../indicators/BannerIndicator'
import { ReactComponent as TeslaLogo } from '../../assets/tesla.svg'

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
      <TeslaLogo x='-15' y='-76' width='30' fill={theme.color.primary} />
      <TextUnits y='20'>PRESS BRAKE PEDAL</TextUnits>
      <TextUnits y='26'>TO START CAR</TextUnits>
      <BannerIndicator visible text='ONYX' color='url(#blue-indicator-gradient)' />
    </g>
  )
}
