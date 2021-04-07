import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { M2Provider, SignalProvider } from 'onyx-m2-react';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const dbcUrl = process.env.REACT_APP_CONFIG_DBCURL || 'https://raw.githubusercontent.com/onyx-m2/dbc/master/tesla_model3.dbc'

const params = new URLSearchParams(window.location.search)
const server = global.M2?.getPreference('server_hostname') || params.get('server') || process.env.REACT_APP_CONFIG_SERVER
const pin = global.M2?.getPreference('server_pin') || params.get('pin') || process.env.REACT_APP_CONFIG_PIN
const secure = params.get('secure') || process.env.REACT_APP_CONFIG_SECURE || 'true'

async function init() {
  if (!server || !pin) {
    return ReactDOM.render(
      <h1 style={{color: 'white'}}>
        Instrument cluster not configured properly. Run from the Onyx M2 mobile app, or
        pass in <code>server</code> and <code>pin</code> parameters in the url.
      </h1>,
      document.getElementById('root')
    )
  }

  console.log(`Loading DBC from url "${dbcUrl}"`)
  const { data: dbcFile } = await axios(dbcUrl)
  ReactDOM.render(
    <React.StrictMode>
      <M2Provider config={{ server, pin, secure }} dbcFile={dbcFile}>
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
serviceWorker.register()