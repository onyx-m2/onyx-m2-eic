import { useSignalState } from 'onyx-m2-react'
import React from 'react'
import { HeroTextUnits, HeroTextValue, SecondaryTextValue, TextUnits } from '../Base'
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
      <HeroTextValue y={-16}>{Math.abs(elecPower).toFixed(0)}</HeroTextValue>
      <HeroTextUnits y={-13}>kw</HeroTextUnits>

      <LaneKeepingIndicator />
      <DriveBannerIndicator />

      <path fill='none' stroke='white' strokeWidth={0.2} d={`
          M ${-32} ${13}
          H ${32}
          M ${-9} ${16}
          V 30
          M ${9} ${16}
          V 30
      `}/>

      <SecondaryTextValue x={-19} y={23}>{regenPowerLimit}</SecondaryTextValue>
      <TextUnits x={-19} y={25}>regen</TextUnits>

      <SecondaryTextValue x={0} y={23}>{auxPower.toFixed(1)}</SecondaryTextValue>
      <TextUnits x={0} y={25}>aux</TextUnits>

      <SecondaryTextValue x={19} y={23}>{drivePowerLimit}</SecondaryTextValue>
      <TextUnits x={19} y={25}>drive</TextUnits>
    </g>
  )
}
