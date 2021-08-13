import React from 'react'
import { BannerText, FadeableGroup } from '../Base'

export default function BannerIndicator(props) {
  const { text, color, visible } = props
  return (
    <FadeableGroup className='BannerMultiIndicator' visible={visible}>
      <rect x={-42} y={-6} width={84} height={15} fill={color} />
      <BannerText y={2}>{text}</BannerText>
    </FadeableGroup>
  )
}