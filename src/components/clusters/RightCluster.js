import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { PrimaryTextValue, SecondaryHorizontalTextIndicator, TextUnits } from '../Base'
import ArcGauge, { Indicator } from '../gauges/ArcGauge'
import { useCachedSignalState } from '../../contexts/CachedSignalState'

/**
 * Right cluster displaying batter battery and consumption information.
 */
export default function RightCluster() {
  const theme = useContext(ThemeContext)

  const ratedConsumption = useCachedSignalState('UI_ratedConsumption', 0)
  const consumptionText = (ratedConsumption !== 0) ? ratedConsumption.toFixed(0) : '-'

  const minT = useCachedSignalState('BMS_thermistorTMin', null)
  const maxT = useCachedSignalState('BMS_thermistorTMax', null)
  const temperatureText = (minT !== null && maxT !== null) ? ((maxT + minT) / 2).toFixed(0) : '-'

  // the BMS_energyStatus (850) message has changed, looks like a multiplexed message
  // now; for now, I'll disable detecting the charge limit and just hard code to 100
  // avoid the visually distracting glitches in the battery gauge display
  // FIXME const nominalFullPackEnergy = useCachedSignalState('BMS_nominalFullPackEnergy', 0)
  // FIXMEconst nominalEnergyRemaining = useCachedSignalState('BMS_nominalEnergyRemaining', 0)
  // FIXMEconst energyToChargeComplete = useCachedSignalState('BMS_energyToChargeComplete', 0)
  // FIXME console.log(`nominalFullPackEnergy:${nominalFullPackEnergy} nominalEnergyRemaining:${nominalEnergyRemaining} energyToChargeComplete:${energyToChargeComplete}`)
  // FIXME var chargingLimit = 0
  // FIXMEif (nominalFullPackEnergy !== 0) {
  // FIXME  chargingLimit = (energyToChargeComplete + nominalEnergyRemaining) / nominalFullPackEnergy * 100
  // FIXME}
  const chargingLimit = 100

  // const tripPlanningActive = useSignalState('UI_tripPlanningActive', 0)
  // const energyAtDestination = useSignalState('UI_energyAtDestination', 0)
  // const socAtDestination = tripPlanningActive ? Math.round(energyAtDestination * 100 / nominalFullPackEnergy) : usableSOC

  const usableSOC = useCachedSignalState('UI_usableSOC', -1)
  const socText = (usableSOC !== -1) ? usableSOC : '-'

  const { outline, indicators } = theme.geometry.side

  return (
    <g className='RightCluster'>

      <path className='Outline'
        fill='none'
        stroke={theme.color.primary}
        strokeWidth={1}
        strokeLinejoin={'round'}
        d={`
          M ${outline.left} ${-outline.height / 2}
          H ${outline.right}
          A ${outline.radius}, ${outline.radius} 0 0 1 ${outline.right}, ${outline.height / 2}
          H ${outline.left}
        `}
        />

      {/* battery percentage */}
      <PrimaryTextValue
        x={indicators.primary.horizontal}
        y={indicators.primary.value}
      >
        {socText}
      </PrimaryTextValue>

      <TextUnits
        x={indicators.primary.horizontal}
        y={indicators.primary.caption}
      >
        percent
      </TextUnits>

      <BatteryLevelGauge soc={usableSOC} limit={chargingLimit} />

      {/* secondary indicators */}
      <SecondaryHorizontalTextIndicator
        x={indicators.secondary.top.x}
        y={indicators.secondary.top.y}
        value={consumptionText}
        units='wh/km'
      />
      <SecondaryHorizontalTextIndicator
        x={indicators.secondary.bottom.x}
        y={indicators.secondary.bottom.y}
        value={temperatureText}
        units='deg'
      />
    </g>

  )
}

function BatteryLevelGauge(props) {
  const theme = useContext(ThemeContext)
  const { height, radius, width } = theme.geometry.side.gauge
  const { color: { primary, highlight }, colors } = theme
  const { soc, limit } = props

  if (soc === -1) {
    return (
      <ArcGauge height={height} width={width} radius={radius} />
    )
  }

  let color = highlight
  if (soc <= 5) {
    color = colors.RED
  }
  else if (soc <= 20) {
    color = colors.YELLOW
  }

  return (
    <ArcGauge height={height} width={width} radius={radius}>
      <Indicator value={limit} color={primary} />
      <Indicator value={soc} color={color}  />
    </ArcGauge>
  )
}