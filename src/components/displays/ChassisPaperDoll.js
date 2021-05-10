import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useSignalState } from 'onyx-m2-react'
import { ReactComponent as ChassisIcon} from '../../assets/chassis.svg'
import { SecondaryHorizontalTextIndicator } from '../Base'

/**
 * A component that displays a paper doll of the chassis, and allows values to be
 * displayed corresponding to each wheel. The `units` prop specifies the units text
 * to be displayed below values. The `scale` prop is a scaling factor for the values,
 * useful for converting units. Individual values are passed in using `fl`, `fr`,
 * `rl`, and `rr` props.
 *
 * @param {*} props
 * @returns
 */
export default function ChassisPaperDoll(props) {
  const theme = useContext(ThemeContext)
  const { units, scale } = props
  const fl = useScaledFormatedSignalState(props.fl, scale)
  const fr = useScaledFormatedSignalState(props.fr, scale)
  const rl = useScaledFormatedSignalState(props.rl, scale)
  const rr = useScaledFormatedSignalState(props.rr, scale)
  const vertOffset = -5
  const horzValueOffset = 24
  const vertValueOffset = 14
  return (
    <g className='ChassisPaperDoll'>
      <ChassisIcon x={-14} y={-49 + vertOffset} width={28} fill={theme.indicator.blue} />
      <SecondaryHorizontalTextIndicator x={-horzValueOffset} y={-vertValueOffset + vertOffset} value={fl} units={units} />
      <SecondaryHorizontalTextIndicator x={horzValueOffset} y={-vertValueOffset + vertOffset} value={fr} units={units} />
      <SecondaryHorizontalTextIndicator x={-horzValueOffset} y={vertValueOffset + vertOffset} value={rl} units={units} />
      <SecondaryHorizontalTextIndicator x={horzValueOffset} y={vertValueOffset + vertOffset} value={rr} units={units} />
    </g>
  )
}

function useScaledFormatedSignalState(mnemonic, scale) {
  const val = useSignalState(mnemonic, '--')
  if (val !== '--') {
    return Math.round(val * scale)
  }
  return '--'
}
