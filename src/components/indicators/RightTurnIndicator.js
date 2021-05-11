import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useNamedValuesSignalState } from 'onyx-m2-react'

export default function RightTurnIndicator() {
  const theme = useContext(ThemeContext)
  const [state, states] = useNamedValuesSignalState('VCRIGHT_turnSignalStatus', 'SNA')
  return state === states.ON && (
    <rect className='RightTurnIndicator'
      fill={theme.color.highlight}
      rx='2' x='46' y='-46' width='20' height='2'
    />
  )
}