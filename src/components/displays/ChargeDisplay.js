import { useNamedValuesSignalState, useSignalState } from 'onyx-m2-react'
import React from 'react'
import { HeroTextUnits, HeroTextValue, SecondaryHorizontalTextIndicator } from '../Base'
import BannerIndicator from '../indicators/BannerIndicator'

/**
 * Display that presents the current state of charging, the power being dumped into
 * the battery, the line voltage and amperage, and the time remaining until the car
 * is fully charged.
 *
 * @param {} props
 * @returns
 */
export default function ChargeDisplay() {
  const [ state, states ] = useNamedValuesSignalState('BMS_uiChargeStatus', 'DISCONNECTED')
  const chargeHoursRemaining = useSignalState('BMS_chgTimeToFull', 0)
  const energyToChargeComplete = useSignalState('BMS_energyToChargeComplete', 0)
  const lineVoltage = useSignalState('CC_line1Voltage', 0)
  const pilotCurrent = useSignalState('CP_pilotCurrent', 0)

  const packVoltage = useSignalState('BMS_packVoltage', 0)
  const packCurrent = useSignalState('BMS_packCurrent', 0)
  const chargePower = -(packVoltage * packCurrent / 1000)
  const precision = (chargePower < 10) ? 1 : 0

  // format charging stats
  let chargingText, chargingColor
  if (state === states.CHARGE_COMPLETE || energyToChargeComplete === 0) {
    chargingText = 'COMPLETE'
    chargingColor = 'url(#yellow-indicator-gradient)'
  }
  else if (state === states.DISCONNECTED || state === states.NO_POWER) {
    chargingText = 'PLUG IN'
    chargingColor = 'url(#red-indicator-gradient)'
  }
  else if (state === states.ABOUT_TO_CHARGE) {
    chargingText = 'PREPARING'
    chargingColor = 'url(#yellow-indicator-gradient)'
  }
  else if (state === states.CHARGING) {
    chargingText = 'CHARGING'
    chargingColor = 'url(#blue-indicator-gradient)'
  }
  else if (state === states.CHARGE_STOPPED) {
    chargingText = 'STOPPED'
    chargingColor = 'url(#red-indicator-gradient)'
  }

  // format charge time remaining
  let chargeTime = chargeHoursRemaining.toFixed(1)
  let chargeTimeUnits = 'hours'
  if (chargeHoursRemaining < 1) {
    chargeTime = (chargeHoursRemaining * 60).toFixed(0)
    chargeTimeUnits = 'mins'
  }
  if (energyToChargeComplete === 0) {
    chargeTime = '0'
    chargeTimeUnits = 'mins'
  }

  return (
    <g className='ChargeDisplay'>
      <HeroTextValue y={-16}>{chargePower.toFixed(precision)}</HeroTextValue>
      <HeroTextUnits y={-13}>kw</HeroTextUnits>

      <BannerIndicator visible={true} text={chargingText} color={chargingColor}/>

      <path fill='none' stroke='white' strokeWidth={0.2} d={`
          M ${-32} ${13}
          H ${32}
          M ${-9} ${16}
          V 30
          M ${9} ${16}
          V 30
      `}/>
      <SecondaryHorizontalTextIndicator x={-19} y={23} value={lineVoltage} units='volts' />
      <SecondaryHorizontalTextIndicator x={0} y={23} value={chargeTime} units={chargeTimeUnits} />
      <SecondaryHorizontalTextIndicator x={19} y={23} value={pilotCurrent} units='amps' />
    </g>
  )
}
