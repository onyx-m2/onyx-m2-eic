import React from 'react'
import { SecondaryTextIndicator } from '../Base'
import SecondaryDisplay from './SecondaryDisplay'
import { useSignalState } from 'onyx-m2-react'

const BAR_TO_PSI = 14.5038

export default function TireDisplay(props) {
  const vertOffset = 0
  const horzInnerValueOffset = 18
  const horzOuterValueOffset = 30
  const vertValueOffset = 14
  return (
    <SecondaryDisplay name='TIRES'>
      <g className='TireDisplay'>
        <PressureTextIndicator x={-horzInnerValueOffset} y={-vertValueOffset + vertOffset} signal='TPMS_pressureFL' />
        <TempTextIndicator x={-horzOuterValueOffset} y={-vertValueOffset + vertOffset} signal='TPMS_temperatureFL' />

        <PressureTextIndicator x={horzInnerValueOffset} y={-vertValueOffset + vertOffset} signal='TPMS_pressureFR' />
        <TempTextIndicator x={horzOuterValueOffset} y={-vertValueOffset + vertOffset} signal='TPMS_temperatureFR' />

        <PressureTextIndicator x={-horzInnerValueOffset} y={vertValueOffset + vertOffset} signal='TPMS_pressureRL' />
        <TempTextIndicator x={-horzOuterValueOffset} y={vertValueOffset + vertOffset} signal='TPMS_temperatureRL' />

        <PressureTextIndicator x={horzInnerValueOffset} y={vertValueOffset + vertOffset} signal='TPMS_pressureRR' />
        <TempTextIndicator x={horzOuterValueOffset} y={vertValueOffset + vertOffset} signal='TPMS_temperatureRR' />
      </g>
    </SecondaryDisplay>
  )
}

function TempTextIndicator(props) {
  const { x, y, signal } = props
  return (
    <SignalTextIndicator x={x} y={y} signal={signal} scale={1} units='deg' />
  )
}

function PressureTextIndicator(props) {
  const { x, y, signal } = props
  return (
    <SignalTextIndicator x={x} y={y} signal={signal} scale={BAR_TO_PSI} units='psi' />
  )
}

function SignalTextIndicator(props) {
  const { x, y, signal, units, scale } = props
  const value = useSignalState(signal, NaN)
  let displayValue = '--'
  if (!isNaN(value)) {
    displayValue = Math.round(value * scale)
  }
  return (
    <SecondaryTextIndicator x={x} y={y} value={displayValue} units={units} />
  )
}
