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

// Trip meter could be "display" with clock (arrival time) and hourglass (time to dest)

// TODO LIST
// - Consumption sub value
// - Max speed / power subvalues with triangles (that reset to current speed after 10s)
// - Dynamic speed limits

// NICE TO HAVE
// - On/off with main screen (UI_displayOn 1/0)
// - Brightness sync
// - blindspot indicators

// BUGS
// - Coming off the accelerator, the power needle bounces before resetting to "normal" values
// - Vertical alignment of digital value is different on phone

// Driving cluster
// Big left: speed, black when under speed limit, yellow when over but not in speeding ticket range, red when over a lot, limits 0 - 200?

// Use subvalues for speed limit and/or current throttle?
// Or recent max speed?
// https://js.devexpress.com/Demos/WidgetsGallery/Demo/Gauges/DifferentSubvalueIndicatorTypes/React/DarkViolet/

// custom tick intervals
// https://js.devexpress.com/Demos/WidgetsGallery/Demo/Gauges/ScaleCustomTickInterval/React/DarkViolet/
// https://js.devexpress.com/Demos/WidgetsGallery/Demo/Gauges/ScaleCustomTickValues/React/DarkViolet/

/* Excessive speeding law ---> RED!
40 km/h or more in a zone where the speed limit is 60 km/h or less
50 km/h or more in a zone where the speed limit is over 60 km/h and up to 90 km/h
60 km/h or more in a zone where the speed limit is 100 km/h or over
*/

// Big right: power, zero at 1/3, green on regen, red/black on discharge? limits dynamic based on data
// Use range container for red/green
// https://js.devexpress.com/Demos/WidgetsGallery/Demo/Gauges/CustomLayout/React/DarkViolet/

// Maybe have rings for pedal position and torque
// Linear bar under big gauges for lane keeping (black/yellow/red depending on distance)
// https://js.devexpress.com/Demos/WidgetsGallery/Demo/Gauges/DifferentValueIndicatorTypesLinearGauge/React/DarkViolet/

// small gauges for
// battery level + temp
// stator + inv temps
// trip consumption / time
// tpms

// hands on steering wheel indicator?
// break light on?
// hold on?
// gear selection

// lower middle widget
// 1. tire pressure / 4w
// 2. tire temps / 4w
// 3. brake temps / 4w
// 4. brake torque / 4w
// 5. g-force pad
// 6. steering? / angle + speed
// 7. oil flow + temp?
// 8. batt info / kwh - v - a - degC
// 9. PTC kW
// 10. trip meter?

/**
 * Component that displays ...
 * @component
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

  // if (!m2IsOnline) {
  //   return (
  //     <LogoDisplay />
  //   )
  // }

  // const cabinTemp = useSignalState('VCFRONT_tempAmbientFiltered', 0)
  // const outsideTemp = useSignalState('', 0)
  // const batteryTemp = useSignalState('BMS_thermistorTMin', 0)
  // const inverterTemp = useSignalState('DI_inverterT', 0)
  // const statorTemp = useSignalState('DI_statorT', 0)

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

// const LogoDisplay = styled.div`
//   position: absolute;
//   left: 0;
//   top: 0;
//   width: 100vw;
//   height: 100vh;
//   background-image: url(${OnyxLogo});
//   background-repeat: no-repeat;
//   background-position: center;
//   background-size: contain;
// `
