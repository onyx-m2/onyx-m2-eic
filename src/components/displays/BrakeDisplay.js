import React from 'react'
import { SecondaryTextIndicator } from '../Base'
import SecondaryDisplay from './SecondaryDisplay'
import { useSignalState } from 'onyx-m2-react'

export default function BrakeDisplay(props) {
  const vOffset = 0
  const hInnerValueOffset = 14
  const hOuterValueOffset = 30
  const vValueOffset = 14
  return (
    <SecondaryDisplay name='BRAKES'>
      <g className='BrakeDisplay'>
        <TorqueTextIndicator x={-hInnerValueOffset} y={-vValueOffset + vOffset} signal='ESP_brakeTorqueFL' />
        <TempTextIndicator x={-hOuterValueOffset} y={-vValueOffset + vOffset} signal='DI_brakeFLTemp' />

        <TorqueTextIndicator x={hInnerValueOffset} y={-vValueOffset + vOffset} signal='ESP_brakeTorqueFR' />
        <TempTextIndicator x={hOuterValueOffset} y={-vValueOffset + vOffset} signal='DI_brakeFRTemp' />

        <TorqueTextIndicator x={-hInnerValueOffset} y={vValueOffset + vOffset} signal='ESP_brakeTorqueRL' />
        <TempTextIndicator x={-hOuterValueOffset} y={vValueOffset + vOffset} signal='DI_brakeRLTemp' />

        <TorqueTextIndicator x={hInnerValueOffset} y={vValueOffset + vOffset} signal='ESP_brakeTorqueRR' />
        <TempTextIndicator x={hOuterValueOffset} y={vValueOffset + vOffset} signal='DI_brakeRRTemp' />
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
