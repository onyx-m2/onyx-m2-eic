import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useSignalState } from 'onyx-m2-react'
import { PrimaryTextValue, SecondaryHorizontalTextIndicator, TextUnits } from '../Base'
import ArcGauge, { Indicator } from '../gauges/ArcGauge'
import { useCachedSignalState } from '../../contexts/CachedSignalState'

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

/**
 * Left cluster displaying speed and range information.
 */
export default function LeftCluster() {
  const theme = useContext(ThemeContext)

  const speed = useSignalState('DI_uiSpeed', 0)
  const speedText = (speed !== -1) ? speed : '-'

  const limit = useSignalState('DAS_fusedSpeedLimit', 0)
  const limitText = (limit !== 0) ? limit : '-'

  const expectedRange = useCachedSignalState('UI_expectedRange', -1)
  const rangeText = (expectedRange !== -1) ? expectedRange.toFixed(0) : '-'

  const { outline, indicators } = theme.geometry.side
  return (
    <g className='LeftCluster'>
      <path className='Outline'
        fill='none'
        stroke={theme.color.primary}
        strokeWidth={1}
        strokeLinejoin={'round'}
        d={`
          M ${-outline.left} ${-outline.height / 2}
          H ${-outline.right}
          A ${-outline.radius}, ${-outline.radius} 0 0 0 ${-outline.right}, ${outline.height / 2}
          H ${-outline.left}
        `}
        />

      {/* speed indicator */}
      <PrimaryTextValue
        x={-indicators.primary.horizontal}
        y={indicators.primary.value}
      >
        {speedText}
      </PrimaryTextValue>

      <TextUnits
        x={-indicators.primary.horizontal}
        y={indicators.primary.caption}
      >
        km/h
      </TextUnits>

      <SpeedGauge speed={speed} limit={limit} />

      {/* secondary indicators */}
      <SecondaryHorizontalTextIndicator
        x={-indicators.secondary.top.x}
        y={indicators.secondary.top.y}
        value={limitText}
        units='max'
      />
      <SecondaryHorizontalTextIndicator
        x={-indicators.secondary.bottom.x}
        y={indicators.secondary.bottom.y}
        value={rangeText}
        units='km'
      />
    </g>
  )
}

function SpeedGauge(props) {
  const theme = useContext(ThemeContext)
  const { height, radius, width } = theme.geometry.side.gauge
  const { color: { primary, highlight }, colors } = theme
  const { speed, limit } = props

  if (speed === -1 || limit === 0) {
    return (
      <ArcGauge height={height} width={width} radius={-radius} />
    )
  }

  // the gauge will display a little more than than the speed limit, arbitrarily
  // choosing 20 km/h more; remap everything to 0-100 range
  const speedIncrements = 100 / (limit + 20)
  const mappedLimit = limit * speedIncrements
  const mappedSpeed = speed * speedIncrements

  let indicatorColor
  switch (speedLimitStatus(speed, limit)) {
    case OVER_SPEED_LIMIT:
      indicatorColor = colors.YELLOW
      break
    case SPEEDING_OFFENSE:
      indicatorColor = colors.ORANGE
      break
    case EXCESSIVE_SPEEDING_OFFENSE:
      indicatorColor = colors.RED
      break
    default:
      indicatorColor = highlight
  }

  return (
    <ArcGauge height={height} width={width} radius={-radius}>
      <Indicator value={mappedLimit} color={primary} />
      <Indicator value={mappedSpeed} color={indicatorColor}  />
    </ArcGauge>
  )
}