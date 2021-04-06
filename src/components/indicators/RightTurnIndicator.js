import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useNamedValuesSignalState } from 'onyx-m2-react'

export default function RightTurnIndicator(props) {
  const theme = useContext(ThemeContext)
  const [state, states] = useNamedValuesSignalState('VCRIGHT_turnSignalStatus', 'SNA')
  return state === states.ON && (
    <rect className='RightTurnIndicator' rx='2' x='40' y='-40' width='20' height='2' fill={theme.indicator.blue} />
  )
}