import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { useNamedValuesSignalState } from 'onyx-m2-react'
import BannerIndicator from './BannerIndicator'

export default function DriveBannerIndicator() {
  const theme = useContext(ThemeContext)
  const [brakeLightState, brakeLightStates] = useNamedValuesSignalState('VCLEFT_brakeLightStatus', 'SNA')
  const [autopilotState, autopilotStates] = useNamedValuesSignalState('DAS_autopilotState', 'SNA')
  const [handsOnState, handsOnStates] = useNamedValuesSignalState('DAS_autopilotHandsOnState', 'SNA')
  const [ebrState, ebrStates] = useNamedValuesSignalState('ESP_ebrStatus', 'EBR_IS_NOT_AVAILABLE')

  // determine if the car is braking (or holding)
  const braking = (brakeLightState === brakeLightStates.ON)
  const holding = (ebrState === ebrStates.ACTUATING_DI_EBR)

  // determine if ap is active, and if so, in what state the hands on detection is
  // (no longer indicating if autopilot is available)
  var autopilot = false
  var autopilotColor = theme.indicator.grey
  if (autopilotState === autopilotStates.ACTIVE_NOMINAL) {
    autopilot = true
    switch (handsOnState) {
      case handsOnStates.SNA:
      case handsOnStates.REQD_DETECTED:
      case handsOnStates.NOT_REQD:
        autopilotColor = 'url(#blue-indicator-gradient)'
        break

      case handsOnStates.REQD_NOT_DETECTED:
        autopilotColor = 'url(#yellow-indicator-gradient)'
        break

      case handsOnStates.REQD_VISUAL:
        autopilotColor = 'url(#orange-indicator-gradient)'
        break

      case handsOnStates.REQD_CHIME_1:
      case handsOnStates.REQD_CHIME_2:
      case handsOnStates.REQD_SLOWING:
      case handsOnStates.REQD_STRUCK_OUT:
      case handsOnStates.SUSPENDED:
        autopilotColor = 'url(#red-indicator-gradient)'
        break

      // no default
    }
  }

  // determine if the car has broken traction
  var traction = true

  // determine what message should be displayed, if any (highest priority indicator is
  // shown)
  var indicatorText
  var indicatorColor
  if (!traction) {
    indicatorText = 'TRACTION'
    indicatorColor = 'url(#yellow-indicator-gradient)'
  } else if (holding) {
    indicatorText = 'HOLDING'
    indicatorColor = 'url(#yellow-indicator-gradient)'
  } else if (braking) {
    indicatorText = 'BRAKING'
    indicatorColor = 'url(#red-indicator-gradient)'
  } else if (autopilot) {
    indicatorText = 'AUTOPILOT'
    indicatorColor = autopilotColor
  }

  return (
    <BannerIndicator visible={indicatorText} text={indicatorText} color={indicatorColor} />
  )
}
