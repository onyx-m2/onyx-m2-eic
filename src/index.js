import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { M2Provider, SignalProvider } from 'onyx-m2-react';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// eslint-disable-next-line import/no-webpack-loader-syntax
import dbcFile from '!!raw-loader!./assets/tesla_model3.dbc';

const dbcUrl = process.env.REACT_APP_CONFIG_DBCURL || 'https://raw.githubusercontent.com/onyx-m2/dbc/master/tesla_model3.dbc'

const params = new URLSearchParams(window.location.search)
const server = global.M2?.getPreference('server_hostname') || params.get('server')
const pin = global.M2?.getPreference('server_pin') || params.get('pin')
const secure = params.get('secure') || 'true'

// BLE interface
const BLE_SERVICE_NAME = "Onyx M2"
const BLE_SERVICE_UUID = "e9377e45-d4d2-4fdc-9e1c-448d8b4e05d5"

async function pairBleDevice() {
  try {
    await navigator.bluetooth.requestDevice({
      filters: [{
        name: BLE_SERVICE_NAME
      }],
      optionalServices: [BLE_SERVICE_UUID]
    })
    init()
  }
  catch (err) {
    alert(`Unable to pair with Onyx M2 device: ${err}`)
  }
}

async function init() {
  // if neither the native interface or a web server is available, try the BLE interface
  let ble = null
  if (!global.M2 && !server) {
    if (await navigator.bluetooth.getAvailability()) {
      const devices = await navigator.bluetooth.getDevices()
      if (devices) {
        ble = devices[0]
      }
    }
  }
  if ((!server || !pin) && !ble) {
    return ReactDOM.render(
      <div style={{color: 'white'}}>
        <h1>Instrument cluster not configured properly</h1>
        <p>
          Run from the Onyx M2 mobile app, or
          pass in <code>server</code> and <code>pin</code> parameters in the url. You may
          also try to connect directly using Bluetooth by pairing the Onyx M2 device
          using the button below.
        </p>
        <button onClick={pairBleDevice}>
          Pair using Bluetooth
        </button>
      </div>,
      document.getElementById('root')
    )
  }

  //console.log(`Loading DBC from url "${dbcUrl}"`)
  //const { data: dbcFile } = await axios(dbcUrl)
  ReactDOM.render(
    <React.StrictMode>
      <M2Provider config={{ ble, server, pin, secure }} dbcFile={dbcFile}>
        <SignalProvider>
          <App />
        </SignalProvider>
      </M2Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}
init()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({

  // when an update is available, skip the waiting period and just apply
  // immediately
  onUpdate: registration => {
    console.info('Received update, applying now')
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
    window.location.reload()
  },

  // once we're all set, periodically check whether there is an update
  // available
  onSuccess: registration => {
    console.info('Service worker installed, starting to poll for updates')
    setInterval(async () => {
      await registration.update()
    }, 60 * 1000)
  }
})