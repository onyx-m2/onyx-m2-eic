import React from 'react'
import ChassisPaperDoll from './ChassisPaperDoll'
import SecondaryDisplay from './SecondaryDisplay'

export default function TireTemperatureDisplay(props) {
  return (
    <SecondaryDisplay name='TIRES'>
      <ChassisPaperDoll units='deg' scale={1}
        fl='TPMS_temperatureFL'
        fr='TPMS_temperatureFR'
        rl='TPMS_temperatureRL'
        rr='TPMS_temperatureRR'
      />
    </SecondaryDisplay>
  )
}
