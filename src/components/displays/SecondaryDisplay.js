import React from 'react'
import styled from 'styled-components'

export default function SecondaryDisplay(props) {
  const { name, children } = props
  return (
    <g className='SecondaryDisplay'>
      { children }
      <BannerRect x='-50' y='22' width='100' height='12' />
      <NameText y='28'>{name}</NameText>
    </g>
  )
}

const BannerRect = styled.rect`
  clip-path: url(#center-cluster-clip);
  fill: ${props => props.theme.indicator.white};
`

const NameText = styled.text`
  font-family: 'Gotham Bold';
  fill: black;
  font-size: 34%;
  text-anchor: middle;
  dominant-baseline: middle;
`