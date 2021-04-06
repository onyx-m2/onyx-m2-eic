import React from 'react'
import styled from 'styled-components'
import { FadeableGroup } from '../Base'

export default function BannerIndicator(props) {
  const { text, color, visible } = props
  return (
    <FadeableGroup className='BannerMultiIndicator' visible={visible}>
      <rect x={-36} y={-4} width={72} height={11} fill={color} />
      <TextIndicator y={2}>{text}</TextIndicator>
    </FadeableGroup>
  )
}

const TextIndicator = styled.text`
  font-family: 'Gotham Bold';
  fill: black;
  font-size: 40%;
  text-anchor: middle;
  dominant-baseline: middle;
`