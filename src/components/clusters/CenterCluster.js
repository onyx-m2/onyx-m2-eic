import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useSignalState } from 'onyx-m2-react';
import RingGauge, { Indicator, Section } from '../gauges/RingGauge';
import { DisplaySelector } from '../displays/DisplaySelector';

const REGEN_POWER_SNA = 155
const DRIVE_POWER_SNA = 511

/**
 * The cluster displayed in the center, meant to be the focal point of the driver.
 * This cluster presents a power/regen ring, and context-sensitive displays, as well
 * as allows flipping through secondary displays using the right scroll wheel.
 */
export default function CenterCluster() {
  const theme = useContext(ThemeContext)

  const inverterPower = useSignalState('DI_elecPower', 0)
  const drivePower = (inverterPower > 0) ? inverterPower : 0
  const drivePowerLimit = useSignalState('DI_sysDrivePowerMax', DRIVE_POWER_SNA)
  const ratedDrivePower = 225

  const regenPower = (inverterPower < 0) ? -inverterPower : 0
  const regenPowerLimit = useSignalState('DI_sysRegenPowerMax', REGEN_POWER_SNA)
  const ratedRegenPower = 60

  // map power value to 0-100 scale using by gauges
  const drivePowerIncrements = 100 / ratedDrivePower
  const mappedDrivePower = drivePower * drivePowerIncrements
  const mappedDrivePowerLimit = (drivePowerLimit !== DRIVE_POWER_SNA) ? drivePowerLimit * drivePowerIncrements : 0

  const regenPowerIncrements = 100 / ratedRegenPower
  const mappedRegenPower = regenPower * regenPowerIncrements
  const mappedRegenPowerLimit = (regenPowerLimit !== REGEN_POWER_SNA) ? regenPowerLimit * regenPowerIncrements : 0

  const dialBottom = 40
  const dialRadius = 51
  const dialWidth = 3
  const ringRadius = 46.5
  const ringWidth = 1

  //const needleAngleSpan = 2 * Math.PI - 2 * Math.acos(dialBottom / dialRadius)
  //const needleAngle = (inverterPower * needleAngleSpan * 180 / (Math.PI * (ratedDrivePower + ratedRegenPower))) - 140
  const needleLength = dialRadius - ringRadius + 5

  return (
    <g className='CenterCluster'>
      {/* Power Ring */}
      <RingGauge className='PowerRing' bottom={dialBottom} width={dialWidth} radius={dialRadius}>
        <Section className='Regen' from={31} to={0} direction={-1} tickGap={0.012}>
          <Indicator value={mappedRegenPowerLimit} color={theme.color.primary} />
          <Indicator value={mappedRegenPower} color={theme.color.highlight} />
        </Section>
        <Section className='Drive' from={34} to={100} direction={1} tickGap={0.0055}>
          <Indicator value={mappedDrivePowerLimit} color={theme.color.primary} />
          <Indicator value={mappedDrivePower} color={theme.color.highlight} />
        </Section>
      </RingGauge>

      {/* Dial */}
      <path id='centerClusterDial' className='Dial'
        strokeLinecap='round'
        strokeWidth={ringWidth}
        stroke={theme.color.primary}
        fill='none'
        d={`
          M -24 40
          A ${ringRadius}, ${ringRadius} 0 1 1 24, 40
          Z
        `}
      />

      {/* Needle */}
      <line transform={`rotate(${-139.8})`}
        stroke={theme.color.primary}
        strokeWidth={ringWidth}
        fill='none'
        x1={ringRadius} x2={ringRadius + needleLength}
        y1='0' y2='0'
      />

      <DisplaySelector />
    </g>
  )
}