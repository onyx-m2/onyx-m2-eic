import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useNamedValuesSignalState, useSignalState } from 'onyx-m2-react'
import LinearGauge from '../gauges/LinearGauge'

/**
 * Indicates how centered the car is in its lane. if a lane is detected by the
 * autopilot computer.
 *
 * @returns
 */
export default function LaneKeepingIndicator() {
  const theme = useContext(ThemeContext)

  const carWidth = 1.85 // m
  const [ leftLineUsage, lineUsage ]  = useNamedValuesSignalState('DAS_leftLineUsage', 'REJECTED_UNAVAILABLE')
  const [ rightLineUsage ] = useNamedValuesSignalState('DAS_rightLineUsage', 'REJECTED_UNAVAILABLE')
  const laneWidth = useSignalState('DAS_virtualLaneWidth', 0) // m
  const distanceFromLaneCenter = useSignalState('DAS_virtualLaneC0', 0) // cm

  var enabled = true
  if ((leftLineUsage !== lineUsage.FUSED && rightLineUsage !== lineUsage.FUSED) || laneWidth === 0) {
    enabled = false
  }

  // 0% : exactly in the middle
  // 100% : left or right side of the car is touching the lane markers
  const movementSpaceInLane = (laneWidth - carWidth) / 2
  const deviationPct = -distanceFromLaneCenter / movementSpaceInLane
  const indicatorColor = Math.abs(deviationPct) < 100 ? theme.color.primary : theme.colors.RED

  return (
    <LinearGauge className='LaneKeepingIndicator'
      visible={enabled}
      length={42}
      from={-100} to={100}
      value={deviationPct}
      color={indicatorColor}
    />
  )
}
