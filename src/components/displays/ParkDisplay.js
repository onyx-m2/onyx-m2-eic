import { useSignalState } from 'onyx-m2-react'
import React from 'react'
import { HeroTextValue, SecondaryTextIndicator } from '../Base'

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
  const odometer = useSignalState('UI_odometer', ODOMETER_SNA)
  const nominalFullPack = useSignalState('BMS_nominalFullPackEnergy', 0)
  const initialFullPack = useSignalState('BMS_initialFullPackEnergy', 0)

  var odometerText = '-'
  if (odometer !== ODOMETER_SNA) {
    odometerText = odometer.toLocaleString(undefined, {maximumFractionDigits: 0})
  }

  var capacityText = '-'
  if (nominalFullPack && initialFullPack) {
    const capacity = nominalFullPack * 100 / initialFullPack
    capacityText = capacity.toLocaleString(undefined, {maximumFractionDigits: 0}) + '%'
  }

  return (
    <g className='ParkDisplay'>
      <HeroTextValue y={-16}>P</HeroTextValue>
      <SecondaryTextIndicator x={-18} y={18} value={odometerText} units='km' />
      <SecondaryTextIndicator x={18}  y={18} value={capacityText} units='capacity' />
    </g>
  )
}
