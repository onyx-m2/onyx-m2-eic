import React from 'react'
import { SecondaryTextIndicator } from '../Base'
import SecondaryDisplay from './SecondaryDisplay'
import { useSignalState } from 'onyx-m2-react'

export default function BrakeDisplay(props) {
  const vertOffset = 0
  const horzInnerValueOffset = 18
  const horzOuterValueOffset = 30
  const vertValueOffset = 14
  return (
    <SecondaryDisplay name='BRAKES'>
      <g className='BrakeDisplay'>
        <TorqueTextIndicator x={-horzInnerValueOffset} y={-vertValueOffset + vertOffset} signal='ESP_brakeTorqueFL' />
        <TempTextIndicator x={-horzOuterValueOffset} y={-vertValueOffset + vertOffset} signal='DI_brakeFLTemp' />

        <TorqueTextIndicator x={horzInnerValueOffset} y={-vertValueOffset + vertOffset} signal='ESP_brakeTorqueFR' />
        <TempTextIndicator x={horzOuterValueOffset} y={-vertValueOffset + vertOffset} signal='DI_brakeFRTemp' />

        <TorqueTextIndicator x={-horzInnerValueOffset} y={vertValueOffset + vertOffset} signal='ESP_brakeTorqueRL' />
        <TempTextIndicator x={-horzOuterValueOffset} y={vertValueOffset + vertOffset} signal='DI_brakeRLTemp' />

        <TorqueTextIndicator x={horzInnerValueOffset} y={vertValueOffset + vertOffset} signal='ESP_brakeTorqueRR' />
        <TempTextIndicator x={horzOuterValueOffset} y={vertValueOffset + vertOffset} signal='DI_brakeRRTemp' />
      </g>
    </SecondaryDisplay>
  )
}

function TempTextIndicator(props) {
  const { x, y, signal } = props
  return (
    <SignalTextIndicator x={x} y={y} signal={signal} units='deg' />
  )
}

function TorqueTextIndicator(props) {
  const { x, y, signal } = props
  return (
    <SignalTextIndicator x={x} y={y} signal={signal} units='nm' />
  )
}

function SignalTextIndicator(props) {
  const { x, y, signal, units } = props
  const value = useSignalState(signal, NaN)
  let displayValue = '--'
  if (!isNaN(value)) {
    displayValue = Math.round(value)
  }
  return (
    <SecondaryTextIndicator x={x} y={y} value={displayValue} units={units} />
  )
}
