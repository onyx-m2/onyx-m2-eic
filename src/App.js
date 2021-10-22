import React, { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { ThemeProvider } from 'styled-components'
import { useSignalHotkeySimulation, useSignalState } from 'onyx-m2-react'

import { DAY_THEME, NIGHT_THEME } from './theme'
import RightCluster from './components/clusters/RightCluster'
import LeftTurnIndicator from './components/indicators/LeftTurnIndicator'
import RightTurnIndicator from './components/indicators/RightTurnIndicator'
import GearIndicator from './components/indicators/GearIndicator'
import CenterCluster from './components/clusters/CenterCluster'
import SvgCanvas, { SvgDefs } from './components/SvgCanvas'
import LeftCluster from './components/clusters/LeftCluster'
import { LeftStatusTextValue, RightStatusTextValue } from './components/Base'

// TODO LIST
// - Display: Drivetrain temps & coolants (inv, stator, oil pump, coolant flow)
// - Display: g-force pad
// - Display: batt energy summary (kwh ac, dc, regen, discharge)
// - Consumption indicator (i.e. trip meter)
// - Blind spot indicators

// QUESTIONS
// Use another ring current throttle?
// Maybe have rings for pedal position and torque
// Maybe a draggy like display?

const BUTTON_SNA = 0
const BUTTON_OFF = 1
const BUTTON_ON = 2

/**
 * The app component handles on/off, turn indicators, the status area,
 * the hotkey simulator (for testing on pc), and the design layout "grid". Everything
 * else is delegated to the left, center, and right cluster components.
 */
export default function App(props) {
  const isSunUp = useSignalState('UI_isSunUp', true)
  const theme = isSunUp ? DAY_THEME : NIGHT_THEME

  const leftButtonPressed = useSignalState('VCLEFT_swcLeftPressed', BUTTON_SNA)
  const rightButtonPressed = useSignalState('VCLEFT_swcRightPressed', BUTTON_SNA)

  const [ layoutGridVisible, setLayoutGridVisible ] = useState(false)
  useHotkeys('end', () => setLayoutGridVisible(visible => !visible))

  const displayOn = useSignalState('UI_displayOn', 0)

  useSignalHotkeySimulation({

    // turn on the display
    'home': [
      ['UI_displayOn', 1]
    ],

    // set the car to "ready" state, the o is for 'odometer on'
    'o': [
      ['DI_odometer', 69420],
      ['UI_usableSOC', 70],
      ['BMS_thermistorTMin', 21],
      ['BMS_thermistorTMax', 22],
      ['DAS_fusedSpeedLimit', 100],
      ['UI_expectedRange', 300],
      ['UI_ratedConsumption', 137],
      ['DI_sysDrivePowerMax', 200],
      ['DI_sysRegenPowerMax', 30]
    ],

    // gear selection
    'p': [['DI_gear', 'P']],
    'r': [['DI_gear', 'R']],
    'n': [['DI_gear', 'N']],
    'd': [['DI_gear', 'D']],

    // hit the brakes
    'b': [
      ['VCLEFT_brakeLightStatus', 'ON'],
      ['DI_uiSpeed', 0],
      ['DI_elecPower', -20],
      ['BMS_packCurrent', -52],
    ],

    // hit the accelerator
    'a': [
      ['VCLEFT_brakeLightStatus', 0],
      ['DI_uiSpeed', 50],
      ['DI_elecPower', 144],
      ['BMS_packCurrent', 100],
    ],

    'left': [
      ['VCLEFT_turnSignalStatus', 'ON']
    ],

    'right': [
      ['VCRIGHT_turnSignalStatus', 'ON']
    ]

  })

  // if both steering wheel buttons are pressed in at the same time, reload the eic, which
  // is similar to what Tesla does with the main screen "reboot" (but you must hold the
  // buttons longer to reboot the main screen)
  if (leftButtonPressed === BUTTON_ON && rightButtonPressed === BUTTON_ON) {
    window.location.reload()
  }

  // clock indicator (cannot use "real" time, because if the car is started somewhere
  // out of range of wifi, there won't be a clock update)
  const time = useSignalState('UTC_unixTime', NaN)
  var timeText
  if (!isNaN(time)) {
    timeText = new Date(time * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }).toLocaleLowerCase()
  }

  // ambient (outside) temperature indicator
  const ambientTemp = useSignalState('VCFRONT_tempAmbientFiltered', NaN)
  var ambientTempText
  if (!isNaN(ambientTemp)) {
    ambientTempText = `${ambientTemp.toFixed(0)} °c`
  }

  // this would/will be relevant with a permanent installation, not with a phone
  // you take with you
  if (!displayOn) {
    return (
      null
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <SvgCanvas className='InstrumentCluster'>
        <SvgDefs />
        {layoutGridVisible &&
          <LayoutGrid />
        }
        <LeftTurnIndicator />
        <RightTurnIndicator />
        <LeftCluster />
        <CenterCluster />
        <RightCluster/>
        <path className='Separator'
          strokeWidth='0.5'
          stroke={theme.color.primary}
          fill='none'
          d='M -100 40
              h 56
              c 6 0, 6 5, 12 5
              h 64
              c 6 0, 6 -5, 12 -5
              h 56'
        />
        <LeftStatusTextValue>{timeText}</LeftStatusTextValue>
        <RightStatusTextValue>{ambientTempText}</RightStatusTextValue>
        <GearIndicator />
      </SvgCanvas>
    </ThemeProvider>
  )
}

function LayoutGrid(props) {
  const r = 47
  return (
    <g className='LayoutGrid'>

      {/* Origin crosshair */}
      <circle r='2' fill='grey' />
      <line x1='0' x2='0' y1={-r} y2={r} strokeWidth={0.5} stroke='grey' />
      <line x1='-100' x2='100' y1='0' y2='0' strokeWidth={0.5} stroke='grey' />

      {/* Main dial */}
      <circle r={r} strokeWidth={0.5} stroke='grey' fill='none' />
      <line x1='0' x2='-29' y1='0' y2='32' strokeWidth={0.5} stroke='grey'/>
      <line x1='0' x2='29' y1='0' y2='32' strokeWidth={0.5} stroke='grey'/>

      {/* indicator area */}
      <line x1='-100' x2='100' y1='-39' y2='-39' strokeWidth={0.5} stroke='grey' />

      {/* Status area */}
      <line x1='-100' x2='100' y1='34' y2='34' strokeWidth={0.5} stroke='grey' />
      <line x1='-100' x2={-r} y1='43' y2='43' strokeWidth={0.5} stroke='grey' />
      <line x1={-r} x2={-r} y1='34' y2='52' strokeWidth={0.5} stroke='grey' />
      <line x1={r} x2='100' y1='43' y2='43' strokeWidth={0.5} stroke='grey' />
      <line x1={r} x2={r} y1='34' y2='52' strokeWidth={0.5} stroke='grey' />

    </g>
  )
}
