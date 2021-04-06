import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useSignalState } from 'onyx-m2-react';
import { PrimaryTextValue, SecondaryTextIndicator, TextUnits } from '../Base';
import ArcGauge, { Indicator } from '../gauges/ArcGauge';

const WITHIN_SPEED_LIMIT = 0
const OVER_SPEED_LIMIT = 1
const SPEEDING_OFFENSE = 2
const EXCESSIVE_SPEEDING_OFFENSE = 3

/**
 * Returns wether the car is currently speeding, and if so, how badly. There are
 * 3 tiers of speeding:
 *   - `OVER_SPEED_LIMIT`: Over the speed limit, but not enough to get a speeding ticket
 *   - `SPEEDING_OFFENSE`: Over the speed limit by enough to get pulled over
 *   - `EXCESSIVE_SPEEDING_OFFENSE`: So far over the limit that excessive speeding laws
 *      kick in. Do not. EVer.
 *
 * The values for `SPEEDING_OFFENSE` are empirical based on anecdotal experience in the
 * province of Quebec. USE AT YOUR OWN RISK!!! The values for excessive speeding are
 * taken from the SAAQ (https://saaq.gouv.qc.ca), and go like this:
 *   - 40 km/h or more in a zone where the speed limit is 60 km/h or less
 *   - 50 km/h or more in a zone where the speed limit is over 60 km/h and up to 90 km/h
 *   - 60 km/h or more in a zone where the speed limit is 100 km/h or over
 */
function speedLimitStatus(speed, limit) {
  if (speed <= limit) {
    return WITHIN_SPEED_LIMIT
  }
  const overLimit = speed - limit
  if (limit <= 60) {
    if (overLimit <= 10) {
      return OVER_SPEED_LIMIT
    }
    if (overLimit < 40) {
      return SPEEDING_OFFENSE
    }
    return EXCESSIVE_SPEEDING_OFFENSE
  }
  if (limit <= 90) {
    if (overLimit <= 10) {
      return OVER_SPEED_LIMIT
    }
    if (overLimit < 50) {
      return SPEEDING_OFFENSE
    }
    return EXCESSIVE_SPEEDING_OFFENSE
  }
  if (overLimit <= 20) {
    return OVER_SPEED_LIMIT
  }
  if (overLimit < 60) {
    return SPEEDING_OFFENSE
  }
    return EXCESSIVE_SPEEDING_OFFENSE
}

// from, to
// ranges: [{ from, to, color}]
// markers: [{ value, color }]
export default function LeftCluster(props) {
  const theme = useContext(ThemeContext)

  const speed = useSignalState('DI_uiSpeed', -1)
  const speedText = (speed !== -1) ? speed : '-'

  const limit = useSignalState('DAS_fusedSpeedLimit', 0)
  const limitText = (limit !== 0) ? limit : '-'

  const expectedRange = useSignalState('UI_expectedRange', -1)
  const rangeText = (expectedRange !== -1) ? expectedRange.toFixed(0) : '-'

  const { left, right, height, radius } = theme.panel
  return (
    <g className='LeftCluster'>
      <path fill='none' stroke={theme.indicator.white} strokeWidth={1} strokeLinejoin={'round'}
        d={`
          M ${-left} ${-height / 2}
          H ${-right}
          A ${-radius}, ${-radius} 0 0 0 ${-right}, ${height / 2}
          H ${-left}
        `}
        />

      {/* speed indicator */}
      <PrimaryTextValue x={-66} y={-8}>{speedText}</PrimaryTextValue>
      <TextUnits x={-66} y={-5}>km/h</TextUnits>
      <SpeedGauge speed={speed} limit={limit} />

      {/* secondary displays */}
      <path fill='none' stroke='white' strokeWidth={0.2}
        d={`
          M ${-left - 6} ${5}
          H ${-right}
          M ${-67} ${8}
          V 22
        `}
        />
      <SecondaryTextIndicator x={-77} y={15} value={limitText} units='max' />
      <SecondaryTextIndicator x={-57} y={15} value={rangeText} units='km' />

    </g>
  )
}

function SpeedGauge(props) {
  const theme = useContext(ThemeContext)
  const { height } = theme.panel
  const { speed, limit } = props

  if (speed === -1 || limit === 0) {
    return (
      <ArcGauge from={0} to={1} height={height + 3} width={3} radius={-90}>
        <Indicator from={0} to={1} color='url(#backslash-pattern)' />
      </ArcGauge>
    )
  }

  // the gauge will display a little more than than the speed limit, arbitrarily
  // choosing 20 km/h more
  const gaugeLimit = limit + 20
  const gaugeSpeed = Math.min(speed, gaugeLimit)

  let indicatorColor
  switch (speedLimitStatus(speed, limit)) {
    case OVER_SPEED_LIMIT:
      indicatorColor = theme.indicator.yellow
      break
    case SPEEDING_OFFENSE:
      indicatorColor = theme.indicator.orange
      break
    case EXCESSIVE_SPEEDING_OFFENSE:
      indicatorColor = theme.indicator.red
      break
    default:
      indicatorColor = theme.indicator.blue
  }

  return (
    <ArcGauge from={0} to={gaugeLimit} height={height + 3} width={3} radius={-90}>
      <Indicator from={0} to={limit} color={theme.scale.white} />
      <Indicator from={limit} to={gaugeLimit} color='url(#backslash-pattern)' />
      <Indicator from={0} to={gaugeSpeed} color={indicatorColor}  />
    </ArcGauge>
  )
}