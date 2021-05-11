import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const MIN_X = -100
const MAX_X = 100
const MIN_Y = -48
const MAX_Y = 52
const WIDTH = 200
const HEIGHT = 100

export function SvgDefs() {
  const theme = useContext(ThemeContext)
  const { BLACK, BLUE, RED, YELLOW, ORANGE } = theme.colors
  return (
    <defs>
      <pattern id="slash-pattern" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="1" height="2" transform="translate(0,0)" fill="grey"></rect>
      </pattern>
      <pattern id="backslash-pattern" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
        <rect width="1" height="2" transform="translate(0,0)" fill="grey"></rect>
      </pattern>
      <radialGradient id="ball-gradient">
        <stop offset="0%" stopColor={BLUE}/>
        <stop offset="100%" stopColor={BLACK}/>
      </radialGradient>
      <linearGradient id="blue-indicator-gradient">
        <stop offset="0%" stopColor={BLACK}/>
        <stop offset="50%" stopColor={BLUE}/>
        <stop offset="100%" stopColor={BLACK}/>
      </linearGradient>
      <linearGradient id="red-indicator-gradient">
        <stop offset="0%" stopColor={BLACK}/>
        <stop offset="50%" stopColor={RED}/>
        <stop offset="100%" stopColor={BLACK}/>
      </linearGradient>
      <linearGradient id="yellow-indicator-gradient">
        <stop offset="0%" stopColor={BLACK}/>
        <stop offset="50%" stopColor={YELLOW}/>
        <stop offset="100%" stopColor={BLACK}/>
      </linearGradient>
      <linearGradient id="orange-indicator-gradient">
        <stop offset="0%" stopColor={BLACK}/>
        <stop offset="50%" stopColor={ORANGE}/>
        <stop offset="100%" stopColor={BLACK}/>
      </linearGradient>
      <clipPath id='center-cluster-clip'>
        <path d={`
          M -24 40
          A 46, 46 0 1 1 24, 40
          Z
        `}
        />
      </clipPath>
    </defs>
  )
}

export default function SvgCanvas(props) {
  const { children } = props
  return (
    <Svg {...props} viewBox={`${MIN_X}, ${MIN_Y}, ${WIDTH}, ${HEIGHT}`} >
      {children}
    </Svg>
  )
}

Object.assign(SvgCanvas, { MIN_X, MAX_X, MIN_Y, MAX_Y, WIDTH, HEIGHT })

const Svg = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.color.background};
`