import React from 'react'
import ChassisPaperDoll from './ChassisPaperDoll'
import SecondaryDisplay from './SecondaryDisplay'

export default function TirePressureDisplay(props) {
  return (
    <SecondaryDisplay name='TIRE PRESSURE'>
      <ChassisPaperDoll units='psi' scale={14.5038}
        fl='TPMS_pressureFL'
        fr='TPMS_pressureFR'
        rl='TPMS_pressureRL'
        rr='TPMS_pressureRR'
      />
    </SecondaryDisplay>
  )
}
