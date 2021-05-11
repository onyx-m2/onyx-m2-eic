import React from 'react'
import styled from 'styled-components'
import { BannerText } from '../Base'

export default function SecondaryDisplay(props) {
  const { name, children } = props
  return (
    <g className='SecondaryDisplay'>
      { children }
      <BannerRect x='-56' y='28' width='100' height='12' />
      <BannerText y='34'>{name}</BannerText>
    </g>
  )
}

const BannerRect = styled.rect`
  clip-path: url(#center-cluster-clip);
  fill: ${props => props.theme.color.primary};
`
