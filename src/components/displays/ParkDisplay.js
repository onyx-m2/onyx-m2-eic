import { useSignalState } from 'onyx-m2-react'
import React from 'react'
import { HeroTextValue, SecondaryTextValue, TextUnits } from '../Base'

/**
 * Display component that is automatically shown as the default while driving.
 * @param {} props
 * @returns
 */
export default function ParkDisplay() {
  const odometer = useSignalState('DI_odometer')
  return (
    <g className='ParkDisplay'>
      <HeroTextValue y={-16}>P</HeroTextValue>
      {odometer &&
        <g className='Odometer' visible={odometer}>
          <SecondaryTextValue y={22}>{odometer.toLocaleString(undefined, {maximumFractionDigits: 0})}</SecondaryTextValue>
          <TextUnits y={24}>km</TextUnits>
        </g>
      }
    </g>
  )
}
