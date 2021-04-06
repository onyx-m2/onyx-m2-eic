import React, { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNamedValuesSignalState, useSignalState } from 'onyx-m2-react'
import DriveDisplay from '../displays/DriveDisplay';
import ParkDisplay from '../displays/ParkDisplay';
import IdleDisplay from '../displays/IdleDisplay';
import ChargeDisplay from '../displays/ChargeDisplay';
import TirePressureDisplay from '../displays/TirePressureDisplay';
import TireTemperatureDisplay from '../displays/TireTemperatureDisplay';
import BrakeTemperatureDisplay from '../displays/BrakeTemperatureDisplay';

// List of secondary displays that can be manually flipped through on the center
// cluster
const SECONDARY_DISPLAYS = [
  TirePressureDisplay,
  TireTemperatureDisplay,
  BrakeTemperatureDisplay
]

/**
 * The display selector decides what display should be currently presented based
 * on the car's current state: parked, driving, or charging. It also allows secondary
 * displays to replace any of these, using the right scroll wheel to flip through them.
 */
export function DisplaySelector() {
  const [ gear, gearStates ] = useNamedValuesSignalState('DI_gear', 'SNA')
  const [ state, states ] = useNamedValuesSignalState('BMS_state', 'STANDBY')

  const scrollTicks = useSignalState('VCLEFT_swcRightScrollTicks', 0)
  const [ display, setDisplay ] = useState(0)
  const cycleDisplaysUp = useDebouncedCallback(() => {
    setDisplay(prev => prev < SECONDARY_DISPLAYS.length ? prev + 1 : 0)
  }, 200)
  const cycleDisplaysDown = useDebouncedCallback(() => {
    setDisplay(prev => prev > 0 ? prev - 1 : SECONDARY_DISPLAYS.length)
  }, 200)

  if (scrollTicks > 0) {
    cycleDisplaysUp()
  }
  else if (scrollTicks < 0) {
    cycleDisplaysDown()
  }

  // simulation for scroll wheel using up and down keys on a pc
  useHotkeys('up', () => cycleDisplaysUp())
  useHotkeys('down', () => cycleDisplaysUp())

  if (display !== 0) {
    return React.createElement(SECONDARY_DISPLAYS[display - 1], {})
  }

  // all the displays below are "zero" displays (i.e. defaults) that are
  // shown based on the state of the car

  // if the car is charging, default display is the charge display
  if (state === states.CHARGE) {
    return (
      <ChargeDisplay />
    )
  }

  // if there's no signal from the drive inverter, default display is the idle display
  if (gear === gearStates.SNA) {
    return (
      <IdleDisplay />
    )
  }

  // if the car is in P gear, the default display is the park displace
  if (gear === gearStates.P) {
    return (
      <ParkDisplay />
    )
  }

  // for any other case case, the car is in motion so that default display is the
  // drive display
  return (
    <DriveDisplay />
  )
}
