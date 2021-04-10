import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useSignalState } from 'onyx-m2-react';
import RingGauge, { Range } from '../gauges/RingGauge';
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
  const ratedDrivePower = (drivePowerLimit < 200) ? 200 : drivePowerLimit

  const regenPower = (inverterPower < 0) ? -inverterPower : 0
  const regenPowerLimit = useSignalState('DI_sysRegenPowerMax', REGEN_POWER_SNA)
  const ratedRegenPower = (regenPowerLimit < 60) ? 60 : regenPowerLimit

  // map drive power to a 33-100 scale to fit the scale it gets on the dial
  const dialDrivePowerOffset = 33
  const dialDrivePowerTick = (100 - 33) / ratedDrivePower
  const dialDrivePower = dialDrivePowerOffset + drivePower * dialDrivePowerTick
  const dialDrivePowerLimit = dialDrivePowerOffset + drivePowerLimit * dialDrivePowerTick

  // map regen power to a 0 - 31.2 scale to fit dial
  const dialRegenZero = 31.2
  const dialRegenPowerTick = -dialRegenZero / ratedRegenPower
  const dialRegenPower = dialRegenZero + regenPower * dialRegenPowerTick
  const dialRegenPowerLimit = dialRegenZero + regenPowerLimit * dialRegenPowerTick

  const dialBottom = 32
  const dialRadius = 45
  const dialWidth = 3
  const ringRadius = 40
  const ringWidth = 1

  //const needleAngleSpan = 2 * Math.PI - 2 * Math.acos(dialBottom / dialRadius)
  //const needleAngle = (inverterPower * needleAngleSpan * 180 / (Math.PI * (ratedDrivePower + ratedRegenPower))) - 140
  const needleLength = dialRadius - ringRadius + 5

  return (
    <g className='CenterCluster'>
      {/* Power Ring */}
      <RingGauge className='PowerRing' from={0} to={100} bottom={dialBottom} width={dialWidth} radius={dialRadius}>
        <Range from={0} to={dialRegenPowerLimit} color={'url(#slash-pattern)'} />
        <Range from={dialRegenPowerLimit} to={31.2} color={theme.scale.white} />
        <Range from={dialRegenPower} to={31.2} color={theme.indicator.blue} />

        <Range from={33} to={dialDrivePowerLimit} color={theme.scale.white} />
        <Range from={dialDrivePowerLimit} to={100} color={'url(#backslash-pattern)'} />
        <Range from={33} to={dialDrivePower} color={theme.indicator.blue} />
      </RingGauge>

      {/* Dial */}
      <path id='centerClusterDial' className='Dial' strokeLinecap='round' strokeWidth={ringWidth} stroke={theme.indicator.white} fill='none'
      d={`
        M -21 33.7
        A ${ringRadius}, ${ringRadius} 0 1 1 21, 33.7
        Z
      `}
      />

      {/* Needle */}
      <line transform={`rotate(${-138.5})`} stroke={theme.indicator.white} strokeWidth={ringWidth} fill='none'
            x1={ringRadius} x2={ringRadius + needleLength} y1='0' y2='0'/>

      {/* <Needle transform={`rotate(${needleAngle})`} stroke={theme.indicator.white} strokeWidth={ringWidth} fill='none'
            x1={ringRadius} x2={ringRadius + needleLength} y1='0' y2='0'/> */}

      <DisplaySelector />
    </g>
  )
}

// const Needle = styled.line`
//   transition: all 0.3s ease;
// `

