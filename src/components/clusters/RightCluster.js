import React, { useContext } from 'react'
//import LinearGauge, { Range, Marker } from './LinearGauge'
import { ThemeContext } from 'styled-components'
import { useSignalState } from 'onyx-m2-react'
import { PrimaryTextValue, SecondaryTextIndicator, TextUnits } from '../Base'
import ArcGauge, { Indicator } from '../gauges/ArcGauge'

/**
 * Right cluster displaying batter battery and consumption information.
 */
export default function RightCluster() {
  const theme = useContext(ThemeContext)

  const ratedConsumption = useSignalState('UI_ratedConsumption', 0)
  const consumptionText = (ratedConsumption !== 0) ? ratedConsumption.toFixed(0) : '-'

  const minT = useSignalState('BMS_thermistorTMin', null)
  const maxT = useSignalState('BMS_thermistorTMax', null)
  const temperatureText = (minT !== null && maxT !== null) ? ((maxT + minT) / 2).toFixed(0) : '-'

  const nominalFullPackEnergy = useSignalState('BMS_nominalFullPackEnergy', 0)
  const nominalEnergyRemaining = useSignalState('BMS_nominalEnergyRemaining', 0)
  const energyToChargeComplete = useSignalState('BMS_energyToChargeComplete', 0)
  var chargingLimit = 0
  if (nominalFullPackEnergy !== 0) {
    chargingLimit = (energyToChargeComplete + nominalEnergyRemaining) / nominalFullPackEnergy * 100
  }

  // const tripPlanningActive = useSignalState('UI_tripPlanningActive', 0)
  // const energyAtDestination = useSignalState('UI_energyAtDestination', 0)
  // const socAtDestination = tripPlanningActive ? Math.round(energyAtDestination * 100 / nominalFullPackEnergy) : usableSOC

  const usableSOC = useSignalState('UI_usableSOC', -1)
  const socText = (usableSOC !== -1) ? usableSOC : '-'

  const { left, right, height, radius } = theme.panel
  return (
    <g className='RightCluster'>
      <path fill='none' stroke={theme.indicator.white} strokeWidth={1} strokeLinejoin={'round'}
        d={`
          M ${left} ${-height / 2}
          H ${right}
          A ${radius}, ${radius} 0 0 1 ${right}, ${height / 2}
          H ${left}
        `}
        />

      {/* battery percentage */}
      <PrimaryTextValue x={70} y={-10}>{socText}</PrimaryTextValue>
      <TextUnits x={70} y={-7}>percent</TextUnits>
      <BatteryLevelGauge soc={usableSOC} limit={chargingLimit} />

      {/* secondary displays */}
      <path fill='none' stroke={theme.indicator.white} strokeWidth={0.2}
        d={`
          M ${left + 10} ${5}
          H ${right}
          M ${70} ${8}
          V 24
        `}
        />
      <SecondaryTextIndicator x={60} y={17} value={consumptionText} units='wh/km' />
      <SecondaryTextIndicator x={80} y={17} value={temperatureText} units='deg' />
    </g>

  )
}

function BatteryLevelGauge(props) {
  const theme = useContext(ThemeContext)
  const { height } = theme.panel
  const { soc, limit } = props

  if (soc === -1) {
    return (
      <ArcGauge height={height + 3} width={3} radius={96} />
    )
  }

  let color = theme.indicator.blue
  if (soc < 10) {
    color = theme.indicator.red
  }
  else if (soc < 20) {
    color = theme.indicator.yellow
  }

  return (
    <ArcGauge height={height + 3} width={3} radius={96}>
      <Indicator value={limit} color={theme.indicator.white} />
      <Indicator value={soc} color={color}  />
    </ArcGauge>
  )
}