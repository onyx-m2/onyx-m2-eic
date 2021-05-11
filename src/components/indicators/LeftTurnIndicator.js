import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useNamedValuesSignalState } from 'onyx-m2-react'

export default function LeftTurnIndicator() {
  const theme = useContext(ThemeContext)
  const [state, states] = useNamedValuesSignalState('VCLEFT_turnSignalStatus', 'SNA')
  return state === states.ON && (
    <rect className='LeftTurnIndicator'
      fill={theme.color.highlight}
      rx='2' x='-66' y='-46' width='20' height='2'
    />
  )
}
