import React from 'react'
import styled from 'styled-components'
import { TextUnits } from '../Base'
import BannerIndicator from '../indicators/BannerIndicator'
import { ReactComponent as TeslaLogo } from '../../assets/tesla.svg'

const PALE_COLOR = 'rgb(178, 178, 178, 0.5)'

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
      <TeslaLogo x='-15' y='-76' width='30' fill={PALE_COLOR} />
      <PaleText y='20'>PRESS BRAKE PEDAL</PaleText>
      <PaleText y='26'>TO START CAR</PaleText>
      <BannerIndicator visible text='ONYX' color='url(#blue-indicator-gradient)' />
    </g>
  )
}

const PaleText = styled(TextUnits)`
  fill: ${props => PALE_COLOR};
`
