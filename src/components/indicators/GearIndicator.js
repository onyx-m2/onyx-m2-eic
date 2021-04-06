import React from 'react'
import styled from 'styled-components'
import { useNamedValuesSignalState } from 'onyx-m2-react'
import { FadeableGroup, StatusTextValue } from '../Base'

export default function GearIndicator(props) {
  var [gear, values] = useNamedValuesSignalState('DI_gear', 'SNA')
  var visible = true
  if (gear === values.SNA || gear === values.INVALID) {
    visible = false
  }
  return (
    <FadeableGroup className='GearIndicator' transform='translate(0, 47)' visible={visible}>
      <GearTextValue x='-15' selected={gear === values.P}>P</GearTextValue>
      <GearTextValue x='-5' selected={gear === values.R}>R</GearTextValue>
      <GearTextValue x='5' selected={gear === values.N}>N</GearTextValue>
      <GearTextValue x='15' selected={gear === values.D}>D</GearTextValue>
    </FadeableGroup>
  )
}

const GearTextValue = styled(StatusTextValue)`
  font-family: ${props => props.selected ? 'Gotham Bold' : 'Gotham Extra Light'};
  text-anchor: middle;
  dominant-baseline: middle;
`
