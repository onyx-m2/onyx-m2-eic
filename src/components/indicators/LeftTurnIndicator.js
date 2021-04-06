import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useNamedValuesSignalState } from 'onyx-m2-react'

export default function LeftTurnIndicator(props) {
  const theme = useContext(ThemeContext)
  const [state, states] = useNamedValuesSignalState('VCLEFT_turnSignalStatus', 'SNA')
  return state === states.ON && (
    <rect className='LeftTurnIndicator' rx='2' x='-60' y='-40' width='20' height='2' fill={theme.indicator.blue} />
  )
}
