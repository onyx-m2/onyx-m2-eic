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
  font-family: ${props => props.theme.font.family.normal};
  fill: ${props => props.theme.color.primary};
`

export const BaseTextUnits = styled.text`
  font-family: ${props => props.theme.font.family.normal};
  fill: ${props => props.theme.color.muted};
`

export const HeroTextValue = styled(BaseTextValue)`
  font-size: ${props => props.theme.font.size.hero};
  text-anchor: middle;
`

export const HeroTextUnits = styled(BaseTextUnits)`
  font-size: ${props => props.theme.font.size.heroCaption};
  text-anchor: middle;
  dominant-baseline: hanging;
`

export const PrimaryTextValue = styled(BaseTextValue)`
  font-size: ${props => props.theme.font.size.primary};
  text-anchor: middle;
`

export const TextUnits = styled(BaseTextUnits)`
  font-size: ${props => props.theme.font.size.caption};
  text-anchor: ${props => props.anchor || 'middle'};
  dominant-baseline: ${props => props.baseline || 'hanging'};
`

export const SecondaryTextValue = styled(BaseTextValue)`
  font-size: ${props => props.theme.font.size.secondary};
  text-anchor: ${props => props.anchor || 'middle'};
`

export function SecondaryTextIndicator(props) {
  const { x, y, value, units, anchor } = props
  return (
    <FadeableGroup visible={value !== '-'}>
      <SecondaryTextValue x={x} y={y} anchor={anchor}>{value}</SecondaryTextValue>
      <TextUnits x={x} y={y + 2} anchor={anchor}>{units}</TextUnits>
    </FadeableGroup>
  )
}

export function SecondaryHorizontalTextIndicator(props) {
  const { x, y, value, units } = props
  return (
    <FadeableGroup visible={value !== '-'}>
      <SecondaryTextValue x={x} y={y} anchor='end'>{value}</SecondaryTextValue>
      <TextUnits x={x + 2} y={y} anchor='start' baseline='inherit'>{units}</TextUnits>
    </FadeableGroup>
  )
}

export const StatusTextValue = styled(BaseTextValue)`
  font-size: ${props => props.theme.font.size.secondary};
`

export function LeftStatusTextValue(props) {
  const { children } = props
  return (
    <StatusTextValue className='LeftStatusTextValue' x='-100' y='52' textAnchor='start'>
      {children}
    </StatusTextValue>
  )
}

export function RightStatusTextValue(props) {
  const { children } = props
  return (
    <StatusTextValue className='RightStatusTextValue' x='100' y='52' textAnchor='end'>
      {children}
    </StatusTextValue>
  )
}

export const AnimatedPath = styled.path`
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: all 0.5s ease;
`

export const BannerText = styled.text`
  font-family: ${props => props.theme.font.family.bold};
  font-size: ${props => props.theme.font.size.secondary};
  fill: ${props => props.theme.color.background};
  text-anchor: middle;
  dominant-baseline: middle;
`