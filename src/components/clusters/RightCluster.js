import React, { useContext } from 'react'
//import LinearGauge, { Range, Marker } from './LinearGauge'
import { ThemeContext } from 'styled-components'
import { useSignalState } from 'onyx-m2-react'
import { PrimaryTextValue, SecondaryTextIndicator, TextUnits } from '../Base'
import ArcGauge, { Indicator } from '../gauges/ArcGauge'

export default function RightCluster(props) {
  const theme = useContext(ThemeContext)

  const ratedConsumption = useSignalState('UI_ratedConsumption', 0)
  const consumptionText = (ratedConsumption !== 0) ? ratedConsumption.toFixed(0) : '-'

  const minT = useSignalState('BMS_thermistorTMin', null)
  const maxT = useSignalState('BMS_thermistorTMax', null)
  const temperatureText = (minT !== null && maxT !== null) ? ((maxT + minT) / 2).toFixed(0) : '-'

  const nominalFullPackEnergy = useSignalState('BMS_nominalFullPackEnergy', 0)
  const nominalEnergyRemaining = useSignalState('BMS_nominalEnergyRemaining', 0)
  const energyToChargeComplete = useSignalState('BMS_energyToChargeComplete', 0)
  const chargeLimit = (energyToChargeComplete + nominalEnergyRemaining) / nominalFullPackEnergy * 100

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
      <PrimaryTextValue x={66} y={-8}>{socText}</PrimaryTextValue>
      <TextUnits x={66} y={-5}>percent</TextUnits>
      <BatteryLevelGauge soc={usableSOC} limit={chargeLimit} />

      {/* secondary displays */}
      <path fill='none' stroke={theme.indicator.white} strokeWidth={0.2}
        d={`
          M ${left + 6} ${5}
          H ${right}
          M ${67} ${8}
          V 22
        `}
        />
      <SecondaryTextIndicator x={57} y={15} value={consumptionText} units='wh/km' />
      <SecondaryTextIndicator x={77} y={15} value={temperatureText} units='deg' />
    </g>

  )
}

function BatteryLevelGauge(props) {
  const theme = useContext(ThemeContext)
  const { height } = theme.panel
  const { soc, limit } = props

  if (soc === -1) {
    return (
      <ArcGauge from={0} to={100} height={height + 3} width={3} radius={90}>
        <Indicator from={0} to={100} color={'url(#slash-pattern)'}  />
      </ArcGauge>
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
    <ArcGauge from={0} to={100} height={theme.panel.height + 3} width={3} radius={90}>
      <Indicator from={0} to={soc} color={color}  />
      <Indicator from={soc} to={limit} color={theme.scale.white} />
      <Indicator from={limit} to={100} color='url(#slash-pattern)' />
    </ArcGauge>
  )
}