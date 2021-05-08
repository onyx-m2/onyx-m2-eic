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
  return (
    <defs>
      <pattern id="slash-pattern" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="1" height="2" transform="translate(0,0)" fill="grey"></rect>
      </pattern>
      <pattern id="backslash-pattern" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
        <rect width="1" height="2" transform="translate(0,0)" fill="grey"></rect>
      </pattern>
      <radialGradient id="ball-gradient">
        <stop offset="0%" stopColor={theme.indicator.blue}/>
        <stop offset="100%" stopColor='black'/>
      </radialGradient>
      <linearGradient id="blue-indicator-gradient">
        <stop offset="0%" stopColor='black'/>
        <stop offset="50%" stopColor={theme.indicator.blue}/>
        <stop offset="100%" stopColor='black'/>
      </linearGradient>
      <linearGradient id="red-indicator-gradient">
        <stop offset="0%" stopColor='black'/>
        <stop offset="50%" stopColor={theme.indicator.red}/>
        <stop offset="100%" stopColor='black'/>
      </linearGradient>
      <linearGradient id="yellow-indicator-gradient">
        <stop offset="0%" stopColor='black'/>
        <stop offset="50%" stopColor={theme.indicator.yellow}/>
        <stop offset="100%" stopColor='black'/>
      </linearGradient>
      <linearGradient id="orange-indicator-gradient">
        <stop offset="0%" stopColor='black'/>
        <stop offset="50%" stopColor={theme.indicator.orange}/>
        <stop offset="100%" stopColor='black'/>
      </linearGradient>
      <clipPath id='center-cluster-clip'>
        <path d={`
          M -22 40
          A 46, 46 0 1 1 22, 40
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
`