import { useSignalState } from 'onyx-m2-react'
import React from 'react'
import { HeroTextUnits, HeroTextValue, SecondaryTextIndicator } from '../Base'
import LaneKeepingIndicator from '../indicators/LaneKeepingIndicator'
import DriveBannerIndicator from '../indicators/DriveBannerIndicator'

const REGEN_POWER_SNA = 155
const DRIVE_POWER_SNA = 511

/**
 * Display component that is automatically shown as the default while driving.
 * @param {} props
 * @returns
 */
export default function DriveDisplay() {

  // current power going from/to the inverter
  const elecPower = useSignalState('DI_elecPower', 0)

  // max drive power
  let drivePowerLimit = useSignalState('DI_sysDrivePowerMax', '-')
  if (drivePowerLimit === DRIVE_POWER_SNA) {
    drivePowerLimit = '-'
  }

  // max regen power
  let regenPowerLimit = useSignalState('DI_sysRegenPowerMax', '-')
  if (regenPowerLimit === REGEN_POWER_SNA) {
    regenPowerLimit = '-'
  }

  // current non-drivetrain (aux) power draw
  const packVoltage = useSignalState('BMS_packVoltage', 0)
  const packCurrent = useSignalState('BMS_packCurrent', 0)
  const auxPower = Math.max(0, ((packVoltage * packCurrent / 1000) - elecPower))

  return (
    <g className='DriveDisplay'>
      <HeroTextValue y={-20}>{Math.abs(elecPower).toFixed(0)}</HeroTextValue>
      <HeroTextUnits y={-17}>kw</HeroTextUnits>

      <LaneKeepingIndicator />
      <DriveBannerIndicator />

      <path fill='none' stroke='white' strokeWidth={0.2} d={`
          M ${-40} ${17}
          H ${40}
          M ${-12} ${20}
          V 34
          M ${12} ${20}
          V 34
      `}/>

      <SecondaryTextIndicator x={-22} y={27} value={regenPowerLimit} units='regen' />
      <SecondaryTextIndicator x={0} y={27} value={auxPower.toFixed(1)} units='aux' />
      <SecondaryTextIndicator x={22} y={27} value={drivePowerLimit} units='drive' />
    </g>
  )
}
