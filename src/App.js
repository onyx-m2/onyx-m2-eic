import React, { useState, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { ThemeProvider } from 'styled-components'
import { useSignalHotkeySimulation, useSignalState } from 'onyx-m2-react'

import { INSTRUMENTS_THEME } from './theme'
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
// - Display: brake torque
// - Display: g-force pad
// - Display: batt energy summary (kwh ac, dc, regen, discharge)
// - Consumption indicator (i.e. trip meter)
// - Blind spot indicators

// QUESTIONS
// Use another ring current throttle?
// Maybe have rings for pedal position and torque
// Maybe a draggy like displau?

/**
 * The app component handles on/off, turn indicators, the status area,
 * the hotkey simulator (for testing on pc), and the design layout "grid". Everything
 * else is delegated to the left, center, and right cluster components.
 */
export default function App(props) {
  const theme = INSTRUMENTS_THEME

  const [ layoutGridVisible, setLayoutGridVisible ] = useState(false)
  useHotkeys('end', () => setLayoutGridVisible(visible => !visible))

  const displayOn = 1//useSignalState('UI_displayOn', 0)
  //const [ m2IsOnline ] = useStatusState({forceOnlineKey: 'pageup', forceOfflineKey: 'pagedown'})

  useSignalHotkeySimulation({

    // turn on the display
    'home': [
      ['UI_displayOn', 1],
      ['UI_usableSOC', 69]
    ],

    // set the car to "ready" state, (o)dometer on
    'o': [
      ['DI_odometer', 69420],
      ['DI_gear', 'P'],
      ['DI_sysDrivePowerMax', 200],
      ['DI_sysRegenPowerMax', 60]
    ],

    // gear selection
    'p': [['DI_gear', 'P']],
    'r': [['DI_gear', 'R']],
    'n': [['DI_gear', 'N']],
    'd': [['DI_gear', 'D']],

    // hit the (b)rakes
    'b': [
      ['VCLEFT_brakeLightStatus', 'ON'],
      ['DI_uiSpeed', 0],
      ['DI_elecPower', -20],
      ['BMS_packCurrent', -52],
    ],

    // hit the (a)ccelerator
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

  // clock indicator
  const [ time, setTime ] = useState()
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }).toLocaleLowerCase())
    }, 1000);
    return () => clearInterval(id)
  }, [])

  // ambient (outside) temperature indicator
  const ambientTemp = useSignalState('VCFRONT_tempAmbientFiltered', NaN)
  let ambientTempText = '-'
  if (!isNaN(ambientTemp)) {
    ambientTempText = ambientTemp.toFixed(0)
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
        <path className='Separator' strokeWidth='0.5' stroke={theme.indicator.white} fill='none'
          d='M -100 34
              h 56
              c 6 0, 6 5, 12 5
              h 64
              c 6 0, 6 -5, 12 -5
              h 56'
        />
        <LeftStatusTextValue>{time}</LeftStatusTextValue>
        <RightStatusTextValue>{ambientTempText}°c</RightStatusTextValue>
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
