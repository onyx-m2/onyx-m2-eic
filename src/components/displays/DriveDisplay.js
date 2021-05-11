import { useSignalState } from 'onyx-m2-react'
import React, { useContext } from 'react'
import { HeroTextUnits, HeroTextValue, SecondaryTextIndicator } from '../Base'
import LaneKeepingIndicator from '../indicators/LaneKeepingIndicator'
import DriveBannerIndicator from '../indicators/DriveBannerIndicator'
import { ThemeContext } from 'styled-components'

const REGEN_POWER_SNA = 155
const DRIVE_POWER_SNA = 511

/**
 * Display component that is automatically shown as the default while driving.
 * @param {} props
 * @returns
 */
export default function DriveDisplay() {
  const theme = useContext(ThemeContext)
  const { center: { indicators : { primary, secondary }}} = theme.geometry

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
      <HeroTextValue y={primary.value}>{Math.abs(elecPower).toFixed(0)}</HeroTextValue>
      <HeroTextUnits y={primary.caption}>kw</HeroTextUnits>

      <LaneKeepingIndicator />
      <DriveBannerIndicator />

      <SecondaryTextIndicator
        x={secondary.left}
        y={secondary.vertical}
        value={regenPowerLimit}
        units='regen'
      />
      <SecondaryTextIndicator
        x={secondary.middle}
        y={secondary.vertical}
        value={auxPower.toFixed(1)}
        units='aux'
      />
      <SecondaryTextIndicator
        x={secondary.right}
        y={secondary.vertical}
        value={drivePowerLimit}
        units='drive'
      />
    </g>
  )
}
