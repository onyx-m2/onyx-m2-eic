import React from 'react'
import styled from 'styled-components'

/**
 * A group that fades in and out of view in place, controlled by the `visible`
 * property.
 */
 export const FadeableGroup = styled.g`
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
`

export const BaseTextValue = styled.text`
  font-family: 'Gotham Light';
  fill: ${props => props.theme.indicator.white};
`

export const BaseTextUnits = styled.text`
  font-family: 'Gotham Light';
  fill: ${props => props.theme.scale.white};
`

export const HeroTextValue = styled(BaseTextValue)`
  font-size: 120%;
  text-anchor: middle;
`

export const HeroTextUnits = styled(BaseTextUnits)`
  font-size: 35%;
  text-anchor: middle;
  dominant-baseline: hanging;
`

export const PrimaryTextValue = styled(BaseTextValue)`
  font-size: 80%;
  text-anchor: middle;
`

export const TextUnits = styled(BaseTextUnits)`
  font-size: 25%;
  text-anchor: middle;
  dominant-baseline: hanging;
`

export const SecondaryTextValue = styled(BaseTextValue)`
  font-size: 50%;
  text-anchor: middle;
`

export function SecondaryTextIndicator(props) {
  const { x, y, value, units } = props
  return (
    <g>
      <SecondaryTextValue x={x} y={y}>{value}</SecondaryTextValue>
      <TextUnits x={x} y={y + 2}>{units}</TextUnits>
    </g>
  )
}

export const StatusTextValue = styled(BaseTextValue)`
  font-size: 40%;
`

export function LeftStatusTextValue(props) {
  const { children } = props
  return (
    <StatusTextValue className='LeftStatusTextValue' x='-100' y='46' textAnchor='start'>
      {children}
    </StatusTextValue>
  )
}

export function RightStatusTextValue(props) {
  const { children } = props
  return (
    <StatusTextValue className='RightStatusTextValue' x='100' y='46' textAnchor='end'>
      {children}
    </StatusTextValue>
  )
}

export const AnimatedPath = styled.path`
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: all 0.5s ease;
`
