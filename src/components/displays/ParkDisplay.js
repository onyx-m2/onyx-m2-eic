import { useSignalState } from 'onyx-m2-react'
import React from 'react'
import { FadeableGroup, HeroTextValue, SecondaryTextValue, TextUnits } from '../Base'

const ODOMETER_SNA = 4294967.295  // SNA is actually 0xffffffff but the dbc calls
                                  // for scaling the value by 0.001, which the code
                                  // because it doesn't VAL values before applying the
                                  // scaling and offset factors; ask me how much time
                                  // I wasted because of this... :)

/**
 * Display component that is automatically shown as the default while driving.
 * @param {} props
 * @returns
 */
export default function ParkDisplay() {
  const odometer = useSignalState('DI_odometer', ODOMETER_SNA)
  return (
    <g className='ParkDisplay'>
      <HeroTextValue y={-16}>P</HeroTextValue>
      <FadeableGroup className='Odometer' visible={odometer !== ODOMETER_SNA}>
        <SecondaryTextValue y={22}>{odometer.toLocaleString(undefined, {maximumFractionDigits: 0})}</SecondaryTextValue>
        <TextUnits y={24}>km</TextUnits>
      </FadeableGroup>
    </g>
  )
}
