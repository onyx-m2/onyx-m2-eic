import React from 'react'
import ChassisPaperDoll from './ChassisPaperDoll'
import SecondaryDisplay from './SecondaryDisplay'

export default function BrakeTemperatureDisplay(props) {
  return (
    <SecondaryDisplay name='BRAKES'>
      <ChassisPaperDoll units='deg' scale={1}
        fl='DI_brakeFLTemp'
        fr='DI_brakeFRTemp'
        rl='DI_brakeRLTemp'
        rr='DI_brakeRRTemp'
      />
    </SecondaryDisplay>
  )
}
